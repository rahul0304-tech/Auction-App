import React, { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";

const STLViewer = ({ modelUrl }) => {
  const geometry = useLoader(STLLoader, modelUrl);
  const meshRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    if (geometry && meshRef.current) {
      geometry.center(); // ✅ Auto-center the model
      geometry.computeBoundingBox();
      const size = new THREE.Vector3();
      geometry.boundingBox.getSize(size);

      const scaleFactor = 10 / Math.max(size.x, size.y, size.z); // ✅ Adjust scale dynamically
      meshRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
      meshRef.current.position.set(0, -size.y * scaleFactor * 0.5, 0); // ✅ Adjust position
    }
  }, [geometry]);

  return (
    <Canvas className="w-full h-80 border rounded-lg" camera={{ position: [5, 5, 10], fov: 50 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      {geometry && (
        <mesh ref={meshRef}>
          <primitive attach="geometry" object={geometry} />
          <meshStandardMaterial color="gray" metalness={0.5} roughness={0.1} />
        </mesh>
      )}
      <OrbitControls autoRotate enableZoom target={[0, 0, 0]} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  );
};

export default STLViewer;