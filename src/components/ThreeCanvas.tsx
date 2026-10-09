import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Artwork, PORTFOLIO_WORKS } from '../data/portfolioData';
import { soundFx } from '../utils/audio';

export type ViewLayoutMode = 'pavilion' | 'ribbon' | 'aerial';
export type LensFocalMode = '24mm' | '50mm' | '85mm';

interface ThreeCanvasProps {
  activeIndex: number;
  onSelectArtwork: (index: number) => void;
  layoutMode: ViewLayoutMode;
  focalMode: LensFocalMode;
  isInspecting: boolean;
  onExitInspection: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  activeIndex,
  onSelectArtwork,
  layoutMode,
  focalMode,
  isInspecting,
  onExitInspection,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // References to preserve Three.js state across renders
  const stateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    artworksGroup: THREE.Group;
    artworkMeshes: THREE.Mesh[];
    frameGroups: THREE.Group[];
    spotlights: THREE.SpotLight[];
    particles: THREE.Points;
    targetCamPos: THREE.Vector3;
    currentCamPos: THREE.Vector3;
    targetLookAt: THREE.Vector3;
    currentLookAt: THREE.Vector3;
    targetFov: number;
    mouse: THREE.Vector2;
    mouseTarget: THREE.Vector2;
    isDragging: boolean;
    dragStart: { x: number; y: number };
    orbitOffset: { theta: number; phi: number; distance: number };
    raycaster: THREE.Raycaster;
    animationFrameId: number;
    clock: THREE.Clock;
    hoveredIndex: number | null;
  } | null>(null);

  // Helper to convert focal length string to FOV degrees
  const getFovForLens = (lens: LensFocalMode): number => {
    switch (lens) {
      case '24mm':
        return 72; // Wide cinematic perspective
      case '50mm':
        return 45; // Human eye natural perspective
      case '85mm':
        return 28; // Compressed portrait telephoto
    }
  };

  // Helper to create texture for 3D gallery plaques
  const createPlaqueTexture = (index: number, title: string, year: number): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#121216';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '600 24px monospace';
      ctx.fillText(`NO. ${String(index + 1).padStart(2, '0')}  /  ${year}`, 32, 45);

      ctx.fillStyle = '#f4f4f5';
      ctx.font = '700 28px sans-serif';
      const truncatedTitle = title.length > 24 ? title.substring(0, 22) + '...' : title;
      ctx.fillText(truncatedTitle, 32, 90);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  };

  // Recalculate target camera and lookAt based on props
  const updateCameraTargets = useCallback(() => {
    if (!stateRef.current) return;
    const { targetCamPos, targetLookAt, orbitOffset } = stateRef.current;
    const currentArtwork = PORTFOLIO_WORKS[activeIndex] || PORTFOLIO_WORKS[0];

    const targetFov = getFovForLens(focalMode);
    stateRef.current.targetFov = targetFov;

    if (layoutMode === 'aerial') {
      // High-angle architectural overview of the entire pavilion
      targetCamPos.set(0, 24, 18);
      targetLookAt.set(0, 1.5, -2);
      return;
    }

    // Determine base position of the active artwork depending on layout mode
    const basePos = layoutMode === 'pavilion' ? currentArtwork.galleryPosition : currentArtwork.ribbonPosition;
    const baseRot = layoutMode === 'pavilion' ? currentArtwork.galleryRotation : currentArtwork.ribbonRotation;

    const artPos = new THREE.Vector3(...basePos);
    targetLookAt.copy(artPos);
    targetLookAt.y += 0.2; // Aim slightly at upper center of artwork

    if (isInspecting) {
      // Close inspection: camera moves right in front of the artwork aligned with its normal
      const normal = new THREE.Vector3(0, 0, 1);
      const euler = new THREE.Euler(...baseRot);
      normal.applyEuler(euler);

      // Distance depends on lens focal mode to maintain frame composition
      const distance = focalMode === '24mm' ? 3.2 : focalMode === '50mm' ? 5.2 : 8.0;

      // Allow subtle user orbit offset when inspecting
      const offsetPos = new THREE.Vector3(
        distance * Math.sin(orbitOffset.theta) * Math.cos(orbitOffset.phi),
        distance * Math.sin(orbitOffset.phi),
        distance * Math.cos(orbitOffset.theta) * Math.cos(orbitOffset.phi)
      );
      offsetPos.applyEuler(euler);

      targetCamPos.copy(artPos).add(offsetPos);
    } else {
      // Curated Exhibition Walkway position
      if (layoutMode === 'pavilion') {
        // Move along gallery floor in front of artwork with cinematic angle
        const camDist = 6.2;
        const camHeight = 2.4;
        const camX = artPos.x + Math.sin(baseRot[1]) * 1.5;
        const camZ = artPos.z + camDist;
        targetCamPos.set(camX, camHeight, camZ);
      } else {
        // Ribbon spatial pathway: cinematic flowing perspective
        targetCamPos.set(artPos.x * 0.9, artPos.y + 0.5, artPos.z + 7.5);
      }
    }
  }, [activeIndex, layoutMode, focalMode, isInspecting]);

  useEffect(() => {
    updateCameraTargets();
  }, [updateCameraTargets]);

  // Initial Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070709');
    scene.fog = new THREE.FogExp2('#070709', 0.016);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 12);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight('#dedede', 0.45);
    scene.add(ambientLight);

    const dirRimLight = new THREE.DirectionalLight('#ffffff', 0.6);
    dirRimLight.position.set(0, 20, 15);
    scene.add(dirRimLight);

    // 5. Gallery Floor with subtle reflections & grid markers
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#0d0d12',
      roughness: 0.28,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle architectural floor lines / grid
    const grid = new THREE.GridHelper(70, 35, '#22222a', '#14141a');
    grid.position.y = 0.01;
    scene.add(grid);

    // 6. Floating Dust Motes (Particles)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 50;
      particlePositions[i + 1] = Math.random() * 8 + 0.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#ffffff',
      size: 0.045,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Load Artworks and assemble 3D Picture Frames
    const textureLoader = new THREE.TextureLoader();
    const artworksGroup = new THREE.Group();
    scene.add(artworksGroup);

    const artworkMeshes: THREE.Mesh[] = [];
    const frameGroups: THREE.Group[] = [];
    const spotlights: THREE.SpotLight[] = [];

    let loadedCount = 0;
    const totalToLoad = PORTFOLIO_WORKS.length;

    PORTFOLIO_WORKS.forEach((work, index) => {
      const singleFrameGroup = new THREE.Group();
      singleFrameGroup.userData = { artworkIndex: index };

      // Base dimensions in 3D units
      const frameHeight = 3.6;
      const frameWidth = frameHeight * work.aspectRatio;

      // Gallery Stand / Stanchion Wall behind the frame (Pavilion mode)
      const wallGeo = new THREE.BoxGeometry(frameWidth + 1.2, frameHeight + 1.6, 0.2);
      const wallMat = new THREE.MeshStandardMaterial({
        color: '#131318',
        roughness: 0.85,
        metalness: 0.05,
      });
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.z = -0.15;
      wallMesh.receiveShadow = true;
      singleFrameGroup.add(wallMesh);

      // Artwork Texture Loader
      textureLoader.load(
        work.imageSrc,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.generateMipmaps = true;

          // Canvas Plane
          const artGeo = new THREE.PlaneGeometry(frameWidth, frameHeight);
          const artMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.35,
            metalness: 0.05,
          });
          const artMesh = new THREE.Mesh(artGeo, artMat);
          artMesh.castShadow = true;
          artMesh.userData = { artworkIndex: index, isArtworkPlane: true };
          singleFrameGroup.add(artMesh);
          artworkMeshes.push(artMesh);

          // Thin Beveled Aluminum Border Frame
          const borderGeo = new THREE.BoxGeometry(frameWidth + 0.12, frameHeight + 0.12, 0.08);
          const borderMat = new THREE.MeshStandardMaterial({
            color: '#08080a',
            roughness: 0.25,
            metalness: 0.8,
          });
          const borderMesh = new THREE.Mesh(borderGeo, borderMat);
          borderMesh.position.z = -0.04;
          singleFrameGroup.add(borderMesh);

          // Subtle museum glass overlay plane
          const glassGeo = new THREE.PlaneGeometry(frameWidth, frameHeight);
          const glassMat = new THREE.MeshPhysicalMaterial({
            roughness: 0.08,
            transmission: 0.9,
            thickness: 0.02,
            reflectivity: 0.3,
            transparent: true,
            opacity: 0.25,
          });
          const glassMesh = new THREE.Mesh(glassGeo, glassMat);
          glassMesh.position.z = 0.01;
          singleFrameGroup.add(glassMesh);

          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalToLoad) * 100));
          if (loadedCount >= totalToLoad) {
            setIsLoading(false);
          }
        },
        undefined,
        () => {
          // Fallback if texture load fails
          const artGeo = new THREE.PlaneGeometry(frameWidth, frameHeight);
          const artMat = new THREE.MeshStandardMaterial({ color: '#27272a' });
          const artMesh = new THREE.Mesh(artGeo, artMat);
          artMesh.userData = { artworkIndex: index, isArtworkPlane: true };
          singleFrameGroup.add(artMesh);
          artworkMeshes.push(artMesh);
          loadedCount++;
          if (loadedCount >= totalToLoad) setIsLoading(false);
        }
      );

      // Gallery Plaque Mesh
      const plaqueGeo = new THREE.PlaneGeometry(1.6, 0.4);
      const plaqueMat = new THREE.MeshBasicMaterial({
        map: createPlaqueTexture(index, work.title, work.year),
        transparent: true,
      });
      const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
      plaqueMesh.position.set(0, -(frameHeight / 2) - 0.45, 0.01);
      singleFrameGroup.add(plaqueMesh);

      // Dedicated Exhibition Spotlight focused on this artwork
      const spotLight = new THREE.SpotLight('#fff8f0', 2.8, 16, Math.PI / 4, 0.4, 1.2);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      spotLight.target = singleFrameGroup;
      scene.add(spotLight);
      spotlights.push(spotLight);

      artworksGroup.add(singleFrameGroup);
      frameGroups.push(singleFrameGroup);
    });

    // Raycaster for click and hover interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0, 0);
    const mouseTarget = new THREE.Vector2(0, 0);

    // Initial Targets
    const targetCamPos = new THREE.Vector3(0, 2.4, 6);
    const currentCamPos = camera.position.clone();
    const targetLookAt = new THREE.Vector3(0, 2.5, 0);
    const currentLookAt = new THREE.Vector3(0, 2.5, 0);

    const clock = new THREE.Clock();

    stateRef.current = {
      scene,
      camera,
      renderer,
      artworksGroup,
      artworkMeshes,
      frameGroups,
      spotlights,
      particles,
      targetCamPos,
      currentCamPos,
      targetLookAt,
      currentLookAt,
      targetFov: 45,
      mouse,
      mouseTarget,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      orbitOffset: { theta: 0, phi: 0, distance: 4.8 },
      raycaster,
      animationFrameId: 0,
      clock,
      hoveredIndex: null,
    };

    updateCameraTargets();

    // Resize Handler
    const handleResize = () => {
      if (!container || !stateRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      stateRef.current.camera.aspect = w / h;
      stateRef.current.camera.updateProjectionMatrix();
      stateRef.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Mouse Move (Parallax & Pointer detection)
    const handlePointerMove = (e: PointerEvent) => {
      if (!container || !stateRef.current) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouseTarget.set(x, y);

      // Handle drag rotation if pointer is down
      if (stateRef.current.isDragging) {
        const deltaX = e.clientX - stateRef.current.dragStart.x;
        const deltaY = e.clientY - stateRef.current.dragStart.y;
        stateRef.current.dragStart = { x: e.clientX, y: e.clientY };

        stateRef.current.orbitOffset.theta -= deltaX * 0.005;
        stateRef.current.orbitOffset.phi = Math.max(
          -0.6,
          Math.min(0.6, stateRef.current.orbitOffset.phi + deltaY * 0.005)
        );
      }
    };

    // Pointer Down & Up for drag
    const handlePointerDown = (e: PointerEvent) => {
      if (!stateRef.current) return;
      stateRef.current.isDragging = true;
      stateRef.current.dragStart = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      if (!stateRef.current) return;
      stateRef.current.isDragging = false;
    };

    // Click Raycast Handler
    const handleClick = (e: MouseEvent) => {
      if (!container || !stateRef.current) return;
      const rect = container.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      );

      stateRef.current.raycaster.setFromCamera(clickMouse, stateRef.current.camera);
      const intersects = stateRef.current.raycaster.intersectObjects(stateRef.current.artworkMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const clickedIdx = hit.userData.artworkIndex;
        if (typeof clickedIdx === 'number') {
          soundFx.playShutter();
          onSelectArtwork(clickedIdx);
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('click', handleClick);

    // Animation Loop
    const animate = () => {
      if (!stateRef.current) return;
      const {
        camera,
        renderer,
        scene,
        targetCamPos,
        currentCamPos,
        targetLookAt,
        currentLookAt,
        mouse,
        mouseTarget,
        frameGroups,
        spotlights,
        particles,
        raycaster,
        artworkMeshes,
        targetFov,
      } = stateRef.current;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouseTarget.x - mouse.x) * 0.08;
      mouse.y += (mouseTarget.y - mouse.y) * 0.08;

      // Smooth camera position and lookAt interpolation (Damped spring lerp)
      const lerpSpeed = 0.055;

      // Add subtle subtle parallax to camera
      const parallaxFactor = isInspecting ? 0.15 : 0.45;
      const effectiveTargetPos = targetCamPos.clone();
      effectiveTargetPos.x += mouse.x * parallaxFactor;
      effectiveTargetPos.y += mouse.y * (parallaxFactor * 0.6);

      currentCamPos.lerp(effectiveTargetPos, lerpSpeed);
      camera.position.copy(currentCamPos);

      currentLookAt.lerp(targetLookAt, lerpSpeed);
      camera.lookAt(currentLookAt);

      // Smooth FOV interpolation
      if (Math.abs(camera.fov - targetFov) > 0.01) {
        camera.fov += (targetFov - camera.fov) * 0.07;
        camera.updateProjectionMatrix();
      }

      // Update frame placements according to active layout mode
      PORTFOLIO_WORKS.forEach((work, idx) => {
        const frame = frameGroups[idx];
        const spot = spotlights[idx];
        if (!frame || !spot) return;

        const targetPos =
          layoutMode === 'pavilion' ? work.galleryPosition : work.ribbonPosition;
        const targetRot =
          layoutMode === 'pavilion' ? work.galleryRotation : work.ribbonRotation;

        // Subtle organic levitation breathing in ribbon mode
        let posY = targetPos[1];
        if (layoutMode === 'ribbon') {
          posY += Math.sin(elapsed * 0.8 + idx * 1.2) * 0.12;
        }

        frame.position.set(targetPos[0], posY, targetPos[2]);
        frame.rotation.set(targetRot[0], targetRot[1], targetRot[2]);

        // Position spotlight above and forward from frame
        spot.position.set(targetPos[0], targetPos[1] + 4.5, targetPos[2] + 4.2);
        spot.target = frame;

        // Active frame highlight
        if (idx === activeIndex) {
          spot.intensity = 3.6;
        } else {
          spot.intensity = 1.6;
        }
      });

      // Gently animate ambient particles
      if (particles) {
        const posAttr = particles.geometry.attributes.position;
        if (posAttr) {
          const arr = posAttr.array as Float32Array;
          for (let i = 1; i < arr.length; i += 3) {
            arr[i] += Math.sin(elapsed + i) * 0.0015;
          }
          posAttr.needsUpdate = true;
        }
      }

      // Raycast hover effect
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(artworkMeshes);
      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'default';
      }

      renderer.render(scene, camera);
      stateRef.current.animationFrameId = requestAnimationFrame(animate);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('click', handleClick);

      if (stateRef.current) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
        stateRef.current.renderer.dispose();
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      stateRef.current = null;
    };
  }, [layoutMode, onSelectArtwork]);

  return (
    <div className="relative w-full h-full select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading state indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#070709] z-20 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700">
          <div className="text-xs uppercase tracking-[0.25em] text-zinc-400 mb-3 font-mono">
            Calibrating Optics & Spatial Canvas
          </div>
          <div className="w-48 h-[2px] bg-zinc-800 overflow-hidden rounded-full">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-zinc-500 mt-2">{loadProgress}%</span>
        </div>
      )}

      {/* Subtle Spatial Horizon Vignette */}
      <div className="vignette-overlay absolute inset-0 pointer-events-none" />

      {/* Inspecting mode close helper */}
      {isInspecting && (
        <button
          onClick={onExitInspection}
          className="absolute top-20 right-6 z-10 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-xs font-mono tracking-wider text-zinc-300 hover:text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>✕</span>
          <span>EXIT INSPECTION [ESC]</span>
        </button>
      )}
    </div>
  );
};
