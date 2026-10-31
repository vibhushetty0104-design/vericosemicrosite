/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { VeinLumenMesh } from './VeinLumenMesh';
import { ValveLeaflets } from './ValveLeafletMesh';
import { BloodCellsStream } from './BloodCellsStream';
import { LegAnatomy3D } from './LegAnatomy3D';

export type SimulationMode = 'valve' | 'pump' | 'varicose' | 'explore';

interface Vascular3DViewerProps {
  mode: SimulationMode;
  stageId?: number; // 1 to 5 for pump mode
  valveState?: 'open' | 'closed' | 'incompetent';
  flowDirection?: 'upward' | 'filling' | 'halted' | 'retrograde';
  isVaricose?: boolean;
  isPaused?: boolean;
  selectedStructureId?: string | null;
  onSelectStructure?: (id: string | null) => void;
  visibleLayers?: {
    muscles: boolean;
    deepVeins: boolean;
    superficialVeins: boolean;
    perforators: boolean;
    valves: boolean;
  };
  cameraResetKey?: number;
}

const SceneContent: React.FC<{
  mode: SimulationMode;
  stageId: number;
  valveState: 'open' | 'closed' | 'incompetent';
  flowDirection: 'upward' | 'filling' | 'halted' | 'retrograde';
  isVaricose: boolean;
  isPaused: boolean;
  selectedStructureId: string | null;
  onSelectStructure?: (id: string | null) => void;
  visibleLayers?: {
    muscles: boolean;
    deepVeins: boolean;
    superficialVeins: boolean;
    perforators: boolean;
    valves: boolean;
  };
  cameraResetKey?: number;
}> = ({
  mode,
  stageId,
  valveState,
  flowDirection,
  isVaricose,
  isPaused,
  selectedStructureId,
  onSelectStructure,
  visibleLayers,
  cameraResetKey,
}) => {
  const controlsRef = useRef<any>(null);

  // Reliable camera positioning per mode
  useEffect(() => {
    if (controlsRef.current) {
      if (mode === 'explore' || mode === 'varicose') {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.object.position.set(0, 0.1, 7.2);
      } else if (mode === 'pump') {
        controlsRef.current.target.set(0, 0.1, 0);
        controlsRef.current.object.position.set(0, 0.25, 5.4);
      } else {
        // Mode: valve
        controlsRef.current.target.set(0, 0.1, 0);
        controlsRef.current.object.position.set(0, 0.2, 4.8);
      }
      controlsRef.current.update();
    }
  }, [cameraResetKey, mode]);

  // Contraction squeeze mechanics during Calf Pump cycle
  const isContracting = stageId === 1 || stageId === 2;
  const muscleSqueezeScale = isContracting ? 1.14 : 1.0;
  const veinCompressionScale = isContracting ? 0.84 : 1.0;

  return (
    <>
      {/* Studio Lighting Rig for optimal anatomical clarity */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 6]} intensity={1.4} castShadow />
      <directionalLight position={[-4, 3, 4]} intensity={0.7} color="#E4ECE6" />
      <pointLight position={[0, -2, 4]} intensity={0.35} color="#F7F5EF" />

      {/* OrbitControls with restrained damping and safety limits */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        minDistance={2.6}
        maxDistance={11.0}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.15}
      />

      {/* MODE 1 & 2: Lower-Limb Venous Anatomy & Varicose Comparison */}
      {(mode === 'explore' || mode === 'varicose') && (
        <group position={[0, 0, 0]}>
          <LegAnatomy3D
            mode={mode}
            isVaricose={isVaricose}
            selectedStructureId={selectedStructureId}
            onSelectStructure={onSelectStructure}
            visibleLayers={visibleLayers}
          />
        </group>
      )}

      {/* MODE 3 & 4: Cutaway Venous Valve & Calf-Muscle Pump */}
      {(mode === 'valve' || mode === 'pump') && (
        <group position={[0, 0, 0]}>
          {/* Central Deep Vein Lumen with Longitudinal Cutaway & Blood Cells */}
          <group scale={[veinCompressionScale, 1.0, veinCompressionScale]}>
            <VeinLumenMesh radius={0.86} height={4.2} isCutaway={true} />
            <ValveLeaflets valveState={valveState} radius={0.85} isPaused={isPaused} />
            <BloodCellsStream
              valveState={valveState}
              flowDirection={flowDirection}
              radius={0.78}
              height={4.0}
              count={32}
              isPaused={isPaused}
            />
          </group>

          {/* Calf Muscle Pump Mode: Anatomically Tapered Gastrocnemius & Soleus Muscles */}
          {mode === 'pump' && (
            <group position={[0, 0, 0]}>
              {/* Deep Soleus Muscle Bed (Behind the deep vein) */}
              <mesh position={[0, -0.05, -0.82]} scale={[1.15, 1.0, muscleSqueezeScale * 0.95]}>
                <cylinderGeometry args={[1.2, 0.95, 3.8, 24]} />
                <meshStandardMaterial
                  color={isContracting ? '#BA5545' : '#8B3838'}
                  roughness={0.6}
                  transparent
                  opacity={0.6}
                />
              </mesh>

              {/* Medial Gastrocnemius Belly (Flanking left) */}
              <mesh
                position={[-1.48, 0.1, -0.25]}
                scale={[muscleSqueezeScale, 1.0, muscleSqueezeScale * 0.85]}
                rotation={[0, 0.12, -0.06]}
              >
                <cylinderGeometry args={[0.55, 0.42, 3.6, 24]} />
                <meshStandardMaterial
                  color={isContracting ? '#CE5B40' : '#9E4444'}
                  roughness={0.52}
                  transparent
                  opacity={0.72}
                />
              </mesh>

              {/* Lateral Gastrocnemius Belly (Flanking right) */}
              <mesh
                position={[1.48, 0.1, -0.25]}
                scale={[muscleSqueezeScale, 1.0, muscleSqueezeScale * 0.85]}
                rotation={[0, -0.12, 0.06]}
              >
                <cylinderGeometry args={[0.52, 0.40, 3.6, 24]} />
                <meshStandardMaterial
                  color={isContracting ? '#CE5B40' : '#9E4444'}
                  roughness={0.52}
                  transparent
                  opacity={0.72}
                />
              </mesh>

              {/* Inward Muscular Compression Arrows during Contraction */}
              {isContracting && (
                <group>
                  <mesh position={[-1.02, 0.15, 0]} rotation={[0, 0, -Math.PI / 2]}>
                    <coneGeometry args={[0.13, 0.3, 16]} />
                    <meshBasicMaterial color="#CE5B40" />
                  </mesh>
                  <mesh position={[1.02, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <coneGeometry args={[0.13, 0.3, 16]} />
                    <meshBasicMaterial color="#CE5B40" />
                  </mesh>
                </group>
              )}
            </group>
          )}
        </group>
      )}
    </>
  );
};

export const Vascular3DViewer: React.FC<Vascular3DViewerProps> = ({
  mode,
  stageId = 1,
  valveState = 'open',
  flowDirection = 'upward',
  isVaricose = false,
  isPaused = false,
  selectedStructureId = null,
  onSelectStructure,
  visibleLayers,
  cameraResetKey = 0,
}) => {
  return (
    <div className="relative w-full h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] select-none rounded-2xl overflow-hidden bg-[#FAF7F2]">
      <Canvas
        camera={{
          position:
            mode === 'explore' || mode === 'varicose'
              ? [0, 0.1, 7.2]
              : mode === 'pump'
              ? [0, 0.25, 5.4]
              : [0, 0.2, 4.8],
          fov: 42,
          near: 0.1,
          far: 50,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        tabIndex={0}
        aria-label="Interactive 3D vascular simulation canvas"
      >
        <SceneContent
          mode={mode}
          stageId={stageId}
          valveState={valveState}
          flowDirection={flowDirection}
          isVaricose={isVaricose}
          isPaused={isPaused}
          selectedStructureId={selectedStructureId}
          onSelectStructure={onSelectStructure}
          visibleLayers={visibleLayers}
          cameraResetKey={cameraResetKey}
        />
      </Canvas>
    </div>
  );
};
