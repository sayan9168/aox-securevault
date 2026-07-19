'use client';
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text, MeshPhysicalMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function VaultDoor({ unlocked }: { unlocked: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const targetRotation = unlocked ? -Math.PI / 2 : 0;

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation, 0.05);
    }
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[3, 3, 0.3]} radius={0.1} position={[0, 0, 0]}>
        <MeshPhysicalMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} clearcoat={1} />
      </RoundedBox>
      <Text position={[0, 0, 0.2]} fontSize={0.3} color="#6d5acd" font="/fonts/mono.woff">
        SAYANOX
      </Text>
    </group>
  );
}

export default function VaultScene({ unlocked }: { unlocked: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || navigator.hardwareConcurrency <= 4);
  }, []);

  if (isMobile) {
    return (
      <div className="h-64 flex items-center justify-center bg-aox-surface rounded-xl border border-white/5">
        <span className="text-aox-accent font-mono text-lg tracking-widest">
          {unlocked ? '[ VAULT OPEN ]' : '[ LOCKED ]'}
        </span>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-white/5">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#6d5acd" />
        <VaultDoor unlocked={unlocked} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
