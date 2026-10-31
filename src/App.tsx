/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { PipelineSimulator } from './components/PipelineSimulator';
import { DockerVisualizer } from './components/DockerVisualizer';
import { FileExplorer } from './components/FileExplorer';
import { ApiSandbox } from './components/ApiSandbox';
import { LabGuide } from './components/LabGuide';
import { downloadRepoZip } from './utils/zipExport';
import { Play, Layers, FileCode, Terminal, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simulator');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadRepoZip();
    } catch (err) {
      console.error('Error generating repository zip archive:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white">
      {/* Top Bar adhering to the Top Bar Contract (§2) */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
        isDownloading={isDownloading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="p-8 bg-linear-to-b from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              {/* Clean unboxed metadata with typographic separators */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Course: Software Engineering &amp; DevOps</span>
                <span aria-hidden="true">·</span>
                <span>Module: Reproducible Environments &amp; CI</span>
                <span aria-hidden="true">·</span>
                <span>Node 20 &amp; Docker</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white text-balance">
                Reproducible Environments &amp; Continuous Integration
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                A university-grade instructional workbench and codebase repository. Learn multi-stage Docker builds, fail-fast configuration validation, and GitHub Actions continuous integration quality gates through real interactive simulations.
              </p>

              {/* Quick Tech Spec Line */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                <span>Express + TypeScript</span>
                <span aria-hidden="true">/</span>
                <span>Docker Multi-Stage (Alpine)</span>
                <span aria-hidden="true">/</span>
                <span>GitHub Actions (Lint, Test, Build)</span>
                <span aria-hidden="true">/</span>
                <span>Jest Test Suite</span>
              </div>
            </div>

            {/* Quick Tab Jumpers */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                  activeTab === 'simulator'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>CI/CD Pipeline Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab('docker')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                  activeTab === 'docker'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Multi-Stage Docker Visualizer</span>
              </button>

              <button
                onClick={() => setActiveTab('files')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                  activeTab === 'files'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Browse Repository Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive View */}
        <div className="transition-opacity duration-200">
          {activeTab === 'simulator' && <PipelineSimulator />}
          {activeTab === 'docker' && <DockerVisualizer />}
          {activeTab === 'files' && <FileExplorer />}
          {activeTab === 'sandbox' && <ApiSandbox />}
          {activeTab === 'guide' && <LabGuide />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Software Engineering &amp; DevOps Course Curriculum · Open Educational Resource (OER)</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('guide')} className="hover:text-white transition-colors cursor-pointer">
              Lab Manual
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => setActiveTab('files')} className="hover:text-white transition-colors cursor-pointer">
              Source Tree
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={handleDownloadZip} className="hover:text-white transition-colors cursor-pointer">
              Export Zip
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
