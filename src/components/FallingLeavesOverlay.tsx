'use client';

import React, { useEffect, useRef } from 'react';

interface Leaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  maxOpacity: number;
  swingFrequency: number;
  swingAmplitude: number;
  timeOffset: number;
}

export function FallingLeavesOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Active leaf particles array
    const leaves: Leaf[] = [];
    const maxLeaves = 65; // Consistent flowing trail of delicate leaves
    let lastSpawnTime = 0;
    let lastMouseSpawnTime = 0;

    const createLeaf = (startX?: number, startY?: number): Leaf => {
      return {
        x: startX !== undefined ? startX + (Math.random() - 0.5) * 20 : Math.random() * width,
        y: startY !== undefined ? startY + (Math.random() - 0.5) * 14 : -20,
        size: 6 + Math.random() * 6, // Delicate small size (6px - 12px)
        speedY: 0.45 + Math.random() * 0.55, // Smooth downward drift
        speedX: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        opacity: startY !== undefined ? 0.22 + Math.random() * 0.2 : 0, // Instant soft visibility for cursor leaves
        maxOpacity: 0.18 + Math.random() * 0.22, // Soft subtle opacity
        swingFrequency: 0.0015 + Math.random() * 0.002,
        swingAmplitude: 0.8 + Math.random() * 1.2,
        timeOffset: Math.random() * 1000,
      };
    };

    // Consistent, steady leaf release while cursor is moving (tight 75ms - 90ms interval)
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const nextInterval = 75 + Math.random() * 20; // Tightened 75ms - 95ms variation (never long gaps!)
      if (now - lastMouseSpawnTime > nextInterval && leaves.length < maxLeaves) {
        leaves.push(createLeaf(e.clientX, e.clientY));
        lastMouseSpawnTime = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);



    // Pre-populate 3 soft leaves mid-fall on initial load
    for (let i = 0; i < 3; i++) {
      const leaf = createLeaf();
      leaf.y = Math.random() * height;
      leaf.opacity = leaf.maxOpacity;
      leaves.push(leaf);
    }

    // Draw an organic delicate leaf shape
    const drawLeaf = (ctx: CanvasRenderingContext2D, leaf: Leaf) => {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rotation);
      ctx.globalAlpha = leaf.opacity;

      // Sage Woodland Leaf Color Gradient
      const grad = ctx.createLinearGradient(-leaf.size / 2, 0, leaf.size / 2, 0);
      grad.addColorStop(0, 'rgba(141, 163, 140, 0.85)');
      grad.addColorStop(1, 'rgba(100, 125, 100, 0.65)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -leaf.size);
      ctx.bezierCurveTo(leaf.size / 2, -leaf.size / 2, leaf.size / 2, leaf.size / 2, 0, leaf.size);
      ctx.bezierCurveTo(-leaf.size / 2, leaf.size / 2, -leaf.size / 2, -leaf.size / 2, 0, -leaf.size);
      ctx.fill();

      // Subtle center vein line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -leaf.size * 0.75);
      ctx.lineTo(0, leaf.size * 0.75);
      ctx.stroke();

      ctx.restore();
    };

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Ambient background spawn every 4-6 seconds if under count
      if (leaves.length < maxLeaves && now - lastSpawnTime > 4000 + Math.random() * 2000) {
        leaves.push(createLeaf());
        lastSpawnTime = now;
      }

      for (let i = leaves.length - 1; i >= 0; i--) {
        const leaf = leaves[i];

        // Organic swaying physics
        leaf.y += leaf.speedY;
        leaf.x += Math.sin((now + leaf.timeOffset) * leaf.swingFrequency) * leaf.swingAmplitude + leaf.speedX;
        leaf.rotation += leaf.rotationSpeed;

        // Fade in & out
        if (leaf.opacity < leaf.maxOpacity && leaf.y < height - 150) {
          leaf.opacity = Math.min(leaf.maxOpacity, leaf.opacity + 0.008);
        } else if (leaf.y > height - 140) {
          leaf.opacity = Math.max(0, leaf.opacity - 0.005);
        }

        drawLeaf(ctx, leaf);

        // Remove leaves once off screen or fully faded
        if (leaf.y > height + 30 || (leaf.y > height - 100 && leaf.opacity <= 0)) {
          leaves.splice(i, 1);
        }
      }
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
}
