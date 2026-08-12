'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { flagshipProject, enterpriseCaseStudies, personalInfo } from '@/data/portfolio';
import { personalStory } from '@/data/personalStory';
import { Sparkles, BookOpen, RotateCcw, CheckCircle2, ChevronRight, X, FileText, Mail, Briefcase, Download, Scroll, Play, Moon, Sun, Heart } from 'lucide-react';

interface DroppedItem {
  id: string;
  type: 'log' | 'acorn' | 'scroll';
  mesh: THREE.Group;
  title: string;
  category: string;
  content: string;
  linkUrl?: string;
  velocity: THREE.Vector3;
  groundY: number;
}

export function TreeShakeGame() {

  const containerRef = useRef<HTMLDivElement>(null);
  const [shakeCount, setShakeCount] = useState<number>(0);
  const [treeHealth, setTreeHealth] = useState<number>(100);

  // WELCOME INTRO MODAL STATE
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);

  // SPOOKY NIGHT MODE TOGGLE STATE
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const isNightModeRef = useRef<boolean>(false);

  // 3D SQUIRREL ANCHOR SCREEN POSITION FOR SPEECH BUBBLE
  const [squirrelScreenPos, setSquirrelScreenPos] = useState<{ x: number; y: number } | null>(null);

  // UNLOCKED JOURNAL & CONTACT ITEMS
  const [unlockedDossierIds, setUnlockedDossierIds] = useState<string[]>([]);
  const [activeInfo, setActiveInfo] = useState<{ id?: string; title: string; category: string; content: string; linkUrl?: string } | null>(null);
  const [showFullDossier, setShowFullDossier] = useState<boolean>(false);

  // DISMISSABLE JOURNAL SIDEBAR & FLOATING BUTTON TRIGGER STATE
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [hasUnreadJournal, setHasUnreadJournal] = useState<boolean>(false);


  // GROUND UNCOLLECTED ITEMS COUNT & ACTIVE SHAKING STATE FOR SQUIRREL DIALOGUE
  const [groundItemCount, setGroundItemCount] = useState<number>(0);
  const [isShakingTree, setIsShakingTree] = useState<boolean>(false);

  // References for game reset
  const resetGameRef = useRef<() => void>(() => { });

  const infoCategories = [
    {
      id: 'building-homebaked',
      type: 'log' as const,
      title: 'THE HOMEBAKED JOURNEY',
      category: 'CO-FOUNDER & LEAD ENGINEER',
      content: 'Co-founding Homebaked came from wanting to build something real for local neighborhood bakeries. I built our unified API with Next.js and Postgres to power both our web app and native iOS app in React Native, setting up automated Stripe Connect payouts, push notifications, and geospatial discovery. Seeing real bakers use it to run their business is the best feeling in the world.',
      linkUrl: flagshipProject.url,
    },
    {
      id: 'fintech-pipelines',
      type: 'log' as const,
      title: 'SCALING FINTECH & REAL-TIME DATA',
      category: 'BILL.COM & DIVVY',
      content: 'At Bill.com and Divvy, I got to work on heavy real-time data pipelines, processing incoming database updates across microservices without losing a single bit. I love working on high-throughput systems where reliability is everything, whether that is designing receipt automation tools, OCR document extractions, or building telemetry workflows to catch errors early.',
    },
    {
      id: 'how-i-work',
      type: 'log' as const,
      title: 'CRAFT, DESIGN, & COLLABORATION',
      category: 'ENGINEERING PHILOSOPHY',
      content: 'I approach software development as a creative, hands-on process. I love taking complex business logic and turning it into clean, modular code that designers, product owners, and other developers genuinely enjoy working with. Whether I am architecting Elixir backends or polishing React components, my goal is always to make software that is simple, fast, and delightful to use.',
    },
    {
      id: 'life-hobbies',
      type: 'log' as const,
      title: 'LIFE, FAMILY, & WEEKLY OBSESSIONS',
      category: 'BEYOND THE CODE',
      content: 'My world revolves around my family: my wife, my two daughters, and our cat Bumi. Born and raised in Utah, I love snowboarding, golf, 3D printing, PC gaming, and building indie games. I get continually obsessed with random rabbit-hole hobbies for a week, whether that is photography, clay sculpting, furniture refurbishing, or skateboarding. Big fan of games like Outer Wilds and Dredge, and movies like Oppenheimer or Superbad.',
    },
    {
      id: 'contact-email',
      type: 'acorn' as const,
      title: 'GET IN TOUCH DIRECTLY',
      category: 'LET\'S CHAT',
      content: `Shoot me an email at ${personalInfo.email} or call ${personalInfo.phone}. Always down to chat about engineering roles, technical architecture, game dev, or Utah mountain trails!`,
      linkUrl: `mailto:${personalInfo.email}`,
    },
    {
      id: 'contact-linkedin',
      type: 'acorn' as const,
      title: 'LINKEDIN PROFILE',
      category: 'CONNECT WITH ALAN',
      content: 'Connect with me on LinkedIn (linkedin.com/in/alan-mamulski) to check out my work history, recommendations, and past squad projects.',
      linkUrl: personalInfo.socials.linkedin,
    },
    {
      id: 'contact-github',
      type: 'acorn' as const,
      title: 'GITHUB REPOSITORIES',
      category: 'CODE & SIDE PROJECTS',
      content: 'Check out my GitHub (github.com/AMMSKI) for open-source code, 3D web experiments, and side projects I build for fun.',
      linkUrl: personalInfo.socials.github,
    },
    {
      id: 'resume-scroll',
      type: 'scroll' as const,
      title: 'GOLDEN RESUME SCROLL',
      category: 'DOWNLOAD OFFICIAL RESUME',
      content: 'Grab a copy of my official 2026 software engineering resume PDF detailing my work at Bill.com, Anglepoint, Divvy, and Homebaked.',
      linkUrl: '/resume.pdf',
    },
  ];

  // Sync ref with React state
  useEffect(() => {
    isNightModeRef.current = isNightMode;
  }, [isNightMode]);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. THREE.JS SCENE SETUP ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 11, 28);
    camera.lookAt(0, 8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. DYNAMIC LIGHTING FOR DAY / SPOOKY NIGHT ---
    const ambientLight = new THREE.AmbientLight(0xfff8ed, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xf59e0b, 1.6);
    sunLight.position.set(-22, 28, -30); // Exactly matches 3D Sun & Moon position!
    sunLight.castShadow = true;
    sunLight.shadow.bias = -0.0005;

    // EXPAND SHADOW CAMERA BOUNDS SO THE TALL TREE SHADOW IS NEVER CLIPPED
    sunLight.shadow.camera.left = -35;
    sunLight.shadow.camera.right = 35;
    sunLight.shadow.camera.top = 35;
    sunLight.shadow.camera.bottom = -35;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;

    scene.add(sunLight);



    // --- 3. CUSTOM 3-STEP TOON GRADIENT RAMP TEXTURE ---
    const toonCanvas = document.createElement('canvas');
    toonCanvas.width = 4;
    toonCanvas.height = 1;
    const toonCtx = toonCanvas.getContext('2d');
    if (toonCtx) {
      toonCtx.fillStyle = '#4a5568';
      toonCtx.fillRect(0, 0, 1, 1);
      toonCtx.fillStyle = '#cbd5e1';
      toonCtx.fillRect(1, 0, 2, 1);
      toonCtx.fillStyle = '#ffffff';
      toonCtx.fillRect(3, 0, 1, 1);
    }
    const toonRampTexture = new THREE.CanvasTexture(toonCanvas);
    toonRampTexture.minFilter = THREE.NearestFilter;
    toonRampTexture.magFilter = THREE.NearestFilter;

    const createToonMaterialWithOutline = (colorHex: number, outlineColorHex = 0x1c1917) => {
      const toonMat = new THREE.MeshToonMaterial({
        color: colorHex,
        gradientMap: toonRampTexture,
      });

      const outlineMat = new THREE.MeshBasicMaterial({
        color: outlineColorHex,
        side: THREE.BackSide,
      });

      return { toonMat, outlineMat };
    };

    const attachOutlineMesh = (mesh: THREE.Mesh, outlineMat: THREE.Material, scaleFactor = 1.04) => {
      const outlineMesh = new THREE.Mesh(mesh.geometry, outlineMat);
      outlineMesh.position.copy(mesh.position);
      outlineMesh.rotation.copy(mesh.rotation);
      outlineMesh.scale.copy(mesh.scale).multiplyScalar(scaleFactor);
      return outlineMesh;
    };

    // --- 4. DISTANT LOW-POLY TREE LINE SILHOUETTE WITH NATURAL DEPTH VARIATION ---
    const treeLineGroup = new THREE.Group();

    const bgFoliageDayColor = 0x3d6645;
    const bgFoliageNightColor = 0x1a2e20;
    const bgFoliageMat = new THREE.MeshToonMaterial({ color: bgFoliageDayColor, gradientMap: toonRampTexture });
    const bgTrunkMat = new THREE.MeshToonMaterial({ color: 0x4a3222, gradientMap: toonRampTexture });
    const bgOutlineMat = new THREE.MeshBasicMaterial({ color: 0x1c1917, side: THREE.BackSide });

    for (let t = 0; t < 22; t++) {
      const bgTree = new THREE.Group();

      const bTrunkGeo = new THREE.CylinderGeometry(0.4, 0.6, 6, 8);
      const bTrunk = new THREE.Mesh(bTrunkGeo, bgTrunkMat);
      bTrunk.position.y = 3;
      bgTree.add(bTrunk);

      for (let c = 0; c < 3; c++) {
        const bConeGeo = new THREE.ConeGeometry(3.2 - c * 0.7, 2.8, 8);
        const bCone = new THREE.Mesh(bConeGeo, bgFoliageMat);
        bCone.position.y = 4.5 + c * 1.8;
        bgTree.add(bCone);
        bgTree.add(attachOutlineMesh(bCone, bgOutlineMat, 1.04));
      }

      const angle = -Math.PI * 0.75 + (t / 21) * (Math.PI * 1.5);
      const dist = 32 + (Math.sin(t * 3.7) * 8) + (Math.random() - 0.5) * 6;
      const posX = Math.sin(angle) * dist;
      const posZ = -Math.cos(angle) * (dist * 0.85);

      if (Math.abs(posX) < 5 && posZ > -30) continue;

      bgTree.position.set(posX, 0, posZ);
      const scale = 0.55 + Math.random() * 0.65;
      bgTree.scale.set(scale, scale * (0.9 + Math.random() * 0.3), scale);
      bgTree.rotation.y = Math.random() * Math.PI * 2;

      treeLineGroup.add(bgTree);
    }
    scene.add(treeLineGroup);

    // --- 5. FLUFFY DRIFTING TOON CLOUDS, 3D GOLDEN SUN, MOON & 3D LIGHTNING BOLT ---
    const celestialGroup = new THREE.Group();

    const sunGeo = new THREE.SphereGeometry(3.8, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 }); // Bright warm yellow ☀️
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    celestialGroup.add(sunMesh);

    const moonGeo = new THREE.SphereGeometry(3.5, 24, 24);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    celestialGroup.add(moonMesh);

    celestialGroup.position.set(-22, 28, -30);
    scene.add(celestialGroup);


    const cloudList: { mesh: THREE.Group; speed: number; startX: number }[] = [];
    const cloudGroup = new THREE.Group();

    const { toonMat: cloudMat, outlineMat: cloudOutlineMat } = createToonMaterialWithOutline(0xffffff);

    const cloudPositions = [
      { x: -28, y: 22, z: -25, scale: 1.4, speed: 0.8 },
      { x: 12, y: 25, z: -30, scale: 1.8, speed: 0.6 },
      { x: -8, y: 27, z: -35, scale: 2.2, speed: 0.5 },
      { x: 30, y: 21, z: -22, scale: 1.2, speed: 1.0 },
    ];

    cloudPositions.forEach((cp) => {
      const singleCloud = new THREE.Group();

      const p1 = new THREE.Mesh(new THREE.SphereGeometry(2.0, 12, 12), cloudMat);
      singleCloud.add(p1);
      singleCloud.add(attachOutlineMesh(p1, cloudOutlineMat, 1.04));

      const p2 = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 12), cloudMat);
      p2.position.set(-1.8, -0.3, 0);
      singleCloud.add(p2);
      singleCloud.add(attachOutlineMesh(p2, cloudOutlineMat, 1.04));

      const p3 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 12), cloudMat);
      p3.position.set(1.7, -0.2, 0);
      singleCloud.add(p3);
      singleCloud.add(attachOutlineMesh(p3, cloudOutlineMat, 1.04));

      const p4 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), cloudMat);
      p4.position.set(0, 0.8, 0.3);
      singleCloud.add(p4);
      singleCloud.add(attachOutlineMesh(p4, cloudOutlineMat, 1.04));

      singleCloud.position.set(cp.x, cp.y, cp.z);
      singleCloud.scale.set(cp.scale, cp.scale * 0.7, cp.scale);
      cloudGroup.add(singleCloud);

      cloudList.push({
        mesh: singleCloud,
        speed: cp.speed,
        startX: cp.x,
      });
    });
    scene.add(cloudGroup);

    // Ground Plane
    const groundGeo = new THREE.PlaneGeometry(140, 140, 32, 32);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 124);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const alphaMapTexture = new THREE.CanvasTexture(canvas);

    const groundMat = new THREE.MeshToonMaterial({
      color: 0x9cb896,
      gradientMap: toonRampTexture,
      alphaMap: alphaMapTexture,
      transparent: true,
      depthWrite: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- 6. STYLIZED TOON PINE TREE ---
    const treeRootGroup = new THREE.Group();
    treeRootGroup.position.set(0, 0, 0);
    scene.add(treeRootGroup);

    const trunkGeo = new THREE.CylinderGeometry(0.7, 1.2, 12, 16);
    const { toonMat: trunkMat, outlineMat: trunkOutlineMat } = createToonMaterialWithOutline(0x6e4732);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 5;
    trunk.castShadow = true;
    treeRootGroup.add(trunk);
    treeRootGroup.add(attachOutlineMesh(trunk, trunkOutlineMat, 1.05));

    const foliageDayColors = [0x2d5a38, 0x396c46, 0x477e55, 0x549064, 0x62a273];
    const foliageNightColors = [0x14281b, 0x1d3624, 0x274530, 0x30543b, 0x3b6347];
    const coneMeshes: { mesh: THREE.Mesh; mat: THREE.MeshToonMaterial }[] = [];

    for (let i = 0; i < 5; i++) {
      const coneGeo = new THREE.ConeGeometry(5.0 - i * 0.9, 3.5, 12);
      const { toonMat: coneMat, outlineMat: coneOutlineMat } = createToonMaterialWithOutline(foliageDayColors[i]);
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = 7.5 + i * 2.1;
      cone.castShadow = true;
      treeRootGroup.add(cone);
      treeRootGroup.add(attachOutlineMesh(cone, coneOutlineMat, 1.04));
      coneMeshes.push({ mesh: cone, mat: coneMat });
    }

    // --- 7. STYLIZED TOON SQUIRREL CHARACTERS & RABID NIGHT EYE MATS ---
    const squirrelList: { group: THREE.Group; tail: THREE.Group; basePos: THREE.Vector3; rotOffset: number; eyes: THREE.Mesh[] }[] = [];

    const squirrelPositions = [
      { x: -8.5, z: 4.0, rot: 0.8 },
      { x: 9.2, z: 3.5, rot: -0.7 },
      { x: -7.0, z: -6.2, rot: 1.3 },
      { x: 7.5, z: -5.8, rot: -1.2 },
      { x: 0.0, z: 9.5, rot: 0.0 },
    ];

    const { toonMat: bodyFurMat, outlineMat: sqOutlineMat } = createToonMaterialWithOutline(0xc05621);
    const { toonMat: bellyFurMat } = createToonMaterialWithOutline(0xffedd5);
    const { toonMat: tailFurMat } = createToonMaterialWithOutline(0x9c4221);
    const darkDetailMat = new THREE.MeshBasicMaterial({ color: 0x1c1917 });
    const rabidEyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    squirrelPositions.forEach((pos, idx) => {
      const squirrelGroup = new THREE.Group();

      const torsoGeo = new THREE.SphereGeometry(0.55, 16, 16);
      torsoGeo.scale(0.85, 1.2, 0.95);
      const torso = new THREE.Mesh(torsoGeo, bodyFurMat);
      torso.position.y = 0.65;
      torso.castShadow = true;
      squirrelGroup.add(torso);
      squirrelGroup.add(attachOutlineMesh(torso, sqOutlineMat, 1.06));

      const bellyGeo = new THREE.SphereGeometry(0.42, 12, 12);
      bellyGeo.scale(0.7, 1.1, 0.5);
      const belly = new THREE.Mesh(bellyGeo, bellyFurMat);
      belly.position.set(0, 0.62, 0.28);
      squirrelGroup.add(belly);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.35, 0.15);

      const headGeo = new THREE.SphereGeometry(0.38, 16, 16);
      headGeo.scale(0.9, 0.9, 1.0);
      const headMesh = new THREE.Mesh(headGeo, bodyFurMat);
      headMesh.castShadow = true;
      headGroup.add(headMesh);
      headGroup.add(attachOutlineMesh(headMesh, sqOutlineMat, 1.06));

      const muzzleGeo = new THREE.ConeGeometry(0.2, 0.35, 12);
      muzzleGeo.rotateX(Math.PI / 2);
      const muzzle = new THREE.Mesh(muzzleGeo, bellyFurMat);
      muzzle.position.set(0, -0.05, 0.3);
      headGroup.add(muzzle);

      const noseGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const nose = new THREE.Mesh(noseGeo, darkDetailMat);
      nose.position.set(0, -0.02, 0.46);
      headGroup.add(nose);

      const eyeGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const rabidOutlineMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.BackSide });

      const leftEye = new THREE.Mesh(eyeGeo, darkDetailMat);
      leftEye.position.set(-0.16, 0.08, 0.28);
      const leftOutline = new THREE.Mesh(eyeGeo, rabidOutlineMat);
      leftOutline.scale.set(1.4, 1.4, 1.4);
      leftEye.add(leftOutline);

      const rightEye = new THREE.Mesh(eyeGeo, darkDetailMat);
      rightEye.position.set(0.16, 0.08, 0.28);
      const rightOutline = new THREE.Mesh(eyeGeo, rabidOutlineMat);
      rightOutline.scale.set(1.4, 1.4, 1.4);
      rightEye.add(rightOutline);

      headGroup.add(leftEye);
      headGroup.add(rightEye);

      const earGeo = new THREE.ConeGeometry(0.1, 0.28, 8);
      const leftEar = new THREE.Mesh(earGeo, bodyFurMat);
      leftEar.position.set(-0.18, 0.35, 0.0);
      leftEar.rotation.z = -0.25;

      const rightEar = new THREE.Mesh(earGeo, bodyFurMat);
      rightEar.position.set(0.2, 0.35, 0.0);
      rightEar.rotation.z = 0.25;

      headGroup.add(leftEar);
      headGroup.add(rightEar);
      squirrelGroup.add(headGroup);

      const thighGeo = new THREE.SphereGeometry(0.28, 12, 12);
      thighGeo.scale(0.6, 1.0, 0.9);
      const leftThigh = new THREE.Mesh(thighGeo, bodyFurMat);
      leftThigh.position.set(-0.35, 0.4, -0.05);
      const rightThigh = new THREE.Mesh(thighGeo, bodyFurMat);
      rightThigh.position.set(0.35, 0.4, -0.05);
      squirrelGroup.add(leftThigh);
      squirrelGroup.add(rightThigh);

      const pawGeo = new THREE.SphereGeometry(0.1, 8, 8);
      pawGeo.scale(0.8, 1.4, 0.8);
      const leftPaw = new THREE.Mesh(pawGeo, bodyFurMat);
      leftPaw.position.set(-0.18, 0.85, 0.35);
      leftPaw.rotation.x = -0.5;
      const rightPaw = new THREE.Mesh(pawGeo, bodyFurMat);
      rightPaw.position.set(0.18, 0.85, 0.35);
      rightPaw.rotation.x = -0.5;
      squirrelGroup.add(leftPaw);
      squirrelGroup.add(rightPaw);

      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, 0.5, -0.3);

      const tailSeg1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), tailFurMat);
      tailSeg1.scale.set(1.0, 1.4, 1.0);
      tailSeg1.position.set(0, 0.2, -0.2);
      tailSeg1.rotation.x = -0.6;
      tailGroup.add(tailSeg1);

      const tailSeg2 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 14), tailFurMat);
      tailSeg2.scale.set(1.1, 1.6, 1.1);
      tailSeg2.position.set(0, 0.7, -0.35);
      tailSeg2.rotation.x = -0.2;
      tailGroup.add(tailSeg2);

      const tailSeg3 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), tailFurMat);
      tailSeg3.scale.set(1.0, 1.4, 1.0);
      tailSeg3.position.set(0, 1.3, -0.15);
      tailSeg3.rotation.x = 0.4;
      tailGroup.add(tailSeg3);

      squirrelGroup.add(tailGroup);

      squirrelGroup.position.set(pos.x, 0, pos.z);
      squirrelGroup.rotation.y = pos.rot;
      scene.add(squirrelGroup);

      squirrelList.push({
        group: squirrelGroup,
        tail: tailGroup,
        basePos: new THREE.Vector3(pos.x, 0, pos.z),
        rotOffset: idx * 0.8,
        eyes: [leftEye, rightEye],
      });
    });

    // --- 8. DROPPED TOON ITEMS POOL ---
    const itemsList: DroppedItem[] = [];

    let nextItemToSpawn = 0;
    const requiredShakeThresholds = [12, 26, 42, 60, 80, 105, 135, 170];

    const spawnInfoItem = (index: number) => {
      if (index >= infoCategories.length) return;

      const itemData = infoCategories[index];
      const itemGroup = new THREE.Group();

      if (itemData.type === 'log') {
        const lGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.8, 12);
        const { toonMat: lMat, outlineMat: lOutlineMat } = createToonMaterialWithOutline(0x8b5e3c);
        const lMesh = new THREE.Mesh(lGeo, lMat);
        lMesh.rotation.z = Math.PI / 2;
        lMesh.castShadow = true;
        itemGroup.add(lMesh);
        itemGroup.add(attachOutlineMesh(lMesh, lOutlineMat, 1.06));
      } else if (itemData.type === 'acorn') {
        const nutGeo = new THREE.SphereGeometry(0.7, 16, 16);
        nutGeo.scale(1, 1.3, 1);
        const { toonMat: nutMat, outlineMat: acornOutlineMat } = createToonMaterialWithOutline(0xd97706);
        const nut = new THREE.Mesh(nutGeo, nutMat);
        nut.castShadow = true;
        itemGroup.add(nut);
        itemGroup.add(attachOutlineMesh(nut, acornOutlineMat, 1.06));

        const capGeo = new THREE.CylinderGeometry(0.75, 0.5, 0.5, 12);
        const { toonMat: capMat } = createToonMaterialWithOutline(0x6e4732);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 0.65;
        itemGroup.add(cap);

        const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
        const { toonMat: stemMat } = createToonMaterialWithOutline(0x4a2e18);
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 0.95;
        itemGroup.add(stem);
      } else {
        const scrollGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.2, 16);
        const scrollMat = new THREE.MeshToonMaterial({
          color: 0xfacc15,
          emissive: 0xfacc15,
          emissiveIntensity: 0.6,
          gradientMap: toonRampTexture,
        });
        const scrollMesh = new THREE.Mesh(scrollGeo, scrollMat);
        scrollMesh.rotation.z = Math.PI / 2;
        scrollMesh.castShadow = true;
        itemGroup.add(scrollMesh);

        const scrollOutlineMat = new THREE.MeshBasicMaterial({ color: 0x78350f, side: THREE.BackSide });
        itemGroup.add(attachOutlineMesh(scrollMesh, scrollOutlineMat, 1.08));

        const ribbonGeo = new THREE.TorusGeometry(0.54, 0.1, 12, 24);
        const { toonMat: ribbonMat } = createToonMaterialWithOutline(0x991b1b);
        const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
        ribbon.rotation.y = Math.PI / 2;
        itemGroup.add(ribbon);

        const scrollGlowLight = new THREE.PointLight(0xfacc15, 6.0, 12);
        scrollGlowLight.position.set(0, 0, 0);
        itemGroup.add(scrollGlowLight);

        const auraCanvas = document.createElement('canvas');
        auraCanvas.width = 128;
        auraCanvas.height = 128;
        const auraCtx = auraCanvas.getContext('2d');
        if (auraCtx) {
          const radial = auraCtx.createRadialGradient(64, 64, 4, 64, 64, 60);
          radial.addColorStop(0, 'rgba(253, 224, 71, 0.9)');
          radial.addColorStop(0.3, 'rgba(245, 158, 11, 0.5)');
          radial.addColorStop(0.7, 'rgba(217, 119, 6, 0.15)');
          radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
          auraCtx.fillStyle = radial;
          auraCtx.fillRect(0, 0, 128, 128);
        }
        const auraTexture = new THREE.CanvasTexture(auraCanvas);
        const spriteMat = new THREE.SpriteMaterial({
          map: auraTexture,
          blending: THREE.AdditiveBlending,
          transparent: true,
        });
        const glowSprite = new THREE.Sprite(spriteMat);
        glowSprite.scale.set(7.5, 7.5, 1.0);
        itemGroup.add(glowSprite);
      }

      const frontAngle = -Math.PI / 3 + (index / (infoCategories.length - 1)) * ((Math.PI * 2) / 3);
      const radius = 3.5 + (index % 3) * 1.8;
      const spawnX = Math.sin(frontAngle) * radius;
      const spawnZ = 1.5 + Math.cos(frontAngle) * (radius * 0.8);

      itemGroup.position.set(spawnX, 14, spawnZ);
      scene.add(itemGroup);

      itemsList.push({
        id: itemData.id,
        type: itemData.type,
        mesh: itemGroup,
        title: itemData.title,
        category: itemData.category,
        content: itemData.content,
        linkUrl: itemData.linkUrl,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          5,
          (Math.random() - 0.5) * 4
        ),
        groundY: 1.2,
      });

      setGroundItemCount(itemsList.length);
    };

    resetGameRef.current = () => {
      itemsList.forEach((item) => {
        if (item.mesh.parent) {
          scene.remove(item.mesh);
        }
      });
      itemsList.length = 0;
      nextItemToSpawn = 0;
      setShakeCount(0);
      setTreeHealth(100);
      setUnlockedDossierIds([]);
      setActiveInfo(null);
      setShowFullDossier(false);
      setGroundItemCount(0);
      setIsShakingTree(false);
    };

    // --- 9. DUAL-AXIS HARMONIC SWAY PHYSICS ---
    let isMouseDownOnTree = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    let targetSwayZ = 0;
    let targetSwayX = 0;

    let currentSwayZ = 0;
    let currentSwayX = 0;

    let swayVelZ = 0;
    let swayVelX = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: PointerEvent | TouchEvent) => {
      setActiveInfo(null);

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as PointerEvent).clientY;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      let itemClicked = false;
      itemsList.forEach((item) => {
        const intersects = raycaster.intersectObject(item.mesh, true);
        if (intersects.length > 0) {
          itemClicked = true;

          scene.remove(item.mesh);
          const remList = itemsList.filter(i => i.id !== item.id);
          itemsList.length = 0;
          itemsList.push(...remList);
          setGroundItemCount(itemsList.length);

          setUnlockedDossierIds((prev) => {
            if (!prev.includes(item.id)) {
              setHasUnreadJournal(true); // Trigger new item badge indicator!
              return [...prev, item.id];
            }
            return prev;
          });


          setActiveInfo({
            id: item.id,
            title: item.title,
            category: item.category,
            content: item.content,
            linkUrl: item.linkUrl,
          });
        }
      });

      if (!itemClicked) {
        const treeIntersects = raycaster.intersectObject(treeRootGroup, true);
        if (treeIntersects.length > 0) {
          isMouseDownOnTree = true;
          setIsShakingTree(true);
          lastMouseX = clientX;
          lastMouseY = clientY;
        }
      }
    };

    const handlePointerUp = () => {
      isMouseDownOnTree = false;
      setIsShakingTree(false);
    };

    const handlePointerMove = (e: PointerEvent | TouchEvent) => {
      if (!isMouseDownOnTree) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as PointerEvent).clientY;

      const deltaX = clientX - lastMouseX;
      const deltaY = clientY - lastMouseY;
      lastMouseX = clientX;
      lastMouseY = clientY;

      const totalDist = Math.hypot(deltaX, deltaY);

      if (totalDist > 2) {
        targetSwayZ = Math.max(-0.45, Math.min(0.45, -deltaX * 0.015));
        targetSwayX = Math.max(-0.35, Math.min(0.35, deltaY * 0.012));

        setShakeCount((c) => {
          const nextShake = c + 1;
          setTreeHealth((h) => Math.max(0, h - 1));

          if (
            nextItemToSpawn < requiredShakeThresholds.length &&
            nextShake >= requiredShakeThresholds[nextItemToSpawn]
          ) {
            spawnInfoItem(nextItemToSpawn);
            nextItemToSpawn++;
          }
          return nextShake;
        });
      }
    };

    const domElem = containerRef.current;
    domElem.style.touchAction = 'none'; // Prevent mobile page scrolling while dragging tree!

    domElem.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);

    domElem.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });


    // --- 10. ANIMATION LOOP & DAY / SPOOKY NIGHT TRANSITIONS ---
    let animationFrameId: number;
    let lastTime = performance.now();
    const tempVec = new THREE.Vector3();

    // OPTIMIZED LIGHTNING STRIKE SYSTEM FOR NIGHT MODE (ZERO RE-ALLOCATION)
    let nextLightningTime = performance.now() + 4000;
    let lightningFlashTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const time = now / 1000;

      const nightState = isNightModeRef.current;

      if (nightState) {
        sunMesh.visible = false;
        moonMesh.visible = true;

        ambientLight.color.setHex(0x27272a);
        ambientLight.intensity = 0.5;
        sunLight.color.setHex(0xd97706);
        sunLight.intensity = 0.8;
        groundMat.color.setHex(0x18181b);

        bgFoliageMat.color.setHex(0x14281b);



        const foliageNightColors = [0x14281b, 0x1d3624, 0x274530, 0x30543b, 0x3b6347];
        coneMeshes.forEach((cm, i) => {
          cm.mat.color.setHex(foliageNightColors[i]);
        });


        squirrelList.forEach((sq) => {
          sq.eyes.forEach((e) => {
            e.material = rabidEyeMat;
            e.children.forEach((child) => {
              child.visible = true;
            });
          });
        });
      } else {
        sunMesh.visible = true;
        moonMesh.visible = false;

        ambientLight.color.setHex(0xfff8ed);
        ambientLight.intensity = 0.9;
        sunLight.color.setHex(0xf59e0b);
        sunLight.intensity = 1.6;
        groundMat.color.setHex(0x9cb896);
        bgFoliageMat.color.setHex(bgFoliageDayColor);

        coneMeshes.forEach((cm, i) => {
          cm.mat.color.setHex(foliageDayColors[i]);
        });

        squirrelList.forEach((sq) => {
          sq.eyes.forEach((e) => {
            e.material = darkDetailMat;
            e.children.forEach((child) => {
              child.visible = false;
            });
          });
        });
      }

      // 3D SQUIRRELS ANIMATION LOOP
      squirrelList.forEach((sq) => {
        if (nightState) {
          if (isMouseDownOnTree) {
            sq.group.position.y = Math.abs(Math.sin(time * 17 + sq.rotOffset)) * 0.8;
            sq.group.rotation.y = sq.basePos.x > 0
              ? -0.7 + Math.sin(time * 12) * 0.35
              : 0.7 + Math.sin(time * 12) * 0.35;
            sq.tail.rotation.z = Math.sin(time * 14 + sq.rotOffset) * 0.3;
          } else {
            sq.group.position.y = Math.sin(time * 3 + sq.rotOffset) * 0.04;
            sq.group.rotation.y = sq.basePos.x > 0
              ? -0.7 + (Math.random() - 0.5) * 0.12
              : 0.7 + (Math.random() - 0.5) * 0.12;
            sq.tail.rotation.z = Math.sin(time * 25 + sq.rotOffset) * 0.18;
          }
        } else {
          if (isMouseDownOnTree) {
            sq.group.position.y = Math.abs(Math.sin(time * 12 + sq.rotOffset)) * 0.6;
            sq.group.rotation.y = sq.basePos.x > 0 ? -0.7 + Math.sin(time * 8) * 0.2 : 0.7 + Math.sin(time * 8) * 0.2;
            sq.tail.rotation.z = Math.sin(time * 10 + sq.rotOffset) * 0.15;
          } else {
            sq.group.position.y = Math.sin(time * 2 + sq.rotOffset) * 0.05;
            sq.tail.rotation.z = Math.sin(time * 2 + sq.rotOffset) * 0.05;
          }
        }
      });

      cloudList.forEach((cl) => {
        cl.mesh.position.x += cl.speed * delta;
        if (cl.mesh.position.x > 45) {
          cl.mesh.position.x = -45;
        }
      });

      if (squirrelList.length > 0 && containerRef.current) {
        tempVec.copy(squirrelList[0].group.position);
        tempVec.y += 2.2;
        tempVec.project(camera);

        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight || 600;

        const screenX = ((tempVec.x + 1) * w) / 2;
        const screenY = ((-tempVec.y + 1) * h) / 2;

        setSquirrelScreenPos({ x: screenX, y: screenY });
      }

      const stiffness = 38;
      const damping = 4.2;

      const forceZ = (targetSwayZ - currentSwayZ) * stiffness;
      swayVelZ += forceZ * delta;
      swayVelZ -= swayVelZ * damping * delta;
      currentSwayZ += swayVelZ * delta;

      const forceX = (targetSwayX - currentSwayX) * stiffness;
      swayVelX += forceX * delta;
      swayVelX -= swayVelX * damping * delta;
      currentSwayX += swayVelX * delta;

      treeRootGroup.rotation.z = currentSwayZ;
      treeRootGroup.rotation.x = currentSwayX;

      targetSwayZ *= 0.94;
      targetSwayX *= 0.94;

      itemsList.forEach((item) => {
        if (item.mesh.parent) {
          if (item.mesh.position.y > item.groundY) {
            item.velocity.y -= 12 * delta;
            item.mesh.position.addScaledVector(item.velocity, delta);
          } else {
            item.mesh.position.y = item.groundY;
            item.mesh.rotation.y += 1.5 * delta;
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
      domElem.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
    };

  }, []);

  const unlockedItems = infoCategories.filter(item => unlockedDossierIds.includes(item.id));
  const unlockedProjectLogs = unlockedItems.filter(item => item.type === 'log');
  const unlockedContactAcorns = unlockedItems.filter(item => item.type === 'acorn');
  const unlockedResumeScroll = unlockedItems.find(item => item.type === 'scroll');

  const remainingItemsCount = infoCategories.length - unlockedDossierIds.length;

  const getSquirrelDialogueText = () => {
    if (isNightMode) {
      if (isShakingTree) return "GRRRR!! SHAKE IT FASTER! THE WOODLAND DEMONS AWAKEN!";
      if (groundItemCount > 0) return `SEIZE THE CURSED ${groundItemCount === 1 ? 'ARTIFACT' : `${groundItemCount} ARTIFACTS`} FROM THE MEADOW FLOOR!`;
      if (remainingItemsCount > 0) return `SQUEEE! ${remainingItemsCount} MORE CURSED ARTIFACTS IN THE TREE! KEEP SHAKING!`;
      return "MUAHAHA!! ALL 8 CURSED ARTIFACTS UNLOCKED! INSPECT THE WOODLAND JOURNAL!";
    }
    if (isShakingTree) {
      return "Whoa! Keep shaking! You're loosening something up there!";
    }
    if (groundItemCount > 0) {
      return `Click the ${groundItemCount === 1 ? 'item' : `${groundItemCount} items`} on the ground to gather into your journal!`;
    }
    if (remainingItemsCount > 0) {
      return `${remainingItemsCount} more ${remainingItemsCount === 1 ? 'item' : 'items'} left in the tree! Hold click & sway to drop!`;
    }
    return "Woohoo! All 8 items collected! Click 'Read Complete Journal' to inspect!";
  };

  return (
    <div className={`fixed inset-0 top-[45px] font-serif select-none flex flex-col justify-between overflow-hidden z-40 transition-colors duration-700 ${isNightMode ? 'bg-[#09090b] text-slate-200' : 'bg-[#dce7d5] text-[#2c3e2e]'
      }`}>

      {/* 3D Viewport with Giant Hand Grab Cursor */}
      <div className="relative w-full h-full cursor-[grab] active:cursor-[grabbing]">
        <div ref={containerRef} className="w-full h-full" />

        {/* WELCOME INTRO MODAL POPUP ON ENTRY */}
        {showWelcomeModal && (
          <div className="absolute inset-0 bg-[#2c3e2e]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#fbf9f5] border-4 border-[#8b5e3c] p-8 sm:p-10 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl font-serif">
              <div className="w-16 h-16 rounded-full bg-[#e8e2d5] border-2 border-[#8b5e3c]/40 flex items-center justify-center text-3xl mx-auto shadow-inner">
                🌲
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2c3e2e] italic leading-snug">
                  "Shake the tree and see what falls out"
                </h2>
                <p className="text-xs font-sans text-[#5c4033] leading-relaxed">
                  Hold click & sway your mouse on the pine tree to loosen logs, acorns, and the Golden Resume Scroll into your Woodland Journal!
                </p>
              </div>

              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3.5 rounded-full bg-[#c25e00] hover:bg-[#a34e00] text-white font-sans font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Begin Shaking!</span>
              </button>
            </div>
          </div>
        )}

        {/* DYNAMIC SPEECH BUBBLE ANCHORED DIRECTLY TO 3D NUTTY SQUIRREL IN THE SCENE! */}
        {squirrelScreenPos && !showWelcomeModal && (
          <div
            style={{
              left: `${squirrelScreenPos.x}px`,
              top: `${squirrelScreenPos.y}px`,
            }}
            className="absolute transform -translate-x-1/2 -translate-y-full z-20 pointer-events-none transition-all duration-75"
          >
            <div className={`p-3.5 rounded-2xl text-xs font-sans border-2 shadow-2xl backdrop-blur-md relative max-w-xs text-center pointer-events-auto transition-colors duration-500 ${isNightMode
              ? 'bg-slate-950/95 border-slate-700 text-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.6)]'
              : 'bg-[#fbf9f5]/95 border-[#8b5e3c] text-[#2c3e2e]'
              }`}>
              <div className={`font-bold text-[11px] uppercase tracking-wide mb-0.5 flex items-center justify-center gap-1.5 ${isNightMode ? 'text-red-400' : 'text-[#c25e00]'
                }`}>
                <span className={`w-2 h-2 rounded-full ${isNightMode ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{isNightMode ? 'Rabid Squirrel' : 'Nutty the Squirrel'}</span>
                <span className={`text-[9px] font-normal ${isNightMode ? 'text-slate-400' : 'text-[#7a6758]'}`}>
                  &bull; {isNightMode ? 'Cursed Beast' : 'Forest Companion'}
                </span>
              </div>
              <p className="leading-snug font-medium">
                "{getSquirrelDialogueText()}"
              </p>
              <div className={`absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 ${isNightMode ? 'border-t-slate-700' : 'border-t-[#8b5e3c]'
                }`} />
            </div>
          </div>
        )}

        {/* FLOATING OPEN JOURNAL BUTTON TRIGGER (ALWAYS ACCESSIBLE & DISMISSABLE) */}
        {!showWelcomeModal && (

          <div className="absolute top-10 right-4 sm:right-6 z-30">
            <button
              onClick={() => {
                setIsJournalOpen(!isJournalOpen);
                setHasUnreadJournal(false);
              }}
              className={`relative px-4 py-2.5 rounded-full border-2 font-sans font-bold text-xs flex items-center gap-2 shadow-2xl backdrop-blur-xl transition-all cursor-pointer transform hover:scale-105 ${isNightMode
                ? 'bg-slate-900/90 border-slate-700 text-slate-100 hover:border-cyan-500'
                : 'bg-[#fbf9f5]/95 border-[#8b5e3c] text-[#2c3e2e] hover:bg-[#f5ede2]'
                }`}
            >
              <BookOpen className={`w-4 h-4 ${isNightMode ? 'text-cyan-400' : 'text-[#c25e00]'}`} />
              <span>{isJournalOpen ? 'Close Journal' : 'Open Journal'}</span>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isNightMode ? 'bg-slate-800 text-cyan-300' : 'bg-[#e8e2d5] text-[#5c4033]'
                }`}>
                {unlockedDossierIds.length}/8
              </span>

              {/* UNREAD NEW ITEM BADGE PULSE INDICATOR 🔴 */}
              {hasUnreadJournal && !isJournalOpen && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-white" />
                </span>
              )}
            </button>
          </div>
        )}

        {/* DISMISSABLE PARCHMENT JOURNAL DRAWER */}
        {isJournalOpen && (
          <div className={`absolute top-22 sm:top-24 right-4 sm:right-6 bottom-6 w-[calc(100vw-2rem)] sm:w-84 border-2 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl z-30 flex flex-col justify-between transition-all duration-300 animate-in fade-in slide-in-from-right-5 ${isNightMode
            ? 'bg-slate-900/95 border-slate-700/80 text-slate-100'
            : 'bg-[#fbf9f5]/95 border-[#8b5e3c]/40 text-[#2c3e2e]'
            }`}>

            {/* Drawer Header */}
            <div className={`border-b pb-3 flex items-center justify-between shrink-0 ${isNightMode ? 'border-slate-800' : 'border-[#8b5e3c]/30'
              }`}>
              <div className="flex items-center gap-2 text-sm font-bold italic">
                <BookOpen className={`w-4 h-4 ${isNightMode ? 'text-cyan-400' : 'text-[#c25e00]'}`} />
                <span>Woodland Journal</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNightMode(!isNightMode)}
                  className={`p-1.5 rounded-full border transition-all cursor-pointer ${isNightMode
                    ? 'bg-slate-800 border-slate-600 text-amber-300 shadow-md'
                    : 'bg-[#e8e2d5] border-[#8b5e3c]/40 text-[#5c4033] hover:bg-[#dcd4c3]'
                    }`}
                  title={isNightMode ? 'Switch to Peaceful Day Mode' : 'Switch to Spooky Night Mode'}
                >
                  {isNightMode ? <Moon className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-amber-600" />}
                </button>

                <button
                  onClick={() => setIsJournalOpen(false)}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${isNightMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-[#e8e2d5] hover:bg-[#dcd4c3] border-[#8b5e3c]/40 text-[#2c3e2e]'
                    }`}
                  title="Close Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Item List */}

            <div className="space-y-4 font-sans overflow-y-auto my-3 pr-1 grow">
              {/* SECTION 1: PROJECT DOSSIER LOGS */}
              <div className="space-y-2">
                <div className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 border-b pb-1 ${isNightMode ? 'text-cyan-400 border-slate-800' : 'text-[#c25e00] border-[#8b5e3c]/20'
                  }`}>
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Projects & Backstory</span>
                </div>
                <div className="space-y-2">
                  {infoCategories.filter(i => i.type === 'log').map((item) => {
                    const isUnlocked = unlockedDossierIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (isUnlocked) {
                            setActiveInfo({
                              id: item.id,
                              title: item.title,
                              category: item.category,
                              content: item.content,
                              linkUrl: item.linkUrl,
                            });
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all ${isUnlocked
                          ? isNightMode
                            ? 'bg-slate-800/90 border-slate-700 text-slate-100 cursor-pointer shadow-md hover:border-cyan-500/50'
                            : 'bg-gradient-to-r from-[#f5ede2] to-[#ebe1d3] border-[#8b5e3c]/60 text-[#2c3e2e] cursor-pointer hover:border-[#8b5e3c] shadow-md transform hover:-translate-y-0.5'
                          : isNightMode
                            ? 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed'
                            : 'bg-[#e8e2d5]/40 border-[#d0c5b4] text-[#8c7b6d] cursor-not-allowed opacity-75'
                          }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span className="flex items-center gap-2">
                            <span>{isUnlocked ? '🪵' : '🔒'}</span>
                            <span>{isUnlocked ? item.title : 'Unseen Memory'}</span>
                          </span>
                          {isUnlocked ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isNightMode ? 'text-cyan-400' : 'text-[#2c3e2e]'}`} />
                          ) : (
                            <span className="text-[10px] opacity-75">Sway tree!</span>
                          )}
                        </div>
                        {isUnlocked && (
                          <div className={`text-[10px] font-bold tracking-wide uppercase mt-1 ${isNightMode ? 'text-cyan-400' : 'text-[#c25e00]'
                            }`}>
                            {item.category}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: CONTACT DETAILS ACORNS */}
              <div className="space-y-2 pt-2">
                <div className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 border-b pb-1 ${isNightMode ? 'text-cyan-400 border-slate-800' : 'text-[#2c3e2e] border-[#8b5e3c]/20'
                  }`}>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Details & Links</span>
                </div>
                <div className="space-y-2">
                  {infoCategories.filter(i => i.type === 'acorn').map((item) => {
                    const isUnlocked = unlockedDossierIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (isUnlocked) {
                            setActiveInfo({
                              id: item.id,
                              title: item.title,
                              category: item.category,
                              content: item.content,
                              linkUrl: item.linkUrl,
                            });
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all ${isUnlocked
                          ? isNightMode
                            ? 'bg-slate-800/90 border-slate-700 text-slate-100 cursor-pointer shadow-md hover:border-cyan-500/50'
                            : 'bg-gradient-to-r from-[#f5ede2] to-[#ebe1d3] border-[#8b5e3c]/60 text-[#2c3e2e] cursor-pointer hover:border-[#8b5e3c] shadow-md transform hover:-translate-y-0.5'
                          : isNightMode
                            ? 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed'
                            : 'bg-[#e8e2d5]/40 border-[#d0c5b4] text-[#8c7b6d] cursor-not-allowed opacity-75'
                          }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span className="flex items-center gap-2">
                            <span>{isUnlocked ? '🌰' : '🔒'}</span>
                            <span>{isUnlocked ? item.title : 'Unseen Contact'}</span>
                          </span>
                          {isUnlocked ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isNightMode ? 'text-cyan-400' : 'text-[#2c3e2e]'}`} />
                          ) : (
                            <span className="text-[10px] opacity-75">Sway tree!</span>
                          )}
                        </div>
                        {isUnlocked && (
                          <div className={`text-[10px] font-bold tracking-wide uppercase mt-1 ${isNightMode ? 'text-cyan-400' : 'text-[#c25e00]'
                            }`}>
                            {item.category}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: GOLDEN RESUME SCROLL */}
              <div className="space-y-2 pt-2">
                <div className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 border-b pb-1 ${isNightMode ? 'text-amber-400 border-slate-800' : 'text-[#d97706] border-[#d97706]/30'
                  }`}>
                  <Scroll className="w-3.5 h-3.5" />
                  <span>Golden Resume Artifact</span>
                </div>
                <div>
                  {infoCategories.filter(i => i.type === 'scroll').map((item) => {
                    const isUnlocked = unlockedDossierIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (isUnlocked) {
                            setActiveInfo({
                              id: item.id,
                              title: item.title,
                              category: item.category,
                              content: item.content,
                              linkUrl: item.linkUrl,
                            });
                          }
                        }}
                        className={`p-3.5 rounded-2xl border transition-all ${isUnlocked
                          ? 'bg-gradient-to-r from-amber-100 to-yellow-200 border-amber-500 text-[#2c3e2e] cursor-pointer hover:border-amber-600 shadow-lg transform hover:-translate-y-0.5 ring-2 ring-amber-400/50'
                          : isNightMode
                            ? 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed'
                            : 'bg-[#e8e2d5]/40 border-[#d0c5b4] text-[#8c7b6d] cursor-not-allowed opacity-75'
                          }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span className="flex items-center gap-2">
                            <span>{isUnlocked ? '📜' : '🔒'}</span>
                            <span>{isUnlocked ? item.title : 'Golden Scroll (Keep Shaking!)'}</span>
                          </span>
                          {isUnlocked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                          ) : (
                            <span className="text-[10px] opacity-75">Final Drop!</span>
                          )}
                        </div>
                        {isUnlocked && (
                          <div className="text-[10px] text-amber-800 font-bold tracking-wide uppercase mt-1 flex items-center gap-1">
                            <Download className="w-3 h-3 text-amber-700" />
                            <span>PDF Resume Ready</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className={`border-t pt-3.5 space-y-2 shrink-0 font-sans ${isNightMode ? 'border-slate-800' : 'border-[#8b5e3c]/30'
              }`}>
              <button
                onClick={() => setShowFullDossier(false ? false : true)}
                disabled={unlockedDossierIds.length === 0}
                className={`w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${unlockedDossierIds.length > 0
                  ? isNightMode
                    ? 'bg-cyan-600 border-cyan-500 text-slate-950 hover:bg-cyan-500 shadow-md cursor-pointer'
                    : 'bg-[#c25e00] border-[#8b5e3c] text-white hover:bg-[#a34e00] shadow-md cursor-pointer'
                  : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                  }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Read Complete Journal ({unlockedDossierIds.length}/8)</span>
              </button>

              <button
                onClick={() => resetGameRef.current()}
                className={`w-full py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer ${isNightMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-[#e8e2d5] hover:bg-[#dcd4c3] border-[#8b5e3c]/40 text-[#2c3e2e]'
                  }`}
                title="Reset Tree & Clear Collected Items"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Game</span>
              </button>
            </div>
          </div>
        )}



        {/* PARCHMENT STORYBOOK CARD POPUP (SINGLE ITEM) */}
        {activeInfo && (
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 p-8 rounded-3xl max-w-lg w-full text-center space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl z-30 font-serif ${isNightMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-[#fbf9f5] border-[#8b5e3c] text-[#2c3e2e]'
            }`}>
            <div className={`inline-block px-3.5 py-1 rounded-full border text-xs font-sans font-bold tracking-wide uppercase ${isNightMode ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-[#e8e2d5] border-[#8b5e3c]/40 text-[#c25e00]'
              }`}>
              {activeInfo.id === 'resume-scroll' ? '📜 Golden Resume Scroll Discovered!' : activeInfo.linkUrl ? '🌰 Contact Acorn Discovered' : '🪵 Journal Entry Unlocked'}
            </div>

            <h2 className="text-3xl font-extrabold italic">{activeInfo.title}</h2>

            <div className="text-xs font-sans font-bold uppercase opacity-80">
              {activeInfo.category}
            </div>

            <p className="text-sm font-sans leading-relaxed pt-2 font-medium opacity-90">
              {activeInfo.content}
            </p>

            {activeInfo.linkUrl && (
              <div className="pt-2">
                <a
                  href={activeInfo.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-sans font-bold text-xs transition-all shadow-lg ${activeInfo.id === 'resume-scroll'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black ring-2 ring-amber-400'
                    : isNightMode
                      ? 'bg-cyan-600 text-slate-950 hover:bg-cyan-500 font-bold'
                      : 'bg-[#c25e00] text-white hover:bg-[#a34e00]'
                    }`}
                >
                  {activeInfo.id === 'resume-scroll' ? (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Resume PDF</span>
                    </>
                  ) : (
                    <>
                      <span>Open Connection Link</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </a>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setActiveInfo(null)}
                className={`px-6 py-2.5 rounded-full border font-sans text-xs font-bold transition-colors cursor-pointer ${isNightMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-[#e8e2d5] hover:bg-[#dcd4c3] border-[#8b5e3c]/40 text-[#2c3e2e]'
                  }`}
              >
                Close Journal Entry
              </button>
            </div>
          </div>
        )}

        {/* STRUCTURED FULL COMBINED JOURNAL MODAL FOR RECRUITERS */}
        {showFullDossier && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-40 flex items-center justify-center p-4 sm:p-8">
            <div className={`border-2 rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden font-serif ${isNightMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-[#fbf9f5] border-[#8b5e3c] text-[#2c3e2e]'
              }`}>
              {/* Modal Header */}
              <div className={`p-6 border-b flex items-center justify-between ${isNightMode ? 'bg-slate-950/80 border-slate-800' : 'bg-[#f5ede2] border-[#8b5e3c]/30'
                }`}>
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-6 h-6 ${isNightMode ? 'text-cyan-400' : 'text-[#c25e00]'}`} />
                  <div>
                    <h2 className="text-2xl font-extrabold italic">Alan's Complete Woodland Journal</h2>
                    <p className="text-xs font-sans opacity-80">
                      Compiled portfolio report ({unlockedItems.length} / 8 items collected)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowFullDossier(false)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${isNightMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-[#e8e2d5] hover:bg-[#dcd4c3] border-[#8b5e3c]/40 text-[#2c3e2e]'
                    }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dossier Content Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 font-sans">
                {/* SECTION 1: GOLDEN RESUME SCROLL */}
                {unlockedResumeScroll && (
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-100 via-amber-50 to-yellow-100 border-2 border-amber-500 shadow-md space-y-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-900">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-2xl">📜</span>
                        <h3 className="text-lg font-bold font-serif">{unlockedResumeScroll.title}</h3>
                      </div>
                      <p className="text-xs text-slate-700">
                        {unlockedResumeScroll.content}
                      </p>
                    </div>

                    <a
                      href={unlockedResumeScroll.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shrink-0 cursor-pointer transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resume PDF</span>
                    </a>
                  </div>
                )}

                {/* SECTION 2: CANDIDATE DIRECT CONTACT DETAILS */}
                <div className="space-y-4">
                  <div className={`border-b pb-2 flex items-center justify-between ${isNightMode ? 'border-slate-800' : 'border-[#8b5e3c]/30'
                    }`}>
                    <h3 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 font-mono ${isNightMode ? 'text-cyan-400' : 'text-[#c25e00]'
                      }`}>
                      <Mail className="w-4 h-4" />
                      <span>Direct Contact Details & Channels</span>
                    </h3>
                    <span className="text-[11px] font-bold font-mono opacity-80">
                      {unlockedContactAcorns.length} / 3 Unlocked
                    </span>
                  </div>

                  {unlockedContactAcorns.length === 0 ? (
                    <div className="p-4 rounded-xl bg-black/20 border border-current/20 text-xs opacity-75 italic text-center">
                      Shake the tree to loosen contact acorns for email, LinkedIn, and GitHub!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {unlockedContactAcorns.map((item) => (
                        <div key={item.id} className={`p-4 rounded-2xl border space-y-2 flex flex-col justify-between shadow-sm ${isNightMode ? 'bg-slate-950/80 border-slate-800' : 'bg-[#f5ede2] border-[#8b5e3c]/40'
                          }`}>
                          <div>
                            <div className="text-xl mb-1">🌰</div>
                            <h4 className="font-bold text-xs">{item.title}</h4>
                            <p className="text-[11px] opacity-80 mt-1">{item.content}</p>
                          </div>
                          {item.linkUrl && (
                            <a
                              href={item.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 text-xs font-bold hover:underline pt-2 ${isNightMode ? 'text-cyan-400' : 'text-[#c25e00]'
                                }`}
                            >
                              <span>Connect &rarr;</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECTION 3: ENGINEERING PROJECTS & BACKSTORY */}
                <div className="space-y-4">
                  <div className={`border-b pb-2 flex items-center justify-between ${isNightMode ? 'border-slate-800' : 'border-[#8b5e3c]/30'
                    }`}>
                    <h3 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 font-mono ${isNightMode ? 'text-cyan-400' : 'text-[#2c3e2e]'
                      }`}>
                      <Briefcase className="w-4 h-4" />
                      <span>Engineering Projects & Backstory</span>
                    </h3>
                    <span className="text-[11px] font-bold font-mono opacity-80">
                      {unlockedProjectLogs.length} / 4 Unlocked
                    </span>
                  </div>

                  {unlockedProjectLogs.length === 0 ? (
                    <div className="p-4 rounded-xl bg-black/20 border border-current/20 text-xs opacity-75 italic text-center">
                      Shake the tree to drop project dossier logs!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {unlockedProjectLogs.map((item) => (
                        <div key={item.id} className={`p-5 rounded-2xl border space-y-2 shadow-sm ${isNightMode ? 'bg-slate-950/80 border-slate-800' : 'bg-[#f5ede2]/80 border-[#8b5e3c]/40'
                          }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🪵</span>
                              <h4 className="text-base font-bold font-serif">{item.title}</h4>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase font-mono ${isNightMode ? 'bg-slate-900 text-cyan-400 border-cyan-800/60' : 'bg-[#c25e00]/10 text-[#c25e00] border-[#c25e00]/30'
                              }`}>
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed pt-1 font-normal opacity-90">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`p-4 border-t text-center ${isNightMode ? 'bg-slate-950/80 border-slate-800' : 'bg-[#f5ede2] border-[#8b5e3c]/30'
                }`}>
                <button
                  onClick={() => setShowFullDossier(false)}
                  className={`px-8 py-2.5 rounded-full font-sans font-bold text-xs transition-colors shadow-md cursor-pointer ${isNightMode ? 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700' : 'bg-[#2c3e2e] text-white hover:bg-[#1e2b20]'
                    }`}
                >
                  Close Complete Journal
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
