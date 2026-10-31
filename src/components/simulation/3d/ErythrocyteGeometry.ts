/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

/**
 * Creates an authentic human erythrocyte (red blood cell) biconcave disc geometry.
 *
 * Mathematical Evans-Fung profile:
 * - Thick, rounded outer rim (~2.0 to 2.5 µm scale).
 * - Thin, concave central dimple (~0.8 to 1.0 µm scale).
 *
 * Proportions:
 * - Radius: ~0.11 units (scaled to fit comfortably within the 0.85 vessel lumen).
 */
export function createErythrocyteGeometry(radius = 0.11, segments = 18): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 12;

  // Build top profile curve
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 (center) to 1 (outer edge)
    const x = t * radius;
    const xNorm = x / radius;
    
    // Evans-Fung biconcave formulation
    const factor = Math.sqrt(Math.max(0, 1 - xNorm * xNorm));
    // Dip in the center (xNorm=0), rise at the doughnut rim (xNorm ~ 0.7), drop at outer edge
    const y = 0.052 * factor * (0.28 + 2.2 * xNorm * xNorm - 1.25 * Math.pow(xNorm, 4));
    points.push(new THREE.Vector2(x, Math.max(0.008, y)));
  }

  // Mirror bottom profile to create biconcave disc
  const fullProfile: THREE.Vector2[] = [...points];
  for (let i = points.length - 1; i >= 0; i--) {
    fullProfile.push(new THREE.Vector2(points[i].x, -points[i].y));
  }

  const geometry = new THREE.LatheGeometry(fullProfile, segments);
  geometry.computeVertexNormals();
  return geometry;
}
