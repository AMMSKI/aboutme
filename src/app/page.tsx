'use client';

import React, { useState } from 'react';
import { personalInfo, flagshipProject, enterpriseCaseStudies } from '@/data/portfolio';
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
      className="fixed inset-0 h-screen w-screen bg-[#090f0a] text-[#cccccc] font-sans selection:bg-[#1a291c] selection:text-white overflow-hidden flex flex-col"
    >
      {/* Subtle Tasteful Falling Leaves Overlay & Cursor Leaf Spawner */}
      <FallingLeavesOverlay />

      {/* Ultra Subtle Sage Ambient Glow following the cursor */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(141, 163, 140, 0.02), transparent 70%)`,
        }}
      />

      {/* Desktop Fixed Header (Only on 13-inch Macbook displays and larger: 1280px+) */}
      <header className="hidden xl:flex fixed top-10 right-10 z-40 items-center gap-6 text-sm text-[#e4e4e7] font-sans">
        <nav className="flex items-center gap-4 text-sm">
          <a href="#projects" className="hover:text-[#8da38c] transition-colors">Projects & Work</a>
          <a href="#contact" className="hover:text-[#8da38c] transition-colors">Contact</a>
        </nav>

        <div className="h-3.5 w-[1px] bg-[#333333]" />

        {/* Contact & Social Channel Icons */}
        <div className="flex items-center gap-3 text-[#e4e4e7]">
          <button
            onClick={handleCopyEmail}
            title="Copy Email"
            className="hover:text-[#8da38c] transition-colors p-1 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4" />}
          </button>

          <a
            href={personalInfo.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            className="hover:text-[#8da38c] transition-colors p-1"
          >
            <GithubIcon className="w-4 h-4 fill-current" />
          </a>

          <a
            href={personalInfo.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            className="hover:text-[#8da38c] transition-colors p-1"
          >
            <LinkedinIcon className="w-4 h-4 fill-current" />
          </a>

          <a
            href="/resume.pdf"
            download="Alan_Mamulski_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title="Download Resume PDF"
            className="hover:text-[#8da38c] transition-colors p-1"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Internal Scrollable Content Container (Only the text content scrolls!) */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
        <main className="max-w-2xl mx-auto px-6 pt-8 xl:pt-20 pb-12 space-y-7 w-full">
          {/* Header for mobile, tablet, and smaller laptop windows (< 1280px / < 13" screen width) */}
          <div className="flex xl:hidden items-center justify-between gap-4 text-xs sm:text-sm text-[#e4e4e7] font-sans pb-3 border-b border-[#222222]">
            <nav className="flex items-center gap-4">
              <a href="#projects" className="hover:text-[#8da38c] transition-colors">Projects & Work</a>
              <a href="#contact" className="hover:text-[#8da38c] transition-colors">Contact</a>
            </nav>

            <div className="flex items-center gap-3 text-[#e4e4e7]">
              <button
                onClick={handleCopyEmail}
                title="Copy Email"
                className="hover:text-[#8da38c] transition-colors p-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
              </button>

              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="hover:text-[#8da38c] transition-colors p-1"
              >
                <GithubIcon className="w-3.5 h-3.5 fill-current" />
              </a>

              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="hover:text-[#8da38c] transition-colors p-1"
              >
                <LinkedinIcon className="w-3.5 h-3.5 fill-current" />
              </a>

              <a
                href="/resume.pdf"
                download="Alan_Mamulski_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                title="Download Resume PDF"
                className="hover:text-[#8da38c] transition-colors p-1"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>


          {/* Title / Name Header */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f4f5] leading-none">
              {personalInfo.name}
            </h1>
            <p className="text-sm text-[#d4d4d8] leading-relaxed">
              Software engineer and builder based in Utah.
            </p>
          </div>

          {/* Clean Editorial Experience & Tools Breakdown */}
          <div className="space-y-1.5 text-sm leading-relaxed text-[#d4d4d8]">
            <p>
              <span className="text-[#888888] min-w-[5.25rem] inline-block text-xs">Co-founded</span>
              <a
                href={flagshipProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f4f4f5] hover:text-[#8da38c] underline underline-offset-4 decoration-[#555555] transition-colors"
              >
                Homebaked ↗
              </a>
            </p>
            <p>
              <span className="text-[#888888] min-w-[5.25rem] inline-block text-xs">Worked at</span>
              <span className="text-[#d4d4d8]">Bill.com &nbsp;·&nbsp; Divvy &nbsp;·&nbsp; Anglepoint</span>
            </p>
            <p>
              <span className="text-[#888888] min-w-[5.25rem] inline-block text-xs">Main tools</span>
              <span className="text-[#d4d4d8]">TypeScript &nbsp;·&nbsp; React & Native &nbsp;·&nbsp; Elixir / Phoenix &nbsp;·&nbsp; Next.js</span>
            </p>
          </div>


          {/* About Section */}
          <div id="about" className="space-y-3 pt-6 border-t border-[#222222]">
            <div className="text-xs text-[#888888] uppercase tracking-wider font-medium">
              About
            </div>
            <div className="space-y-3 text-sm text-[#d4d4d8] leading-relaxed">
              <p>
                I love building software that feels great to use. Whether it's shipping full-stack web apps, native mobile apps, backend data pipelines, or small Unity games, I focus on building things that are simple, fast, and reliable.
              </p>
              <p>
                I live in Utah with my wife, two daughters, and our cat Bumi. When I'm not coding, I'm usually picking up a random new hobby, any given week it could be photography, sculpting, refurbishing old furniture, or skateboarding. Huge fan of games with great atmospheres like Outer Wilds or Dredge, AAA games like GTA V and pretty much everything in-between.
              </p>
            </div>
          </div>

          {/* Projects & Work Section */}
          <div id="projects" className="space-y-3 pt-6 border-t border-[#222222]">
            <div className="text-xs text-[#888888] uppercase tracking-wider font-medium">
              Projects & Work
            </div>

            <div className="space-y-3">
              {/* Homebaked Project Block */}
              <a
                href={flagshipProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group space-y-2 p-3.5 rounded-xl hover:bg-[#111111] transition-colors border border-transparent hover:border-[#222222] -mx-3.5"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <div className="font-medium text-[#f4f4f5] group-hover:text-[#8da38c] transition-colors flex items-center gap-1.5">
                    <span>{flagshipProject.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  </div>
                  <span className="text-xs text-[#888888]">· Web & React Native</span>
                </div>

                <p className="text-sm text-[#d4d4d8] leading-relaxed">
                  Co-founded a home bakery SaaS platform and marketplace connecting home bakeries with their neighbors. I got to flex my generalist muscles, building and architecting the web app, the React Native iOS app, backend API routes, CI/CD workflows, database design, Mapbox discovery, push notifications, Stripe integrations and much more.
                </p>
              </a>


              {/* Enterprise Work Entries */}
              <div className="space-y-3 pt-1">
                {enterpriseCaseStudies.map((study) => (
                  <div key={study.id} className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-[#f4f4f5]">
                        {study.title}
                      </span>
                      <span className="text-xs text-[#888888]">· {study.company}</span>
                    </div>
                    <p className="text-sm text-[#d4d4d8] leading-relaxed">
                      {study.id === 'feature-eng'
                        ? 'Building reliable full-stack features and API workflows for large-scale financial management platforms.'
                        : study.challenge}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>



          {/* Contact Section */}
          <div id="contact" className="space-y-3 pt-6 border-t border-[#222222]">
            <div className="text-xs text-[#888888] uppercase tracking-wider font-medium">
              Hit me up
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm">
              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="antfu-link text-[#e4e4e7]"
              >
                GitHub
              </a>
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="antfu-link text-[#e4e4e7]"
              >
                LinkedIn
              </a>
              <button
                onClick={handleCopyEmail}
                title="Copy Email"
                className="antfu-link cursor-pointer flex items-center gap-1.5 text-[#e4e4e7]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5 text-[#e4e4e7]" />}
                <span>Email</span>
              </button>

              <a
                href="/resume.pdf"
                download="Alan_Mamulski_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="antfu-link flex items-center gap-1 text-[#e4e4e7]"
              >
                <Download className="w-3.5 h-3.5 text-[#e4e4e7]" />
                <span>Resume.pdf</span>
              </a>
            </div>
          </div>

          {/* Minimalist Footer inside scroll container */}
          <footer className="w-full text-xs text-[#888888] flex items-center justify-between border-t border-[#222222] pt-6 pb-8">
            <span>© {new Date().getFullYear()} {personalInfo.name}</span>
            <span>Built in Utah</span>
          </footer>
        </main>
      </div>

    </div>
  );
}

