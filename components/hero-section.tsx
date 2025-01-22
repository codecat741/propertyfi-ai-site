"use client";

import { Button } from "@/components/ui/button";
import { Building2, LineChart, Scan } from "lucide-react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      ax: number;
      ay: number;
      color: string;
      baseRadius: number;
      radius: number;
      targetRadius: number;
    }> = [];

    const colors = ["#00FFD1", "#00A3FF", "#FFD100", "#FF00E5"];
    const particleCount = 30;
    const initialSpeed = 1.5;
    const baseParticleRadius = 3;
    const hoverRadius = 100;
    const maxParticleRadius = 8;
    const connectionDistance = 150;
    const baseAlpha = 0.3;
    const hoverAlpha = 0.6;
    const repulsionForce = 0.5;
    const friction = 0.99;
    const maxVelocity = 3;
    const minVelocity = 0.8;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = initialSpeed + Math.random();
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ax: 0,
        ay: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseRadius: baseParticleRadius,
        radius: baseParticleRadius,
        targetRadius: baseParticleRadius,
      });
    }

    // Helper function to limit velocity
    const limitVelocity = (vx: number, vy: number) => {
      const speed = Math.sqrt(vx * vx + vy * vy);
      
      if (speed < minVelocity) {
        const ratio = minVelocity / speed;
        return { vx: vx * ratio, vy: vy * ratio };
      }
      
      if (speed > maxVelocity) {
        const ratio = maxVelocity / speed;
        return { vx: vx * ratio, vy: vy * ratio };
      }
      
      return { vx, vy };
    };

    let lastTime = 0;
    const targetFrameRate = 60;
    const frameInterval = 1000 / targetFrameRate;

    // Animation loop
    const animate = (currentTime: number) => {
      if (currentTime - lastTime < frameInterval) {
        requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Reset acceleration
        particle.ax = 0;
        particle.ay = 0;

        // Apply mouse repulsion force
        if (isHovering) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < hoverRadius) {
            const force = (1 - distance / hoverRadius) * repulsionForce;
            particle.ax -= (dx / distance) * force;
            particle.ay -= (dy / distance) * force;
            particle.targetRadius = maxParticleRadius * (1 - distance / hoverRadius) + baseParticleRadius;
          } else {
            particle.targetRadius = particle.baseRadius;
          }
        } else {
          particle.targetRadius = particle.baseRadius;
        }

        // Update velocity with acceleration
        particle.vx += particle.ax;
        particle.vy += particle.ay;

        // Apply friction
        particle.vx *= friction;
        particle.vy *= friction;

        // Limit velocity
        const limitedVelocity = limitVelocity(particle.vx, particle.vy);
        particle.vx = limitedVelocity.vx;
        particle.vy = limitedVelocity.vy;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0) {
          particle.x = 0;
          particle.vx *= -0.95;
        }
        if (particle.x > canvas.offsetWidth) {
          particle.x = canvas.offsetWidth;
          particle.vx *= -0.95;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy *= -0.95;
        }
        if (particle.y > canvas.offsetHeight) {
          particle.y = canvas.offsetHeight;
          particle.vy *= -0.95;
        }

        // Animate radius
        particle.radius += (particle.targetRadius - particle.radius) * 0.1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const alpha = isHovering ? hoverAlpha : baseAlpha;
            const lineAlpha = alpha * (1 - distance / connectionDistance);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 255, 209, ${lineAlpha})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background with Real Property Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80"
          alt="Street view of a beautiful residential home"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#151849]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#151849]/90 via-[#151849]/80 to-[#151849]/90" />
        
        {/* Keep existing canvas and animations */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-40 cursor-pointer"
          style={{ filter: "blur(1px)" }}
        />
      </div>

      {/* Content section */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trusted By Section */}
          <div className="flex items-center justify-center space-x-8 mb-12">
            <div className="text-white/80 text-sm font-medium">TRUSTED BY</div>
            <div className="flex items-center space-x-8">
              <div className="text-white/90 font-semibold">NASA</div>
              <div className="text-white/90 font-semibold">APPLE</div>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-[1.1]">
            AI-Powered Lead Generation for Property Services
          </h1>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Our AI analyzes high-resolution aerial and ground-level imagery to identify property improvement opportunities with 86% accuracy—delivering qualified leads directly to service providers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contact">
              <Button 
                size="lg"
                className="bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-[#151849] font-semibold text-base px-8"
              >
                Get Started
              </Button>
            </Link>
          </div>
          
          {/* Imagery Types */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80"
                  alt="Ground-level property view"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-white font-semibold mb-2">Ground-Level Imagery</h3>
              <p className="text-white/70 text-sm">High-detail property analysis from street view</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1599619351208-3e6c839d6828?auto=format&fit=crop&q=80"
                  alt="Aerial property view"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-white font-semibold mb-2">Aerial Imagery</h3>
              <p className="text-white/70 text-sm">Comprehensive property assessment from above</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFD1] mb-2">86%</div>
              <div className="text-sm text-white/80">Lead Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFD1] mb-2">2.4M</div>
              <div className="text-sm text-white/80">Properties Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFD1] mb-2">48hr</div>
              <div className="text-sm text-white/80">Lead Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}