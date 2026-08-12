'use client';

import React, { useState } from 'react';
import { personalInfo, flagshipProject, enterpriseCaseStudies } from '@/data/portfolio';
import { personalStory } from '@/data/personalStory';
import { Download, Check, Mail, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons';
import { FallingLeavesOverlay } from '@/components/FallingLeavesOverlay';

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-black text-[#cccccc] font-sans selection:bg-[#333333] selection:text-white overflow-hidden flex flex-col justify-between"
    >
      {/* Subtle Tasteful Falling Leaves Overlay & Cursor Leaf Spawner */}
      <FallingLeavesOverlay />

      {/* Refined Compact Sage Ambient Glow following the cursor */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(141, 163, 140, 0.045), transparent 75%)`,
        }}
      />

      {/* Top Navigation Header: Inline with content on mobile, Top-Right Corner on Desktop */}
      <header className="relative sm:absolute z-40 max-w-2xl sm:max-w-none w-full sm:w-auto mx-auto sm:mx-0 sm:top-10 sm:right-10 px-6 sm:px-0 pt-8 sm:pt-0">
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 text-sm text-[#777777] font-sans">
          <nav className="flex items-center gap-4 text-xs sm:text-sm">
            <a href="#projects" className="hover:text-white transition-colors">Projects & Work</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="h-3.5 w-[1px] bg-[#222222] hidden sm:block" />

          {/* Contact & Social Channel Icons */}
          <div className="flex items-center gap-3 text-[#777777]">
            <button
              onClick={handleCopyEmail}
              title="Copy Email"
              className="hover:text-white transition-colors p-1 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4" />}
            </button>




            <a
              href={personalInfo.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              className="hover:text-white transition-colors p-1"
            >
              <GithubIcon className="w-4 h-4 fill-current" />
            </a>

            <a
              href={personalInfo.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className="hover:text-white transition-colors p-1"
            >
              <LinkedinIcon className="w-4 h-4 fill-current" />
            </a>

            <a
              href="/resume.pdf"
              download="Alan_Mamulski_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              title="Download Resume PDF"
              className="hover:text-white transition-colors p-1"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-6 sm:pt-28 pb-16 space-y-10 w-full">



        {/* Title / Name Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {personalInfo.name}
          </h1>
          <p className="text-base text-[#aaaaaa] leading-relaxed">
            Full-stack engineer and builder based in Utah. I build web apps, mobile apps, and backend data pipelines.
          </p>
        </div>

        {/* Tech Badges Row */}
        <div className="space-y-2 pt-2 text-sm leading-relaxed">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#777777]">Co-founded</span>
            <a href={flagshipProject.url} target="_blank" rel="noopener noreferrer" className="antfu-badge">
              <span>🍞 Homebaked</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#777777]">Worked at</span>
            <span className="antfu-badge">⚡ Bill.com</span>
            <span className="antfu-badge">💳 Divvy</span>
            <span className="antfu-badge">📊 Anglepoint</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#777777]">Main tools</span>
            <span className="antfu-badge">TypeScript</span>
            <span className="antfu-badge">React & Native</span>
            <span className="antfu-badge">Elixir / Phoenix</span>
            <span className="antfu-badge">Next.js & Supabase</span>
          </div>
        </div>

        {/* Personal Story & Background */}
        <div className="space-y-5 text-sm text-[#aaaaaa] leading-relaxed pt-4 border-t border-[#1a1a1a]">
          <p>{personalStory.backstory}</p>
          <p>{personalStory.foundingMotivation}</p>
          <p id="about">
            {personalStory.lifeStory} {personalStory.popCultureFavorites}
          </p>
        </div>

        {/* Projects & Work List */}
        <div id="projects" className="space-y-6 pt-6 border-t border-[#1a1a1a]">
          <div className="text-xs font-mono text-[#666666] uppercase tracking-wider">
            Projects & Work
          </div>

          <div className="space-y-3">
            {/* Homebaked Project Block */}
            <a
              href={flagshipProject.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group space-y-2 p-4 rounded-xl hover:bg-[#111111] transition-colors border border-transparent hover:border-[#222222]"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white group-hover:text-[#8da38c] transition-colors flex items-center gap-1.5 text-sm">
                  <span>{flagshipProject.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <span className="text-xs font-mono text-[#666666]">Web & Native iOS</span>
              </div>
              <p className="text-xs text-[#888888] leading-relaxed">
                {flagshipProject.overview}
              </p>
            </a>

            {/* Enterprise Work Entries */}
            <div className="pt-2 space-y-3">
              {enterpriseCaseStudies.map((study) => (
                <div key={study.id} className="space-y-1 px-4 py-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">
                      {study.title}
                    </span>
                    <span className="text-xs font-mono text-[#666666]">{study.company}</span>
                  </div>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    {study.challenge}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Find Me On / Social Links Section */}
        <div id="contact" className="space-y-4 pt-6 border-t border-[#1a1a1a]">
          <div className="text-xs font-mono text-[#666666] uppercase tracking-wider">
            Find me on
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={personalInfo.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="antfu-link"
            >
              GitHub
            </a>
            <a
              href={personalInfo.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="antfu-link"
            >
              LinkedIn
            </a>
            <button
              onClick={handleCopyEmail}
              title="Copy Email"
              className="antfu-link cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5 text-[#777777]" />}
              <span>Email</span>
            </button>




            <a
              href="/resume.pdf"
              download="Alan_Mamulski_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="antfu-link flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-[#777777]" />
              <span>Resume.pdf</span>
            </a>
          </div>
        </div>
      </main>

      {/* Minimalist Footer */}
      <footer className="max-w-2xl mx-auto px-6 pb-12 w-full text-xs font-mono text-[#555555] flex items-center justify-between border-t border-[#111111] pt-6">
        <span>© {new Date().getFullYear()} {personalInfo.name}</span>
        <span>CC BY-NC-SA 4.0</span>
      </footer>
    </div>
  );
}
