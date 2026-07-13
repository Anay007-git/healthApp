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

    // Helper to create glowing glass material
    function createMuscleMaterial() {
      return new THREE.MeshStandardMaterial({
        color: 0x1E293B,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.4,
        emissive: 0x000000,
        emissiveIntensity: 0,
        flatShading: true,
      });
    }

    // Helper to register parts
    function addPart(muscleId: string, geometry: THREE.BufferGeometry, position: [number, number, number], rotation: [number, number, number] = [0, 0, 0], scale: [number, number, number] = [1, 1, 1]) {
      const mat = createMuscleMaterial();
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.scale.set(...scale);
      
      // Wireframe overlay helper for cybernetic scan aesthetic
      const wireGeo = new THREE.WireframeGeometry(geometry);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x3B82F6, transparent: true, opacity: 0.15 });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      mesh.add(wireframe);

      mesh.userData = { muscleId };
      scene.add(mesh);
      
      if (!groups[muscleId]) groups[muscleId] = [];
      groups[muscleId].push(mesh);
      meshesToRaycast.push(mesh);
    }

    // Head & Neck
    const headGeo = new THREE.SphereGeometry(0.28, 16, 16);
    addPart("neck", headGeo, [0, 2.1, 0], [0, 0, 0], [0.8, 1, 0.8]); // Head representation

    const neckGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.25, 8);
    addPart("neck", neckGeo, [0, 1.8, 0]);

    // Torso / Chest
    const chestGeo = new THREE.BoxGeometry(0.35, 0.35, 0.2);
    addPart("upper_chest", chestGeo, [-0.2, 1.45, 0.12], [0.05, 0, -0.05]);
    addPart("upper_chest", chestGeo, [0.2, 1.45, 0.12], [0.05, 0, 0.05]);
    addPart("lower_chest", chestGeo, [-0.2, 1.15, 0.12], [-0.05, 0, -0.05]);
    addPart("lower_chest", chestGeo, [0.2, 1.15, 0.12], [-0.05, 0, 0.05]);

    // Core / Abs
    const absRowGeo = new THREE.BoxGeometry(0.18, 0.12, 0.15);
    // 6 pack grids
    addPart("abs", absRowGeo, [-0.11, 0.8, 0.13]);
    addPart("abs", absRowGeo, [0.11, 0.8, 0.13]);
    addPart("abs", absRowGeo, [-0.11, 0.64, 0.13]);
    addPart("abs", absRowGeo, [0.11, 0.64, 0.13]);
    addPart("abs", absRowGeo, [-0.11, 0.48, 0.13]);
    addPart("abs", absRowGeo, [0.11, 0.48, 0.13]);

    // Obliques (side of waist)
    const obliqueGeo = new THREE.BoxGeometry(0.12, 0.4, 0.18);
    addPart("obliques", obliqueGeo, [-0.3, 0.65, 0.08], [0, 0, 0.1]);
    addPart("obliques", obliqueGeo, [0.3, 0.65, 0.08], [0, 0, -0.1]);

    // Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.18, 12, 12);
    addPart("front_delts", shoulderGeo, [-0.48, 1.5, 0.08], [0, 0, 0], [1, 1, 1]);
    addPart("front_delts", shoulderGeo, [0.48, 1.5, 0.08], [0, 0, 0], [1, 1, 1]);
    addPart("side_delts", shoulderGeo, [-0.52, 1.5, 0], [0, 0, 0], [1, 1, 1]);
    addPart("side_delts", shoulderGeo, [0.52, 1.5, 0], [0, 0, 0], [1, 1, 1]);
    addPart("rear_delts", shoulderGeo, [-0.48, 1.5, -0.08], [0, 0, 0], [1, 1, 1]);
    addPart("rear_delts", shoulderGeo, [0.48, 1.5, -0.08], [0, 0, 0], [1, 1, 1]);

    // Upper Arms (Biceps & Triceps)
    const armGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.5, 8);
    // Biceps (Front-ish of upper arm)
    addPart("biceps", armGeo, [-0.55, 1.15, 0.05], [0, 0, 0.1]);
    addPart("biceps", armGeo, [0.55, 1.15, 0.05], [0, 0, -0.1]);
    // Triceps (Back-ish of upper arm)
    addPart("triceps", armGeo, [-0.55, 1.12, -0.07], [0, 0, 0.1]);
    addPart("triceps", armGeo, [0.55, 1.12, -0.07], [0, 0, -0.1]);

    // Forearms
    const forearmGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.45, 8);
    addPart("forearms", forearmGeo, [-0.62, 0.72, 0.02], [0, 0, 0.15]);
    addPart("forearms", forearmGeo, [0.62, 0.72, 0.02], [0, 0, -0.15]);

    // Back Muscles (Traps, Lats, Rhomboids, Spinal Erectors)
    // Upper traps
    const upperTrapsGeo = new THREE.BoxGeometry(0.35, 0.25, 0.15);
    addPart("traps", upperTrapsGeo, [0, 1.62, -0.12], [-0.1, 0, 0]);

    // Lats (wide wings on back)
    const latsGeo = new THREE.BoxGeometry(0.24, 0.45, 0.15);
    addPart("lats", latsGeo, [-0.22, 1.15, -0.12], [0, 0, -0.15]);
    addPart("lats", latsGeo, [0.22, 1.15, -0.12], [0, 0, 0.15]);

    // Rhomboids (center back under traps)
    const rhomboidsGeo = new THREE.BoxGeometry(0.18, 0.25, 0.1);
    addPart("rhomboids", rhomboidsGeo, [0, 1.25, -0.12]);

    // Spinal Erectors (lower back columns)
    const erectorsGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8);
    addPart("spinal_erectors", erectorsGeo, [-0.09, 0.7, -0.12]);
    addPart("spinal_erectors", erectorsGeo, [0.09, 0.7, -0.12]);

    // Hips / Glutes
    const gluteGeo = new THREE.SphereGeometry(0.25, 12, 12);
    addPart("glutes", gluteGeo, [-0.18, 0.15, -0.16], [0, 0, 0], [1, 1, 0.9]);
    addPart("glutes", gluteGeo, [0.18, 0.15, -0.16], [0, 0, 0], [1, 1, 0.9]);

    // Hip Flexors (front groin area)
    const flexorGeo = new THREE.BoxGeometry(0.15, 0.25, 0.15);
    addPart("hip_flexors", flexorGeo, [-0.18, 0.15, 0.12], [0, 0, -0.1]);
    addPart("hip_flexors", flexorGeo, [0.18, 0.15, 0.12], [0, 0, 0.1]);

    // Legs (Thighs/Quads/Hamstrings)
    const thighGeo = new THREE.CylinderGeometry(0.18, 0.13, 0.8, 12);
    // Quads (Front/Outer thigh)
    addPart("quads", thighGeo, [-0.22, -0.35, 0.05], [0, 0, -0.05]);
    addPart("quads", thighGeo, [0.22, -0.35, 0.05], [0, 0, 0.05]);
    // Hamstrings (Back/Inner thigh)
    addPart("hamstrings", thighGeo, [-0.22, -0.38, -0.12], [0, 0, -0.05]);
    addPart("hamstrings", thighGeo, [0.22, -0.38, -0.12], [0, 0, 0.05]);

    // Calves
    const calfGeo = new THREE.CylinderGeometry(0.13, 0.08, 0.75, 12);
    addPart("calves", calfGeo, [-0.22, -1.15, -0.04], [0, 0, -0.02]);
    addPart("calves", calfGeo, [0.22, -1.15, -0.04], [0, 0, 0.02]);

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
