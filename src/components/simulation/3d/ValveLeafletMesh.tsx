/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ValveLeafletMeshProps {
  valveState: 'open' | 'closed' | 'incompetent';
  radius?: number;
  height?: number;
  isPaused?: boolean;
}

/**
 * Creates an anatomically authentic bicuspid venous valve leaflet (semilunar cusp).
 *
 * Parameters:
 * - isPosterior: true for posterior leaflet (attaches to back wall z < 0),
 *                false for anterior leaflet (attaches to anterior wall z > 0).
 * - valveState: 'closed' (tight midline seal at z=0),
 *               'open' (flaps swing outward to open central orifice),
 *               'incompetent' (flaps fail to meet, leaving a central reflux gap).
 */
function createAnatomicalLeaflet(
  radius: number,
  leafletHeight: number,
  isPosterior: boolean,
  valveState: 'open' | 'closed' | 'incompetent'
): THREE.BufferGeometry {
  const uSegments = 32;
  const vSegments = 24;
  const positions: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];

  const sign = isPosterior ? -1 : 1;

  // Opening displacement along Z
  // Closed: free edge lands exactly at z = 0 (coaptation line)
  // Open: free edge moves outward toward sinus wall (sign * 0.58 * radius)
  // Incompetent: free edge leaves a persistent gap (sign * 0.20 * radius)
  const edgeZOffset =
    valveState === 'open'
      ? sign * radius * 0.58
      : valveState === 'incompetent'
      ? sign * radius * 0.20
      : 0.0;

  for (let j = 0; j <= vSegments; j++) {
    const v = j / vSegments; // 0 = basal attachment to wall, 1 = free coaptation edge

    for (let i = 0; i <= uSegments; i++) {
      const u = (i / uSegments) * 2 - 1; // -1 (left commissure) to +1 (right commissure)
      
      // X coordinates span from left commissure (-radius) to right commissure (+radius)
      // along a smooth cosine profile
      const theta = u * (Math.PI * 0.5);
      const xBase = Math.sin(theta) * radius * 0.94;

      // Basal attachment contour on the vein wall (v = 0):
      // Dips down at center (u = 0), rises to commissures at u = ±1
      const yBase = -leafletHeight * (1.0 - Math.pow(u, 2) * 0.72);
      const zBase = sign * Math.cos(theta) * radius * 0.88;

      // Free edge contour (v = 1):
      // Stretches across midline between commissures at y = 0.25
      const yEdge = leafletHeight * 0.25;
      const xEdge = xBase * 0.95;
      // In center (u=0), z reaches edgeZOffset. At commissures (u=±1), anchors to wall at z=0
      const zEdge = edgeZOffset * (1.0 - Math.pow(u, 2));

      // Interpolate from base (v=0) to free edge (v=1)
      const x = THREE.MathUtils.lerp(xBase, xEdge, v);
      const y = THREE.MathUtils.lerp(yBase, yEdge, v);

      // Parabolic pocket curvature (sinus of Valsalva belly bulge)
      const bellyFactor = Math.sin(v * Math.PI) * (1.0 - Math.abs(u) * 0.4) * 0.22;
      const z = THREE.MathUtils.lerp(zBase, zEdge, v) + (isPosterior ? -bellyFactor : bellyFactor);

      positions.push(x, y, z);
      uvs.push(i / uSegments, v);
    }
  }

  // Consistent single-winding indices so vertex normals point outward cleanly
  for (let j = 0; j < vSegments; j++) {
    for (let i = 0; i < uSegments; i++) {
      const a = j * (uSegments + 1) + i;
      const b = (j + 1) * (uSegments + 1) + i;
      const c = (j + 1) * (uSegments + 1) + (i + 1);
      const d = j * (uSegments + 1) + (i + 1);

      if (isPosterior) {
        indices.push(a, d, b);
        indices.push(b, d, c);
      } else {
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export const ValveLeaflets: React.FC<ValveLeafletMeshProps> = ({
  valveState,
  radius = 0.86,
  height = 1.0,
  isPaused = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Smooth geometries for posterior and anterior leaflets
  const posteriorGeo = useMemo(() => {
    return createAnatomicalLeaflet(radius * 0.95, height, true, valveState);
  }, [radius, height, valveState]);

  const anteriorGeo = useMemo(() => {
    return createAnatomicalLeaflet(radius * 0.95, height, false, valveState);
  }, [radius, height, valveState]);

  // Leaflet material: smooth, organic endothelial tissue
  const leafletMaterial = useMemo(() => {
    const isLeaky = valveState === 'incompetent';
    return new THREE.MeshStandardMaterial({
      color: isLeaky ? '#E2BAAE' : '#D6E8E0',
      roughness: 0.38,
      metalness: 0.04,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [valveState]);

  // Coaptation line rim material
  const rimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: valveState === 'incompetent' ? '#CE5B40' : '#8DAA9D',
      roughness: 0.35,
      metalness: 0.1,
    });
  }, [valveState]);

  // Subtle physiological swaying per frame
  useFrame(({ clock }) => {
    if (isPaused || !groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 2.4) * 0.012;
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]}>
      {/* 1. Posterior Leaflet (Attached to back wall z < 0) */}
      <mesh geometry={posteriorGeo} material={leafletMaterial} />

      {/* 2. Anterior Leaflet (Attached to front wall z > 0) */}
      <mesh geometry={anteriorGeo} material={leafletMaterial} />

      {/* 3. Competent Closed State: Distinct Midline Coaptation Seal Line */}
      {valveState === 'closed' && (
        <group position={[0, height * 0.25, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, radius * 1.65, 12]} />
            <primitive object={rimMaterial} attach="material" />
          </mesh>
        </group>
      )}

      {/* 4. Incompetent State: Persistent Central Reflux Gap Indicator */}
      {valveState === 'incompetent' && (
        <group position={[0, height * 0.25, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.016, 12, 32]} />
            <meshBasicMaterial color="#CE5B40" transparent opacity={0.75} />
          </mesh>
        </group>
      )}

      {/* Commissure Anchors on Left and Right Walls */}
      <mesh position={[-radius * 0.94, height * 0.25, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#8DAA9D" roughness={0.3} />
      </mesh>
      <mesh position={[radius * 0.94, height * 0.25, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#8DAA9D" roughness={0.3} />
      </mesh>
    </group>
  );
};
