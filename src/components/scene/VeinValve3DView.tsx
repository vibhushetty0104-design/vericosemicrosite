/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCcw, Eye, ShieldCheck, AlertTriangle } from 'lucide-react';

interface VeinValve3DViewProps {
  stageId: number; // 1 to 5
  valveState: 'open' | 'closed' | 'incompetent';
  flowDirection: 'upward' | 'filling' | 'halted' | 'retrograde';
  className?: string;
  isPaused?: boolean;
}

interface ErythrocyteData {
  mesh: THREE.Mesh;
  baseX: number;
  baseZ: number;
  y: number;
  speed: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
}

export const VeinValve3DView: React.FC<VeinValve3DViewProps> = ({
  stageId,
  valveState,
  flowDirection,
  className = '',
  isPaused = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [cameraRotated, setCameraRotated] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // References for animation state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const erythrocytesRef = useRef<ErythrocyteData[]>([]);

  // 3D Objects that morph across stages
  const leftLeafletRef = useRef<THREE.Mesh | null>(null);
  const rightLeafletRef = useRef<THREE.Mesh | null>(null);
  const veinMeshRef = useRef<THREE.Mesh | null>(null);
  const leftMuscleRef = useRef<THREE.Mesh | null>(null);
  const rightMuscleRef = useRef<THREE.Mesh | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);

  // Target animation parameters
  const targetsRef = useRef({
    leafletAngle: 0.22,
    leafletGap: 0,
    muscleSqueeze: 0,
    flowVelocity: 0.02,
  });

  // Current interpolated values
  const currentRef = useRef({
    leafletAngle: 0.22,
    leafletGap: 0,
    muscleSqueeze: 0,
    flowVelocity: 0.02,
  });

  // Pointer drag controls (restricted subtle orbit)
  const pointerRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    targetRotY: 0,
    targetRotX: 0,
    currentRotY: 0,
    currentRotX: 0,
  });

  // Reduced motion detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Update target values based on stage
  useEffect(() => {
    switch (stageId) {
      case 1: // Calf Contraction: inward muscle squeeze, vein narrowing, forward flow starts
        targetsRef.current = {
          leafletAngle: 0.25,
          leafletGap: 0,
          muscleSqueeze: 1.0,
          flowVelocity: 0.035,
        };
        break;
      case 2: // Blood Moves Upward: leaflets pressed wide against vessel wall
        targetsRef.current = {
          leafletAngle: 0.52,
          leafletGap: 0,
          muscleSqueeze: 0.7,
          flowVelocity: 0.065,
        };
        break;
      case 3: // Calf Relaxes: muscles return to resting shape, vein re-expands
        targetsRef.current = {
          leafletAngle: 0.18,
          leafletGap: 0,
          muscleSqueeze: 0.0,
          flowVelocity: 0.015,
        };
        break;
      case 4: // Competent Valve: leaflets meet tightly at midline, halting backward flow
        targetsRef.current = {
          leafletAngle: 0.0,
          leafletGap: 0,
          muscleSqueeze: 0.0,
          flowVelocity: 0.001,
        };
        break;
      case 5: // Incompetent Valve: leaflets fail to coapt, leaving persistent central gap with reflux
        targetsRef.current = {
          leafletAngle: 0.16,
          leafletGap: 0.32,
          muscleSqueeze: 0.0,
          flowVelocity: -0.045,
        };
        break;
      default:
        break;
    }
  }, [stageId]);

  // Reset 3D camera angle
  const handleResetCamera = useCallback(() => {
    pointerRef.current.targetRotX = 0;
    pointerRef.current.targetRotY = 0;
    setCameraRotated(false);
  }, []);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 440;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      rendererRef.current = renderer;
    } catch {
      setWebGLSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);
    cameraRef.current = camera;

    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // -------------------------------------------------------------
    // 1. LIGHTING
    // -------------------------------------------------------------
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(3.0, 4.5, 5.0);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xaad4c8, 1.4);
    rimLight.position.set(-3.5, -2.0, 3.5);
    scene.add(rimLight);

    const vascularGlow = new THREE.PointLight(0xce5b40, 1.2, 12);
    vascularGlow.position.set(0, 0.25, 2.0);
    scene.add(vascularGlow);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    // -------------------------------------------------------------
    // 2. VEIN WALL (Cutaway Cylinder with realistic wall thickness)
    // -------------------------------------------------------------
    const veinRadius = 1.15;
    const veinHeight = 4.8;
    const veinGeo = new THREE.CylinderGeometry(
      veinRadius,
      veinRadius,
      veinHeight,
      36,
      1,
      true, // open-ended
      -Math.PI * 0.2, // start angle
      Math.PI * 1.4 // cutaway angle exposing front
    );

    const veinMat = new THREE.MeshStandardMaterial({
      color: 0x1a5e50, // Meridian forest-teal vein
      roughness: 0.25,
      metalness: 0.15,
      transparent: true,
      opacity: 0.58,
      side: THREE.DoubleSide,
    });

    const veinMesh = new THREE.Mesh(veinGeo, veinMat);
    veinMeshRef.current = veinMesh;
    rootGroup.add(veinMesh);

    // Connective tissue rings at top and bottom of cutaway
    const rimGeo = new THREE.TorusGeometry(veinRadius, 0.045, 12, 36, Math.PI * 1.4);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x8daa9d,
      roughness: 0.4,
    });
    const topRim = new THREE.Mesh(rimGeo, rimMat);
    topRim.rotation.x = Math.PI / 2;
    topRim.rotation.z = -Math.PI * 0.2;
    topRim.position.y = veinHeight / 2;
    rootGroup.add(topRim);

    const bottomRim = topRim.clone();
    bottomRim.position.y = -veinHeight / 2;
    rootGroup.add(bottomRim);

    // -------------------------------------------------------------
    // 3. SURROUNDING CALF MUSCLE FORMS (Gastrocnemius / Soleus)
    // -------------------------------------------------------------
    const muscleGeo = new THREE.CylinderGeometry(0.7, 0.95, 4.4, 24);
    const muscleMat = new THREE.MeshStandardMaterial({
      color: 0x853323, // Deep striated skeletal muscle
      roughness: 0.6,
      metalness: 0.05,
      transparent: true,
      opacity: 0.42,
    });

    const leftMuscle = new THREE.Mesh(muscleGeo, muscleMat);
    leftMuscle.position.set(-1.85, 0, -0.3);
    leftMuscle.scale.set(0.9, 1, 0.7);
    leftMuscleRef.current = leftMuscle;
    rootGroup.add(leftMuscle);

    const rightMuscle = new THREE.Mesh(muscleGeo, muscleMat);
    rightMuscle.position.set(1.85, 0, -0.3);
    rightMuscle.scale.set(0.9, 1, 0.7);
    rightMuscleRef.current = rightMuscle;
    rootGroup.add(rightMuscle);

    // -------------------------------------------------------------
    // 4. BICUSPID VENOUS VALVE LEAFLETS
    // -------------------------------------------------------------
    const leafletMat = new THREE.MeshStandardMaterial({
      color: 0xf0f7f3, // Pale endothelial leaflet
      roughness: 0.2,
      metalness: 0.05,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });

    function createCuspGeometry() {
      const w = 1.0;
      const h = 0.9;
      const geo = new THREE.PlaneGeometry(w, h, 16, 16);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = (pos.getX(i) + w / 2) / w; // 0 to 1 across width
        const v = (pos.getY(i) + h / 2) / h; // 0 to 1 bottom to free margin
        const pocket = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.38;
        const curve = Math.cos(u * Math.PI - Math.PI / 2) * 0.2;
        pos.setZ(i, pocket + curve);
      }
      geo.computeVertexNormals();
      return geo;
    }

    const leftCuspGeo = createCuspGeometry();
    const leftLeaflet = new THREE.Mesh(leftCuspGeo, leafletMat);
    leftLeaflet.position.set(-0.48, 0.2, 0);
    leftLeafletRef.current = leftLeaflet;
    rootGroup.add(leftLeaflet);

    const rightCuspGeo = createCuspGeometry();
    const rightLeaflet = new THREE.Mesh(rightCuspGeo, leafletMat);
    rightLeaflet.position.set(0.48, 0.2, 0);
    rightLeaflet.rotation.y = Math.PI; // mirrored
    rightLeafletRef.current = rightLeaflet;
    rootGroup.add(rightLeaflet);

    // -------------------------------------------------------------
    // 5. ERYTHROCYTES (3D Biconcave Red Blood Cell Discs)
    // -------------------------------------------------------------
    const rbcPoints: THREE.Vector2[] = [];
    for (let deg = 0; deg <= 180; deg += 12) {
      const rad = (deg * Math.PI) / 180;
      // Authentic biconcave profile: thinner in center, thicker rim
      const r = 0.13 * Math.sin(rad);
      const z = 0.04 * Math.cos(rad) * (1 - 0.42 * Math.sin(rad));
      rbcPoints.push(new THREE.Vector2(r, z));
    }
    const rbcGeo = new THREE.LatheGeometry(rbcPoints, 16);

    const rbcMat = new THREE.MeshStandardMaterial({
      color: 0xc42e18, // Rich oxygen-depleted venous erythrocyte crimson
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95,
    });

    const erythrocyteCount = 50;
    const rbcList: ErythrocyteData[] = [];

    for (let i = 0; i < erythrocyteCount; i++) {
      const rbcMesh = new THREE.Mesh(rbcGeo, rbcMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (veinRadius - 0.25);
      const bx = Math.cos(angle) * radius;
      const bz = Math.sin(angle) * radius * 0.75;
      const y = -2.2 + Math.random() * 4.4;

      rbcMesh.position.set(bx, y, bz);
      rbcMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      rootGroup.add(rbcMesh);

      rbcList.push({
        mesh: rbcMesh,
        baseX: bx,
        baseZ: bz,
        y,
        speed: 0.016 + Math.random() * 0.014,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        rotSpeedZ: (Math.random() - 0.5) * 0.03,
      });
    }
    erythrocytesRef.current = rbcList;

    // -------------------------------------------------------------
    // 6. ANIMATION & RENDER LOOP
    // -------------------------------------------------------------
    let isIntersecting = true;
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    });
    observer.observe(container);

    const renderLoop = () => {
      animFrameRef.current = requestAnimationFrame(renderLoop);
      if (!isIntersecting) return;

      // Always interpolate targets smoothly
      const lerpFactor = 0.06;
      currentRef.current.leafletAngle +=
        (targetsRef.current.leafletAngle - currentRef.current.leafletAngle) * lerpFactor;
      currentRef.current.leafletGap +=
        (targetsRef.current.leafletGap - currentRef.current.leafletGap) * lerpFactor;
      currentRef.current.muscleSqueeze +=
        (targetsRef.current.muscleSqueeze - currentRef.current.muscleSqueeze) * lerpFactor;
      currentRef.current.flowVelocity +=
        (targetsRef.current.flowVelocity - currentRef.current.flowVelocity) * lerpFactor;

      const angle = currentRef.current.leafletAngle;
      const gap = currentRef.current.leafletGap;
      const squeeze = currentRef.current.muscleSqueeze;
      const velocity = currentRef.current.flowVelocity;

      // 1. Leaflet opening/closing animation
      if (leftLeafletRef.current && rightLeafletRef.current) {
        leftLeafletRef.current.rotation.z = -angle;
        rightLeafletRef.current.rotation.z = -angle;
        leftLeafletRef.current.position.x = -0.48 - gap / 2;
        rightLeafletRef.current.position.x = 0.48 + gap / 2;
      }

      // 2. Vein and Muscle Compression
      if (veinMeshRef.current) {
        const veinScaleX = 1.0 - squeeze * 0.11;
        veinMeshRef.current.scale.set(veinScaleX, 1.0, 1.0 + squeeze * 0.05);
      }

      if (leftMuscleRef.current && rightMuscleRef.current) {
        leftMuscleRef.current.position.x = -1.85 + squeeze * 0.22;
        rightMuscleRef.current.position.x = 1.85 - squeeze * 0.22;
        leftMuscleRef.current.scale.x = 0.9 + squeeze * 0.18;
        rightMuscleRef.current.scale.x = 0.9 + squeeze * 0.18;
      }

      // 3. Erythrocyte Movement (active when not paused and not reduced motion)
      const shouldMoveCells = !isPaused && !prefersReducedMotion;
      const valveY = 0.2;
      const rbcs = erythrocytesRef.current;

      for (let i = 0; i < rbcs.length; i++) {
        const r = rbcs[i];

        if (shouldMoveCells) {
          r.y += velocity * (r.speed / 0.02);

          // Boundaries and wrapping
          if (velocity > 0 && r.y > 2.3) {
            r.y = -2.3;
          } else if (velocity < 0 && r.y < -2.3) {
            r.y = 2.3;
          }

          // Competent valve halt (Stage 4)
          if (stageId === 4 && r.y > valveY && r.y < valveY + 0.2) {
            r.y = valveY + 0.2;
          }

          // Incompetent valve channeling (Stage 5)
          if (stageId === 5 && r.y > valveY - 0.3 && r.y < valveY + 0.3) {
            r.mesh.position.x = r.baseX * 0.32;
          } else {
            r.mesh.position.x = r.baseX;
          }

          r.mesh.rotation.x += r.rotSpeedX;
          r.mesh.rotation.y += r.rotSpeedY;
          r.mesh.rotation.z += r.rotSpeedZ;
        }

        r.mesh.position.y = r.y;
      }

      // 4. Smooth user pointer drag rotation (restricted orbit)
      const p = pointerRef.current;
      p.currentRotY += (p.targetRotY - p.currentRotY) * 0.1;
      p.currentRotX += (p.targetRotX - p.currentRotX) * 0.1;

      if (rootGroupRef.current) {
        rootGroupRef.current.rotation.y = p.currentRotY;
        rootGroupRef.current.rotation.x = p.currentRotX;
      }

      // Always render!
      renderer.render(scene, camera);
    };

    renderLoop();

    // -------------------------------------------------------------
    // 7. RESIZE OBSERVER
    // -------------------------------------------------------------
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w === 0 || h === 0) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    });
    resizeObserver.observe(container);

    // Initial resize trigger
    setTimeout(() => {
      if (container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        }
      }
    }, 50);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
      resizeObserver.disconnect();

      veinGeo.dispose();
      veinMat.dispose();
      rimGeo.dispose();
      rimMat.dispose();
      muscleGeo.dispose();
      muscleMat.dispose();
      leftCuspGeo.dispose();
      rightCuspGeo.dispose();
      leafletMat.dispose();
      rbcGeo.dispose();
      rbcMat.dispose();
      renderer.dispose();
    };
  }, [stageId, isPaused, prefersReducedMotion]);

  // Pointer drag listeners for interactive inspection
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerRef.current.isDragging = true;
    pointerRef.current.startX = e.clientX;
    pointerRef.current.startY = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerRef.current.isDragging) return;
    const deltaX = (e.clientX - pointerRef.current.startX) * 0.005;
    const deltaY = (e.clientY - pointerRef.current.startY) * 0.005;

    const maxRotX = Math.PI / 7;
    const maxRotY = Math.PI / 6;

    pointerRef.current.targetRotY = Math.max(-maxRotY, Math.min(maxRotY, pointerRef.current.targetRotY + deltaX));
    pointerRef.current.targetRotX = Math.max(-maxRotX, Math.min(maxRotX, pointerRef.current.targetRotX + deltaY));

    pointerRef.current.startX = e.clientX;
    pointerRef.current.startY = e.clientY;

    if (!cameraRotated) setCameraRotated(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointerRef.current.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] sm:min-h-[440px] rounded-2xl bg-gradient-to-b from-[#FAF7F2] via-white to-[#F0EDE6] border border-mv-outline/50 shadow-inner overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Floating Badge */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-mv-forest/90 text-white backdrop-blur-md shadow-xs">
          <Eye className="w-3.5 h-3.5 text-mv-terracotta" />
          <span>Cutaway 3D Lumen</span>
        </span>

        {cameraRotated && (
          <button
            type="button"
            onClick={handleResetCamera}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-mono text-mv-forest bg-white/90 border border-mv-outline/70 hover:bg-white shadow-2xs backdrop-blur-xs transition-all cursor-pointer"
            title="Reset 3D camera orientation"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset View</span>
          </button>
        )}
      </div>

      {/* Valve Status Badge Top Right */}
      <div className="absolute top-3.5 right-3.5 z-20">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold shadow-2xs backdrop-blur-md border ${
            valveState === 'incompetent'
              ? 'bg-mv-terracotta/95 text-white border-mv-terracotta'
              : valveState === 'closed'
              ? 'bg-mv-forest/90 text-white border-mv-forest'
              : 'bg-white/95 text-mv-forest border-mv-outline/70'
          }`}
        >
          {valveState === 'incompetent' ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
              <span>Incompetent Gap</span>
            </>
          ) : valveState === 'closed' ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Coapted Seal</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-mv-sage animate-ping" />
              <span>Leaflets Open</span>
            </>
          )}
        </span>
      </div>

      {/* 3D WebGL Canvas */}
      {webGLSupported ? (
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
          style={{ touchAction: 'none' }}
          aria-label="Interactive 3D model of venous valve leaflets and flowing erythrocytes"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center p-6 text-center text-mv-ink-muted">
          <p className="text-[13px] font-mono">3D hardware acceleration is currently disabled. Please view the full anatomical leg diagram on the left.</p>
        </div>
      )}

      {/* Subtle Hint & Anatomical Labels at Base */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between text-[11px] font-mono text-mv-ink-muted pointer-events-none">
        <span className="bg-white/80 px-2 py-0.5 rounded-md border border-mv-outline/50 backdrop-blur-xs">
          Drag to inspect vessel depth
        </span>
        <span className="bg-white/80 px-2 py-0.5 rounded-md border border-mv-outline/50 backdrop-blur-xs hidden sm:inline">
          Bicuspid Leaflets · Biconcave RBCs
        </span>
      </div>
    </div>
  );
};
