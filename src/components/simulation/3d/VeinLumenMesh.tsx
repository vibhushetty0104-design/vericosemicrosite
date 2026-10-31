/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface VeinLumenMeshProps {
  radius?: number;
  height?: number;
  wallThickness?: number;
  isCutaway?: boolean;
}

/**
 * VeinLumenMesh
 *
 * Anatomical longitudinal cutaway of a human venous segment.
 *
 * Geometry & Alignment:
 * - Vessel is aligned vertically along Y axis.
 * - Back wall is centered at -Z (away from camera).
 * - Front opening is centered at +Z (facing camera at 0, 0, +Z).
 * - Cutaway removes the front 170 degrees so the entire internal lumen,
 *   both valve leaflets, and central blood cells are fully visible without obstruction.
 */
export const VeinLumenMesh: React.FC<VeinLumenMeshProps> = ({
  radius = 0.88,
  height = 4.2,
  wallThickness = 0.10,
  isCutaway = true,
}) => {
  const { outerGeo, innerGeo, rimLeftGeo, rimRightGeo } = useMemo(() => {
    const radialSegs = 48;
    const heightSegs = 32;

    // We want the back wall to span an arc of (2*PI - cutawayAngle), centered at angle PI (which is -Z).
    // The cutaway window faces +Z (towards the front camera).
    const cutawayAngle = isCutaway ? Math.PI * 0.94 : 0; // ~170 deg front cutaway
    const arcLength = Math.PI * 2 - cutawayAngle;
    // Center the remaining wall at PI (the back wall, -Z)
    const startAngle = Math.PI - arcLength / 2;

    // Helper: calculate vessel radius along height, including anatomical sinus of Valsalva
    const getRadiusAtY = (y: number, baseR: number) => {
      // Venous sinus bulbous dilation at y = -0.3 to +0.5
      const sinusBulge = Math.exp(-Math.pow((y - 0.12) / 0.85, 2)) * 0.16;
      return baseR + sinusBulge;
    };

    const outerPositions: number[] = [];
    const outerIndices: number[] = [];
    const innerPositions: number[] = [];
    const innerIndices: number[] = [];

    for (let j = 0; j <= heightSegs; j++) {
      const v = j / heightSegs;
      const y = (v - 0.5) * height;
      const rOuter = getRadiusAtY(y, radius);
      const rInner = getRadiusAtY(y, radius - wallThickness);

      for (let i = 0; i <= radialSegs; i++) {
        const u = i / radialSegs;
        const angle = startAngle + u * arcLength;
        const sinA = Math.sin(angle);
        const cosA = Math.cos(angle);

        // x = sinA * r, z = cosA * r
        // At angle PI: sinA = 0, cosA = -1 -> (0, y, -r) [Deep back wall]
        // At angle 0: sinA = 0, cosA = +1 -> (0, y, +r) [Front cutaway opening]
        const xOut = sinA * rOuter;
        const zOut = cosA * rOuter;
        const xIn = sinA * rInner;
        const zIn = cosA * rInner;

        outerPositions.push(xOut, y, zOut);
        innerPositions.push(xIn, y, zIn);
      }
    }

    for (let j = 0; j < heightSegs; j++) {
      for (let i = 0; i < radialSegs; i++) {
        const a = j * (radialSegs + 1) + i;
        const b = (j + 1) * (radialSegs + 1) + i;
        const c = (j + 1) * (radialSegs + 1) + (i + 1);
        const d = j * (radialSegs + 1) + (i + 1);

        // Outer surface (normals face outward)
        outerIndices.push(a, b, d);
        outerIndices.push(b, c, d);

        // Inner surface (normals face inward toward center)
        innerIndices.push(a, d, b);
        innerIndices.push(b, d, c);
      }
    }

    const outer = new THREE.BufferGeometry();
    outer.setAttribute('position', new THREE.Float32BufferAttribute(outerPositions, 3));
    outer.setIndex(outerIndices);
    outer.computeVertexNormals();

    const inner = new THREE.BufferGeometry();
    inner.setAttribute('position', new THREE.Float32BufferAttribute(innerPositions, 3));
    inner.setIndex(innerIndices);
    inner.computeVertexNormals();

    // Longitudinal cutaway edge rims connecting inner & outer walls
    let rimL = new THREE.BufferGeometry();
    let rimR = new THREE.BufferGeometry();

    if (isCutaway) {
      const buildRim = (angle: number) => {
        const pos: number[] = [];
        const idx: number[] = [];
        const sinA = Math.sin(angle);
        const cosA = Math.cos(angle);

        for (let j = 0; j <= heightSegs; j++) {
          const v = j / heightSegs;
          const y = (v - 0.5) * height;
          const rOut = getRadiusAtY(y, radius);
          const rIn = getRadiusAtY(y, radius - wallThickness);

          pos.push(sinA * rIn, y, cosA * rIn);
          pos.push(sinA * rOut, y, cosA * rOut);
        }

        for (let j = 0; j < heightSegs; j++) {
          const a = j * 2;
          const b = a + 1;
          const c = a + 2;
          const d = a + 3;

          idx.push(a, b, c);
          idx.push(b, d, c);
          // Double-sided
          idx.push(a, c, b);
          idx.push(b, c, d);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setIndex(idx);
        geo.computeVertexNormals();
        return geo;
      };

      rimL = buildRim(startAngle);
      rimR = buildRim(startAngle + arcLength);
    }

    return { outerGeo: outer, innerGeo: inner, rimLeftGeo: rimL, rimRightGeo: rimR };
  }, [radius, height, wallThickness, isCutaway]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Outer Vessel Wall (Tunica Adventitia) - Smooth slate-forest tone */}
      <mesh geometry={outerGeo}>
        <meshStandardMaterial
          color="#254B55"
          roughness={0.45}
          metalness={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Inner Vessel Lumen (Tunica Intima) - Glossy, smooth endothelial lining */}
      <mesh geometry={innerGeo}>
        <meshStandardMaterial
          color="#3A6778"
          roughness={0.25}
          metalness={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Longitudinal Cutaway Rims (Tunica Media) - Anatomical cross-section tone */}
      {isCutaway && (
        <>
          <mesh geometry={rimLeftGeo}>
            <meshStandardMaterial color="#946565" roughness={0.45} metalness={0.05} />
          </mesh>
          <mesh geometry={rimRightGeo}>
            <meshStandardMaterial color="#946565" roughness={0.45} metalness={0.05} />
          </mesh>
        </>
      )}

      {/* Structural End Rings */}
      <mesh position={[0, height * 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - wallThickness, radius, 36]} />
        <meshStandardMaterial color="#946565" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -height * 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - wallThickness, radius, 36]} />
        <meshStandardMaterial color="#946565" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
