"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface AnatomyCanvasProps {
  selectedMuscleId: string | null;
  onSelectMuscle: (muscleId: string) => void;
  viewAngle: "front" | "back" | "side" | "reset";
}

export default function AnatomyCanvas({
  selectedMuscleId,
  onSelectMuscle,
  viewAngle,
}: AnatomyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const muscleGroupsRef = useRef<{ [key: string]: THREE.Mesh[] }>({});
  
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle camera view presets
  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const targetPos = new THREE.Vector3(0, 0, 5);
    if (viewAngle === "front") {
      targetPos.set(0, 0.2, 5.2);
    } else if (viewAngle === "back") {
      targetPos.set(0, 0.2, -5.2);
    } else if (viewAngle === "side") {
      targetPos.set(4.5, 0.2, 0);
    } else if (viewAngle === "reset") {
      targetPos.set(0, 0.2, 5.2);
    }

    // Smooth transition
    const duration = 800;
    const startPos = camera.position.clone();
    const startTime = performance.now();

    function animateCamera(now: number) {
      if (!camera || !controls) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing curve (ease-out-cubic)
      const ease = 1 - Math.pow(1 - progress, 3);
      
      camera.position.lerpVectors(startPos, targetPos, ease);
      controls.target.set(0, 0.2, 0);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    }

    requestAnimationFrame(animateCamera);
  }, [viewAngle]);

  // Handle highlight updates when selectedMuscleId changes
  useEffect(() => {
    const groups = muscleGroupsRef.current;
    Object.keys(groups).forEach((muscleId) => {
      const meshes = groups[muscleId];
      const isSelected = selectedMuscleId === muscleId;
      meshes.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (isSelected) {
          mat.color.setHex(0x3B82F6); // Vibrant Electric Blue
          mat.emissive.setHex(0x1D4ED8);
          mat.emissiveIntensity = 0.6;
          mat.opacity = 0.85;
        } else {
          // Standard transparent glass look
          mat.color.setHex(0x1E293B); // Slate-800
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
          mat.opacity = 0.4;
        }
      });
    });
  }, [selectedMuscleId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.05);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.3; // Prevent flipping completely under the floor
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x3B82F6, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06B6D4, 0.8);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x3B82F6, 1.5, 10);
    pointLight.position.set(0, 1, 2);
    scene.add(pointLight);

    // Floor Grid/Mirror
    const gridHelper = new THREE.GridHelper(10, 20, 0x3B82F6, 0x1E293B);
    gridHelper.position.y = -2.5;
    (gridHelper.material as THREE.Material).opacity = 0.2;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // Background Particle Field
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ----------------------------------------------------
    // PROCEDURAL CYBERNETIC HUMAN BODY PARTS
    // ----------------------------------------------------
    const groups: { [key: string]: THREE.Mesh[] } = {};
    const meshesToRaycast: THREE.Object3D[] = [];

    // Helper to create glowing glass material for active muscles
    function createMuscleMaterial() {
      return new THREE.MeshStandardMaterial({
        color: 0x1E293B,
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
        emissive: 0x000000,
        emissiveIntensity: 0,
        flatShading: false,
      });
    }

    // Helper to create a dark base material for skeleton/background cores
    function createCoreMaterial() {
      return new THREE.MeshStandardMaterial({
        color: 0x090D15,
        roughness: 0.45,
        metalness: 0.05,
        transparent: true,
        opacity: 0.6,
        flatShading: false,
      });
    }

    // Helper to register parts
    function addPart(
      muscleId: string, 
      geometry: THREE.BufferGeometry, 
      position: [number, number, number], 
      rotation: [number, number, number] = [0, 0, 0], 
      scale: [number, number, number] = [1, 1, 1],
      isBackground: boolean = false
    ) {
      const mat = isBackground ? createCoreMaterial() : createMuscleMaterial();
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.scale.set(...scale);

      mesh.userData = { muscleId, isBackground };
      scene.add(mesh);
      
      if (!isBackground) {
        if (!groups[muscleId]) groups[muscleId] = [];
        groups[muscleId].push(mesh);
        meshesToRaycast.push(mesh);
      }
    }

    // ----------------------------------------------------
    // BACKGROUND CORE / PROPORTIONAL ANATOMY (Non-clickable)
    // ----------------------------------------------------
    // Head representation
    const headGeo = new THREE.SphereGeometry(0.20, 32, 32);
    addPart("background", headGeo, [0, 1.85, 0], [0, 0, 0], [1, 1.25, 1], true);

    // Neck
    const neckGeo = new THREE.CapsuleGeometry(0.08, 0.18, 4, 12);
    addPart("background", neckGeo, [0, 1.58, 0], [0, 0, 0], [1, 1, 1], true);

    // Main Upper Chest/Ribcage Core
    const upperCoreGeo = new THREE.CapsuleGeometry(0.20, 0.65, 8, 16);
    addPart("background", upperCoreGeo, [0, 0.95, 0], [0, 0, 0], [1.1, 1.0, 0.95], true);

    // Pelvis / Hips Core
    const lowerCoreGeo = new THREE.CapsuleGeometry(0.21, 0.25, 8, 16);
    addPart("background", lowerCoreGeo, [0, 0.2, -0.02], [0, 0, 0], [1.05, 1.0, 1.0], true);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.07, 16, 16);
    addPart("background", handGeo, [-0.58, 0.44, 0.08], [0, 0, 0], [1, 1, 1], true);
    addPart("background", handGeo, [0.58, 0.44, 0.08], [0, 0, 0], [1, 1, 1], true);

    // Feet
    const footGeo = new THREE.CapsuleGeometry(0.065, 0.18, 4, 12);
    addPart("background", footGeo, [-0.18, -1.5, 0.08], [0.2, 0, 0], [1, 1, 1.3], true);
    addPart("background", footGeo, [0.18, -1.5, 0.08], [0.2, 0, 0], [1, 1, 1.3], true);

    // ----------------------------------------------------
    // MUSCULAR LAYERS / SELECTABLE GROUPS (Bodybuilder Proportions)
    // ----------------------------------------------------
    // Chest (Pecs - Massive overlapping spheres)
    const upperPecGeo = new THREE.SphereGeometry(0.14, 24, 24);
    addPart("upper_chest", upperPecGeo, [-0.13, 1.32, 0.16], [0, 0, -0.04], [1.4, 0.72, 0.8]);
    addPart("upper_chest", upperPecGeo, [0.13, 1.32, 0.16], [0, 0, 0.04], [1.4, 0.72, 0.8]);

    const lowerPecGeo = new THREE.SphereGeometry(0.155, 24, 24);
    addPart("lower_chest", lowerPecGeo, [-0.14, 1.16, 0.17], [0, 0, -0.04], [1.38, 0.82, 0.8]);
    addPart("lower_chest", lowerPecGeo, [0.14, 1.16, 0.17], [0, 0, 0.04], [1.38, 0.82, 0.8]);

    // Core / Abs (Tightly packed bulging six-pack plates)
    const absPackGeo = new THREE.SphereGeometry(0.07, 16, 16);
    addPart("abs", absPackGeo, [-0.075, 0.94, 0.14], [0, 0, 0], [1.2, 0.85, 0.6]);
    addPart("abs", absPackGeo, [0.075, 0.94, 0.14], [0, 0, 0], [1.2, 0.85, 0.6]);
    addPart("abs", absPackGeo, [-0.075, 0.81, 0.14], [0, 0, 0], [1.2, 0.85, 0.6]);
    addPart("abs", absPackGeo, [0.075, 0.81, 0.14], [0, 0, 0], [1.2, 0.85, 0.6]);
    addPart("abs", absPackGeo, [-0.075, 0.68, 0.14], [0, 0, 0], [1.2, 0.85, 0.6]);
    addPart("abs", absPackGeo, [0.075, 0.68, 0.14], [0, 0, 0], [1.2, 0.85, 0.6]);

    // Obliques (Tapered waist)
    const obliqueGeo = new THREE.CapsuleGeometry(0.06, 0.3, 4, 12);
    addPart("obliques", obliqueGeo, [-0.23, 0.8, 0.09], [0, 0, 0.15], [1.0, 1.0, 1.0]);
    addPart("obliques", obliqueGeo, [0.23, 0.8, 0.09], [0, 0, -0.15], [1.0, 1.0, 1.0]);

    // Shoulders (Boulder Deltoids)
    const deltGeo = new THREE.SphereGeometry(0.14, 24, 24);
    addPart("front_delts", deltGeo, [-0.34, 1.34, 0.08], [0, 0, 0], [1, 1.3, 1]);
    addPart("front_delts", deltGeo, [0.34, 1.34, 0.08], [0, 0, 0], [1, 1.3, 1]);
    addPart("side_delts", deltGeo, [-0.37, 1.34, 0], [0, 0, 0], [1.1, 1.35, 1.1]);
    addPart("side_delts", deltGeo, [0.37, 1.34, 0], [0, 0, 0], [1.1, 1.35, 1.1]);
    addPart("rear_delts", deltGeo, [-0.34, 1.34, -0.08], [0, 0, 0], [1, 1.3, 1]);
    addPart("rear_delts", deltGeo, [0.34, 1.34, -0.08], [0, 0, 0], [1, 1.3, 1]);

    // Upper Arms (Bulging Bicep peaks & Sweeping Triceps)
    const bicepsGeo = new THREE.SphereGeometry(0.09, 24, 24);
    addPart("biceps", bicepsGeo, [-0.46, 1.08, 0.06], [0, 0, 0.12], [0.85, 1.35, 0.85]);
    addPart("biceps", bicepsGeo, [0.46, 1.08, 0.06], [0, 0, -0.12], [0.85, 1.35, 0.85]);
    
    const tricepsGeo = new THREE.SphereGeometry(0.095, 24, 24);
    addPart("triceps", tricepsGeo, [-0.44, 1.05, -0.07], [0, 0, 0.12], [0.9, 1.45, 0.9]);
    addPart("triceps", tricepsGeo, [0.44, 1.05, -0.07], [0, 0, -0.12], [0.9, 1.45, 0.9]);

    // Forearms (Muscular taper)
    const forearmGeo = new THREE.CapsuleGeometry(0.068, 0.32, 8, 16);
    addPart("forearms", forearmGeo, [-0.52, 0.72, 0.06], [0, 0, 0.18], [1.15, 1.15, 1.0]);
    addPart("forearms", forearmGeo, [0.52, 0.72, 0.06], [0, 0, -0.18], [1.15, 1.15, 1.0]);

    // Back Muscles (Traps, Lats, Rhomboids, Spinal Erectors)
    // Upper traps (High neck yoke)
    const trapsGeo = new THREE.SphereGeometry(0.18, 24, 24);
    addPart("traps", trapsGeo, [0, 1.5, -0.12], [-0.1, 0, 0], [1.4, 0.75, 0.6]);

    // Lats (Wide sweeping wings)
    const latsGeo = new THREE.SphereGeometry(0.18, 24, 24);
    addPart("lats", latsGeo, [-0.20, 1.10, -0.10], [0, 0, -0.2], [1.1, 1.9, 0.55]);
    addPart("lats", latsGeo, [0.20, 1.10, -0.10], [0, 0, 0.2], [1.1, 1.9, 0.55]);

    // Rhomboids (Mid-back thickener)
    const rhomboidsGeo = new THREE.SphereGeometry(0.15, 24, 24);
    addPart("rhomboids", rhomboidsGeo, [0, 1.20, -0.11], [0, 0, 0], [1.3, 0.85, 0.5]);

    // Spinal Erectors (Lower back columns)
    const erectorsGeo = new THREE.CapsuleGeometry(0.045, 0.40, 4, 12);
    addPart("spinal_erectors", erectorsGeo, [-0.08, 0.68, -0.11]);
    addPart("spinal_erectors", erectorsGeo, [0.08, 0.68, -0.11]);

    // Hips / Glutes
    const gluteGeo = new THREE.SphereGeometry(0.21, 24, 24);
    addPart("glutes", gluteGeo, [-0.13, 0.14, -0.18], [0, 0, 0], [1, 1, 0.95]);
    addPart("glutes", gluteGeo, [0.13, 0.14, -0.18], [0, 0, 0], [1, 1, 0.95]);

    // Hip Flexors (Groin)
    const flexorGeo = new THREE.SphereGeometry(0.12, 24, 24);
    addPart("hip_flexors", flexorGeo, [-0.14, 0.15, 0.12], [0, 0, -0.1], [1.1, 1.4, 0.9]);
    addPart("hip_flexors", flexorGeo, [0.16, 0.15, 0.12], [0, 0, 0.1], [1.1, 1.4, 0.9]);

    // Legs (Thighs/Quads/Hamstrings with outward sweeps)
    const quadGeo = new THREE.CapsuleGeometry(0.115, 0.55, 8, 16);
    addPart("quads", quadGeo, [-0.17, -0.32, 0.05], [0, 0, -0.06], [1.1, 1.0, 1.0]);
    addPart("quads", quadGeo, [0.17, -0.32, 0.05], [0, 0, 0.06], [1.1, 1.0, 1.0]);
    
    const hamstringGeo = new THREE.CapsuleGeometry(0.11, 0.55, 8, 16);
    addPart("hamstrings", hamstringGeo, [-0.17, -0.35, -0.11], [0, 0, -0.05]);
    addPart("hamstrings", hamstringGeo, [0.17, -0.35, -0.11], [0, 0, 0.05]);

    // Calves (Diamond-shaped sweeps)
    const calfGeo = new THREE.CapsuleGeometry(0.085, 0.52, 8, 16);
    addPart("calves", calfGeo, [-0.17, -1.05, -0.03], [0, 0, -0.02], [1.1, 1.0, 1.0]);
    addPart("calves", calfGeo, [0.17, -1.05, -0.03], [0, 0, 0.02], [1.1, 1.0, 1.0]);

    muscleGroupsRef.current = groups;
    setLoading(false);

    // ----------------------------------------------------
    // MOUSE INTERACTION (RAYCASTING)
    // ----------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshesToRaycast);

      if (intersects.length > 0) {
        const hoveredObj = intersects[0].object as THREE.Mesh;
        const muscleId = hoveredObj.userData.muscleId;
        setHoveredMuscle(muscleId);

        // Highlight hovered mesh
        meshesToRaycast.forEach((obj) => {
          const mesh = obj as THREE.Mesh;
          const mId = mesh.userData.muscleId;
          const mat = mesh.material as THREE.MeshStandardMaterial;

          if (mId === selectedMuscleId) {
            // Keep active color
          } else if (mId === muscleId) {
            // Glow electric blue on hover
            mat.color.setHex(0x60A5FA); // Light blue
            mat.opacity = 0.65;
            mat.emissive.setHex(0x2563EB);
            mat.emissiveIntensity = 0.3;
          } else {
            // Reset to dark glass
            mat.color.setHex(0x1E293B);
            mat.opacity = 0.4;
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        });
      } else {
        setHoveredMuscle(null);
        // Reset non-selected meshes
        meshesToRaycast.forEach((obj) => {
          const mesh = obj as THREE.Mesh;
          const mId = mesh.userData.muscleId;
          if (mId !== selectedMuscleId) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.color.setHex(0x1E293B);
            mat.opacity = 0.4;
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        });
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshesToRaycast);
      if (intersects.length > 0) {
        const clickedObj = intersects[0].object as THREE.Mesh;
        const muscleId = clickedObj.userData.muscleId;
        onSelectMuscle(muscleId);
      }
    };

    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Idle rotate particles
      particles.rotation.y += 0.001;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener("mousemove", handleMouseMove);
        renderer.domElement.removeEventListener("click", handleClick);
        container.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationId);
      scene.clear();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelectMuscle]);

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center rounded-3xl bg-[#090D16]/50 border border-slate-800/40 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* ThreeJS Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Cybernetic Overlay HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none font-mono">
        <div className="text-[10px] text-blue-500 uppercase tracking-widest font-semibold flex items-center gap-1.5 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> SYSTEM ACTIVE
        </div>
        <div className="text-[9px] text-slate-500">MODE: 3D ANATOMICAL RENDERING</div>
        <div className="text-[9px] text-slate-500">ZOOM: SCROLL | ROTATE: DRAG</div>
      </div>

      {hoveredMuscle && (
        <div className="absolute bottom-4 left-4 z-10 font-mono text-xs px-3 py-1.5 bg-[#0e1626]/80 text-blue-400 border border-blue-500/30 rounded-xl pointer-events-none shadow-lg backdrop-blur-sm transition-all duration-200">
          HOVERING: <span className="font-bold text-white capitalize">{hoveredMuscle.replace("_", " ")}</span>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0F19] z-20 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="font-mono text-xs text-slate-400 tracking-wider">GENERATING MESH SYSTEM...</span>
        </div>
      )}
    </div>
  );
}
