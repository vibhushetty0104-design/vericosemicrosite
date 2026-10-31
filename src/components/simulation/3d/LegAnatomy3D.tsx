/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface AnatomicalStructure {
  id: string;
  name: string;
  category: 'muscle' | 'deep-vein' | 'superficial-vein' | 'perforator' | 'valve';
  description: string;
  clinicalNote: string;
}

export const ANATOMICAL_STRUCTURES: Record<string, AnatomicalStructure> = {
  gastrocnemius: {
    id: 'gastrocnemius',
    name: 'Gastrocnemius Muscle',
    category: 'muscle',
    description: 'Two-headed superficial calf muscle spanning from the femur to the Achilles tendon. Acts as the primary dynamic pump during walking.',
    clinicalNote: 'Contraction increases pressure inside the deep muscular compartment, pushing deep venous blood upward against gravity.',
  },
  soleus: {
    id: 'soleus',
    name: 'Soleus Muscle & Venous Sinuses',
    category: 'muscle',
    description: 'Broad, flat muscle situated deep to the gastrocnemius. Contains wide venous sinuses that serve as the major blood reservoir of the lower leg.',
    clinicalNote: 'The soleal sinuses store venous blood; regular calf movement is necessary to prevent blood pooling in these reservoirs.',
  },
  deepVeins: {
    id: 'deepVeins',
    name: 'Deep Venous System (Popliteal & Tibial Veins)',
    category: 'deep-vein',
    description: 'Main deep vessels running inside the muscular compartment beneath the deep fascia, carrying the majority of venous return back toward the heart.',
    clinicalNote: 'The deep venous system handles roughly 85% to 90% of venous return from the leg.',
  },
  gsv: {
    id: 'gsv',
    name: 'Great Saphenous Vein (GSV)',
    category: 'superficial-vein',
    description: 'Major superficial vein traveling beneath the skin along the inner (medial) leg from the ankle up to the groin.',
    clinicalNote: 'Often involved when venous valves fail, leading to visible dilated or tortuous varicose veins along the calf and thigh.',
  },
  ssv: {
    id: 'ssv',
    name: 'Small Saphenous Vein (SSV)',
    category: 'superficial-vein',
    description: 'Superficial vein draining the outer foot and running up the back of the calf to connect with the deep system behind the knee.',
    clinicalNote: 'Valvular reflux in this vein can cause varicose veins on the back or outer side of the calf.',
  },
  perforators: {
    id: 'perforators',
    name: 'Perforator Veins',
    category: 'perforator',
    description: 'Connecting veins that cross through the deep fascia, linking superficial veins under the skin directly into the deep veins.',
    clinicalNote: 'One-way valves normally direct blood inward from superficial to deep veins. If these valves fail, blood can surge outward toward the skin.',
  },
};

interface LegAnatomy3DProps {
  mode: 'explore' | 'varicose' | 'valve' | 'pump';
  isVaricose?: boolean;
  selectedStructureId?: string | null;
  onSelectStructure?: (id: string | null) => void;
  visibleLayers?: {
    muscles: boolean;
    deepVeins: boolean;
    superficialVeins: boolean;
    perforators: boolean;
    valves: boolean;
  };
}

/**
 * LegAnatomy3D
 *
 * Anatomically informed 3D model of the human lower limb venous system.
 *
 * Anatomy References:
 * - PMC5381851: Anatomy of the lower limb venous system
 * - PMC3036282: Venous hemodynamics and the calf muscle pump
 * - NBK534256: Venous valves and chronic venous insufficiency
 */
