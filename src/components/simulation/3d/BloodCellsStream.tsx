/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createErythrocyteGeometry } from './ErythrocyteGeometry';

interface BloodCellsStreamProps {
  valveState: 'open' | 'closed' | 'incompetent';
  flowDirection: 'upward' | 'filling' | 'halted' | 'retrograde';
  count?: number;
  radius?: number;
  height?: number;
  isPaused?: boolean;
}

interface CellParticle {
  x: number;
  y: number;
  z: number;
  speed: number;
  pitch: number;
  yaw: number;
  roll: number;
  rotSpeedX: number;
  rotSpeedY: number;
}

export const BloodCellsStream: React.FC<BloodCellsStreamProps> = ({
  valveState,
  flowDirection,
  count = 32,
  radius = 0.85,
  height = 4.0,
  isPaused = false,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // True biconcave erythrocyte geometry
  const cellGeo = useMemo(() => createErythrocyteGeometry(0.11, 16), []);

  const isReflux = flowDirection === 'retrograde' || valveState === 'incompetent';
  const isClosed = valveState === 'closed' || flowDirection === 'halted';

  // Saturated, recognizable red material (venous red vs terracotta reflux)
  const cellMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isReflux ? '#E65100' : '#D32F2F',
      roughness: 0.28,
      metalness: 0.08,
      flatShading: false,
    });
  }, [isReflux]);

  // Initial distribution of particles along the central lumen
  const particles = useMemo<CellParticle[]>(() => {
    const list: CellParticle[] = [];
    const minY = -height * 0.46;
    const maxY = height * 0.46;

    for (let i = 0; i < count; i++) {
      // Confine strictly to central streamline (r < 0.35 * lumenRadius)
      const r = Math.sqrt(Math.random()) * radius * 0.38;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      // Stagger vertically along lumen
      const y = THREE.MathUtils.lerp(minY, maxY, i / count);

      list.push({
        x,
        y,
        z,
        speed: 0.75 + Math.random() * 0.35,
        pitch: Math.random() * Math.PI * 2,
        yaw: Math.random() * Math.PI * 2,
        roll: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 1.8,
        rotSpeedY: (Math.random() - 0.5) * 1.8,
      });
    }
    return list;
  }, [count, radius, height]);

  // Update instance colors smoothly when state changes
  useEffect(() => {
    if (!meshRef.current) return;
    const baseColor = new THREE.Color(isReflux ? '#E65100' : '#D32F2F');
    for (let i = 0; i < count; i++) {
      // Subtle organic variation
      const col = baseColor.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.06);
      meshRef.current.setColorAt(i, col);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [isReflux, count]);

  // Simulation loop per frame
  useFrame((_, delta) => {
    if (isPaused || !meshRef.current) return;

    const dt = Math.min(0.05, delta);
    const minY = -height * 0.46;
    const maxY = height * 0.46;
    const valveY = 0.2; // Height of valve leaflets

    for (let i = 0; i < count; i++) {
      const p = particles[i];

      if (isClosed) {
        // Closed valve: blood cells decelerate and settle
        // Cells above valve settle in the sinus cups (y ~ 0.3 to 1.8)
        // Cells below valve hold below y = 0.05
        if (p.y > valveY) {
          // Slow settling motion
          if (p.y > 0.4) {
            p.y -= p.speed * dt * 0.25;
          }
        } else {
          // Below valve: stopped
          if (p.y > -0.05) {
            p.y = -0.05;
          }
        }
      } else if (isReflux) {
        // Incompetent valve (reflux): blood flows backward DOWN the vein (-Y)
        p.y -= p.speed * dt * 1.1;
        // As cells pass through the valve gap, squeeze slightly toward center
        if (Math.abs(p.y - valveY) < 0.4) {
          p.x *= 0.96;
          p.z *= 0.96;
        }
        // Wrap around from bottom to top
        if (p.y < minY) {
          p.y = maxY;
          const r = Math.sqrt(Math.random()) * radius * 0.32;
          const th = Math.random() * Math.PI * 2;
          p.x = Math.cos(th) * r;
          p.z = Math.sin(th) * r;
        }
      } else {
        // Forward flow: blood flows smoothly UPWARD (+Y) toward the heart
        p.y += p.speed * dt * 1.25;
        // Streamline through open valve orifice
        if (Math.abs(p.y - valveY) < 0.35) {
          p.x *= 0.95;
          p.z *= 0.95;
        }
        // Wrap around from top to bottom
        if (p.y > maxY) {
          p.y = minY;
          const r = Math.sqrt(Math.random()) * radius * 0.32;
          const th = Math.random() * Math.PI * 2;
          p.x = Math.cos(th) * r;
          p.z = Math.sin(th) * r;
        }
      }

      // Gentle tumbling rotation
      p.pitch += p.rotSpeedX * dt;
      p.yaw += p.rotSpeedY * dt;

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.pitch, p.yaw, p.roll);
      dummy.scale.setScalar(1.0);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Instanced Red Blood Cells */}
      <instancedMesh
        ref={meshRef}
        args={[cellGeo, cellMaterial, count]}
        frustumCulled={false}
      />

      {/* 3D Flow Direction Indicator Arrow beside vessel */}
      <group position={[1.35, 0.1, 0]}>
        {!isClosed && !isReflux && (
          // Forward Flow Arrow (Points UP toward heart)
          <group>
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.9, 12]} />
              <meshBasicMaterial color="#166534" />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <coneGeometry args={[0.13, 0.35, 16]} />
              <meshBasicMaterial color="#166534" />
            </mesh>
          </group>
        )}

        {isReflux && (
          // Reflux Flow Arrow (Points DOWN with terracotta warning)
          <group>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
              <meshBasicMaterial color="#CE5B40" />
            </mesh>
            <mesh position={[0, -0.25, 0]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.14, 0.35, 16]} />
              <meshBasicMaterial color="#CE5B40" />
            </mesh>
          </group>
        )}

        {isClosed && (
          // Valve Sealed Indicator (Horizontal bar)
          <group position={[0, 0.1, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
              <meshBasicMaterial color="#8DAA9D" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