export const LegAnatomy3D: React.FC<LegAnatomy3DProps> = ({
  mode,
  isVaricose = false,
  selectedStructureId = null,
  onSelectStructure,
  visibleLayers = {
    muscles: true,
    deepVeins: true,
    superficialVeins: true,
    perforators: true,
    valves: true,
  },
}) => {
  // Construct anatomically calibrated vessel trajectories
  const { gsvHealthyCurve, gsvVaricoseCurve, deepTibialCurve, ssvCurve, perforatorBranches } = useMemo(() => {
    // Great Saphenous Vein (Medial superficial path)
    const gsvHealthyPoints = [
      new THREE.Vector3(-0.45, -2.8, 0.22),  // Medial malleolus ankle
      new THREE.Vector3(-0.62, -1.6, 0.16),  // Lower medial calf
      new THREE.Vector3(-0.72, -0.2, 0.08),  // Mid calf
      new THREE.Vector3(-0.64, 1.2, -0.05),  // Upper calf / medial knee
      new THREE.Vector3(-0.52, 2.7, -0.12),  // Distal thigh toward saphenofemoral junction
    ];
    const gsvHealthyCurve = new THREE.CatmullRomCurve3(gsvHealthyPoints);

    // Varicose GSV: Dilated, tortuous serpentine course with prominent bulging loops
    const gsvVaricosePoints = [
      new THREE.Vector3(-0.45, -2.8, 0.22),
      new THREE.Vector3(-0.82, -2.1, 0.42),  // Bulging loop
      new THREE.Vector3(-0.48, -1.5, 0.35),
      new THREE.Vector3(-0.95, -0.8, 0.50),  // Prominent serpentine knuckle
      new THREE.Vector3(-0.52, -0.1, 0.32),
      new THREE.Vector3(-0.84, 0.6, 0.38),   // Upper calf convolution
      new THREE.Vector3(-0.64, 1.2, 0.12),
      new THREE.Vector3(-0.52, 2.7, -0.12),
    ];
    const gsvVaricoseCurve = new THREE.CatmullRomCurve3(gsvVaricosePoints);

    // Deep Tibial / Popliteal Veins (Protected deep inside posterior compartment)
    const deepPoints = [
      new THREE.Vector3(0.04, -2.7, -0.15),
      new THREE.Vector3(0.06, -1.4, -0.25),
      new THREE.Vector3(0.02, 0.0, -0.30),
      new THREE.Vector3(-0.04, 1.3, -0.26),
      new THREE.Vector3(-0.02, 2.6, -0.20),
    ];
    const deepTibialCurve = new THREE.CatmullRomCurve3(deepPoints);

    // Small Saphenous Vein (Posterior midline superficial path)
    const ssvPoints = [
      new THREE.Vector3(0.32, -2.7, 0.12),
      new THREE.Vector3(0.16, -1.5, -0.42),
      new THREE.Vector3(0.04, 0.1, -0.45),
      new THREE.Vector3(0.0, 1.2, -0.32),
    ];
    const ssvCurve = new THREE.CatmullRomCurve3(ssvPoints);

    // Perforator veins bridging superficial GSV to deep tibial veins
    const perforatorBranches = [
      {
        start: new THREE.Vector3(-0.62, -1.6, 0.16),
        end: new THREE.Vector3(0.06, -1.4, -0.25),
        name: 'Lower Cockett Perforator',
      },
      {
        start: new THREE.Vector3(-0.72, -0.2, 0.08),
        end: new THREE.Vector3(0.02, 0.0, -0.30),
        name: 'Mid-calf Boyd Perforator',
      },
    ];

    return { gsvHealthyCurve, gsvVaricoseCurve, deepTibialCurve, ssvCurve, perforatorBranches };
  }, []);

  // Anatomical Muscle Geometries:
  // - Medial & lateral heads of Gastrocnemius (tapered teardrop muscle bellies)
  // - Soleus (broad, flatter muscle bed situated deep to gastrocnemius)
  const { gastrocMedialGeo, gastrocLateralGeo, soleusGeo, legEnvelopeGeo } = useMemo(() => {
    // Gastrocnemius Medial Belly: Tapered teardrop shape
    const gm = new THREE.SphereGeometry(0.68, 24, 24);
    gm.scale(0.85, 2.2, 0.88);

    // Gastrocnemius Lateral Belly
    const gl = new THREE.SphereGeometry(0.62, 24, 24);
    gl.scale(0.80, 2.0, 0.82);

    // Soleus Muscle Bed (Broad, anatomical contour)
    const sol = new THREE.CylinderGeometry(0.78, 0.55, 3.6, 24);
    sol.scale(1.05, 1.0, 0.72);

    // Translucent Leg Silhouette (Calf contour: wider at upper third, tapered at ankle)
    const env = new THREE.CylinderGeometry(1.15, 0.68, 6.8, 32);
    env.scale(1.05, 1.0, 1.12);

    return { gastrocMedialGeo: gm, gastrocLateralGeo: gl, soleusGeo: sol, legEnvelopeGeo: env };
  }, []);

  // GSV Tube Geometry: Smooth healthy vs dilated varicose
  const gsvGeo = useMemo(() => {
    const curve = isVaricose ? gsvVaricoseCurve : gsvHealthyCurve;
    // Varicose is ~2.2x dilated and tortuous
    const radius = isVaricose ? 0.12 : 0.055;
    return new THREE.TubeGeometry(curve, 64, radius, 16, false);
  }, [isVaricose, gsvHealthyCurve, gsvVaricoseCurve]);

  const deepVeinGeo = useMemo(() => {
    return new THREE.TubeGeometry(deepTibialCurve, 48, 0.075, 16, false);
  }, [deepTibialCurve]);

  const ssvGeo = useMemo(() => {
    return new THREE.TubeGeometry(ssvCurve, 48, 0.048, 16, false);
  }, [ssvCurve]);

  // Adjust muscle opacity in varicose mode so the superficial varicose veins remain prominent
  const muscleOpacity = mode === 'varicose' ? 0.35 : 0.75;

  return (
    <group position={[0, -0.1, 0]}>
      {/* 1. Translucent Anatomical Leg Silhouette */}
      <mesh geometry={legEnvelopeGeo} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#EFECE5"
          roughness={0.8}
          metalness={0.02}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. MUSCLES: Gastrocnemius & Soleus */}
      {visibleLayers.muscles && (
        <group>
          {/* Gastrocnemius Medial Belly */}
          <mesh
            geometry={gastrocMedialGeo}
            position={[-0.28, 0.35, -0.28]}
            rotation={[0.08, 0.12, -0.06]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectStructure?.('gastrocnemius');
            }}
          >
            <meshStandardMaterial
              color={selectedStructureId === 'gastrocnemius' ? '#CE5B40' : '#8B3838'}
              roughness={0.52}
              metalness={0.06}
              transparent
              opacity={muscleOpacity}
            />
          </mesh>

          {/* Gastrocnemius Lateral Belly */}
          <mesh
            geometry={gastrocLateralGeo}
            position={[0.32, 0.45, -0.25]}
            rotation={[-0.05, -0.1, 0.06]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectStructure?.('gastrocnemius');
            }}
          >
            <meshStandardMaterial
              color={selectedStructureId === 'gastrocnemius' ? '#CE5B40' : '#8B3838'}
              roughness={0.52}
              metalness={0.06}
              transparent
              opacity={muscleOpacity}
            />
          </mesh>

          {/* Soleus Muscle Bed (Deep) */}
          <mesh
            geometry={soleusGeo}
            position={[0.02, -0.4, -0.28]}
            rotation={[-0.04, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectStructure?.('soleus');
            }}
          >
            <meshStandardMaterial
              color={selectedStructureId === 'soleus' ? '#CE5B40' : '#732A2A'}
              roughness={0.55}
              metalness={0.05}
              transparent
              opacity={muscleOpacity * 0.9}
            />
          </mesh>
        </group>
      )}

      {/* 3. DEEP VEINS: Popliteal & Posterior Tibial System */}
      {visibleLayers.deepVeins && (
        <group>
          <mesh
            geometry={deepVeinGeo}
            onClick={(e) => {
              e.stopPropagation();
              onSelectStructure?.('deepVeins');
            }}
          >
            <meshStandardMaterial
              color={selectedStructureId === 'deepVeins' ? '#CE5B40' : '#1E4957'}
              roughness={0.35}
              metalness={0.15}
            />
          </mesh>
        </group>
      )}

      {/* 4. SUPERFICIAL VEINS: Great & Small Saphenous Veins */}
      {visibleLayers.superficialVeins && (
        <group>
          {/* Great Saphenous Vein (GSV) */}
          <mesh
            geometry={gsvGeo}
            onClick={(e) => {
              e.stopPropagation();
              onSelectStructure?.('gsv');
            }}
          >
            <meshStandardMaterial
              color={
                isVaricose
                  ? '#CE5B40' // Prominent terracotta highlight for varicose vein
                  : selectedStructureId === 'gsv'
                  ? '#CE5B40'
                  : '#2F677A'
              }
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>

          {/* Small Saphenous Vein (SSV) */}
          <mesh
            geometry={ssvGeo}
            onClick={(e) => {
              e.stopPropagation();
              onSelectStructure?.('ssv');
            }}
          >
            <meshStandardMaterial
              color={selectedStructureId === 'ssv' ? '#CE5B40' : '#2A5D6E'}
              roughness={0.35}
              metalness={0.1}
            />
          </mesh>
        </group>
      )}

      {/* 5. PERFORATOR VEINS: Crossing through deep fascia */}
      {visibleLayers.perforators && (
        <group>
          {perforatorBranches.map((perf, idx) => {
            const dir = perf.end.clone().sub(perf.start);
            const len = dir.length();
            const mid = perf.start.clone().add(perf.end).multiplyScalar(0.5);
            const orientation = new THREE.Matrix4();
            orientation.lookAt(perf.start, perf.end, new THREE.Vector3(0, 1, 0));

            return (
              <group key={idx} position={mid}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.038, 0.038, len, 12]} />
                  <meshStandardMaterial
                    color={selectedStructureId === 'perforators' ? '#CE5B40' : '#3E7B8F'}
                    roughness={0.35}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
