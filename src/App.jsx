import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Sparkles, 
  PenTool, 
  Eraser, 
  Volume2, 
  VolumeX, 
  Terminal, 
  FolderGit2, 
  Star, 
  GitFork, 
  Layers, 
  Compass, 
  CheckCircle2, 
  Send,
  Coffee,
  RotateCcw,
  Zap,
  ShieldCheck,
  Plane,
  Coins
} from 'lucide-react';

export default function App() {
  // Theme options
  const [paperTheme, setPaperTheme] = useState('notebook'); // 'notebook', 'blueprint', 'parchment', 'chalkboard'
  const [antiGravity, setAntiGravity] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [doodlePadOpen, setDoodlePadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Terminal state
  const [termInput, setTermInput] = useState('');
  const [termHistory, setTermHistory] = useState([
    { type: 'system', text: "Shivam Singh [cv-am] Sketchbook Terminal v2.6.4 initialized." },
    { type: 'system', text: "Type 'help' to inspect available hand-drawn system commands." }
  ]);

  // Canvas Doodle State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#292524');
  const [brushSize, setBrushSize] = useState(3);

  // Web Audio Synthesizer for pencil sounds and stamps
  const playSound = (type = 'scribble') => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'scribble') {
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1600;
        filter.Q.value = 2.5;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === 'stamp') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.28, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      console.log('Audio disabled', e);
    }
  };

  // Canvas Drawing Handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    playSound('scribble');
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playSound('stamp');
  };

  // Terminal Command Execution
  const handleCommand = (e) => {
    if (e.key === 'Enter' && termInput.trim()) {
      const cmd = termInput.trim().toLowerCase();
      const newHistory = [...termHistory, { type: 'user', text: `$ ${termInput}` }];
      playSound('scribble');

      switch (cmd) {
        case 'help':
          newHistory.push({
            type: 'result',
            text: "Commands: 'skills', 'projects', 'antigravity', 'whoami', 'clear', 'contact'"
          });
          break;
        case 'skills':
          newHistory.push({
            type: 'result',
            text: "Core Stack: React.js, Tailwind CSS, JavaScript (ESNext), Node.js, Express, MySQL, REST APIs, Git."
          });
          break;
        case 'projects':
          newHistory.push({
            type: 'result',
            text: "Spotlight Repos: 1. cv-am/book-flight  2. cv-am/authentication-project  3. ragini-saxena/Investor_fund_collection"
          });
          break;
        case 'antigravity':
          setAntiGravity(prev => !prev);
          newHistory.push({
            type: 'result',
            text: `Zero-G Physics matrix is now: ${!antiGravity ? 'ACTIVATED 🚀' : 'DEACTIVATED ⚓'}`
          });
          playSound('stamp');
          break;
        case 'whoami':
          newHistory.push({
            type: 'result',
            text: "Shivam Singh | Full-Stack Web Craftsman | github.com/cv-am"
          });
          break;
        case 'clear':
          setTermHistory([]);
          setTermInput('');
          return;
        case 'contact':
          newHistory.push({
            type: 'result',
            text: "Email: shivamsinghchandel.work@gmail.com | LinkedIn: linkedin.com/in/cvam2006"
          });
          break;
        default:
          newHistory.push({
            type: 'error',
            text: `Command not found: '${cmd}'. Type 'help' for sketchbook manual.`
          });
      }
      setTermHistory(newHistory);
      setTermInput('');
    }
  };

  // Real Projects Data
  const projects = [
    {
      id: 'flight',
      title: 'Book-Flight Portal',
      repo: 'cv-am/book-flight',
      url: 'https://github.com/cv-am/book-flight',
      demoUrl: 'https://github.com/cv-am/book-flight',
      icon: <Plane className="w-5 h-5 text-sky-600" />,
      stamp: 'APPROVED FLIGHT',
      stampColor: 'text-sky-700 border-sky-700',
      tag: 'Full-Stack Architecture',
      notes: 'Real-time seat reservations, boarding pass generation, search filters & itinerary booking.',
      tech: ['React', 'JavaScript', 'Node.js', 'Express', 'CSS3 Modules'],
      metrics: 'Seat matrix algorithm & zero-overlap ticket booking flow',
      rotation: 'rotate-[-1.5deg]'
    },
    {
      id: 'auth',
      title: 'Auth & Security Fortress',
      repo: 'cv-am/authentication-project',
      url: 'https://github.com/cv-am/authentication-project',
      demoUrl: 'https://github.com/cv-am/authentication-project',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      stamp: 'AUDITED SECURE',
      stampColor: 'text-emerald-700 border-emerald-700',
      tag: 'Cyber & Identity',
      notes: 'Robust authentication flow featuring JWT token rotation, salted bcrypt hashing, and secure sessions.',
      tech: ['Node.js', 'Express', 'JWT', 'Bcrypt', 'Cookies', 'MySQL'],
      metrics: 'Zero-vulnerability session handling & automated route protection',
      rotation: 'rotate-[2deg]'
    },
    {
      id: 'investor',
      title: 'Investor Fund Collection',
      repo: 'ragini-saxena/Investor_fund_collection',
      url: 'https://github.com/ragini-saxena/Investor_fund_collection',
      demoUrl: 'https://github.com/ragini-saxena/Investor_fund_collection',
      icon: <Coins className="w-5 h-5 text-amber-600" />,
      stamp: 'LEDGER SYNC',
      stampColor: 'text-amber-800 border-amber-800',
      tag: 'FinTech & Collaboration',
      notes: 'Collaborative venture funding ledger tracking rounds, commitments, KYC verification and cap-tables.',
      tech: ['JavaScript', 'HTML5', 'CSS3', 'Data Visualization', 'REST APIs'],
      metrics: 'Real-time multi-investor fund aggregations & responsive tables',
      rotation: 'rotate-[-2deg]'
    }
  ];

  // Theme configuration
  const themeStyles = {
    notebook: {
      bg: 'bg-[#FAF7F0]',
      grid: 'paper-grid',
      text: 'text-stone-800',
      accent: 'border-stone-800',
      cardBg: 'bg-[#FFFDF9]',
      terminalBg: 'bg-stone-900 text-amber-400'
    },
    blueprint: {
      bg: 'bg-[#1e3a8a]',
      grid: 'bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px]',
      text: 'text-sky-50',
      accent: 'border-sky-300',
      cardBg: 'bg-[#172554] text-sky-100',
      terminalBg: 'bg-[#0f172a] text-cyan-300'
    },
    parchment: {
      bg: 'bg-[#F4EBD0]',
      grid: 'bg-[radial-gradient(#b45309_0.8px,transparent_0.8px)] [background-size:24px_24px]',
      text: 'text-amber-950',
      accent: 'border-amber-900',
      cardBg: 'bg-[#fef9c3]',
      terminalBg: 'bg-amber-950 text-amber-200'
    },
    chalkboard: {
      bg: 'bg-[#1c1917]',
      grid: 'bg-[linear-gradient(to_right,#44403c_1px,transparent_1px),linear-gradient(to_bottom,#44403c_1px,transparent_1px)] [background-size:28px_28px]',
      text: 'text-stone-100',
      accent: 'border-stone-300',
      cardBg: 'bg-[#292524] text-stone-100',
      terminalBg: 'bg-black text-emerald-400'
    }
  };

  const curTheme = themeStyles[paperTheme];

  return (
    <div className={`min-h-screen ${curTheme.bg} ${curTheme.grid} ${curTheme.text} transition-colors duration-500 font-sans selection:bg-amber-300 selection:text-stone-900 overflow-x-hidden relative`}>
      
      {/* Hand-Drawn Margin Rule (Notebook Margin Line) */}
      {paperTheme === 'notebook' && (
        <div className="fixed top-0 bottom-0 left-8 md:left-24 w-[2px] bg-red-300/40 pointer-events-none z-10" />
      )}

      {/* Coffee Stain Doodle Accent */}
      {paperTheme === 'notebook' && (
        <div 
          className="fixed bottom-10 right-8 w-44 h-44 rounded-full border-[6px] border-amber-900/10 pointer-events-none -z-0 opacity-40 rotate-12 blur-[0.5px]"
          style={{
            boxShadow: 'inset 0 0 15px rgba(180, 83, 9, 0.1), 0 0 20px rgba(180, 83, 9, 0.08)'
          }}
        />
      )}

      {/* Top Sketchbook Toolbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b-2 border-stone-800 px-4 md:px-12 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sketch-border flex items-center justify-center font-sketch text-xl bg-amber-200 text-stone-900 shadow-sm font-bold rotate-[-3deg]">
              S
            </div>
            <div>
              <span className="font-sketch font-bold text-2xl tracking-tight text-stone-900">
                Shivam Singh
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono uppercase bg-amber-100 px-2 py-0.5 border border-stone-800 rounded">
                cv-am
              </span>
            </div>
          </div>

          {/* Controls: Audio, Anti-Gravity, Doodle, Theme */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Anti-Gravity Switch */}
            <button
              onClick={() => {
                setAntiGravity(!antiGravity);
                playSound('stamp');
              }}
              className={`px-3 py-1.5 sketch-border text-sm font-sketch font-bold flex items-center gap-1.5 transition-all ${
                antiGravity 
                  ? 'bg-purple-600 text-white shadow-none translate-y-1' 
                  : 'bg-white hover:bg-purple-100 text-stone-900 sketch-shadow'
              }`}
              title="Toggle Zero-Gravity Physics"
            >
              <Zap className={`w-4 h-4 ${antiGravity ? 'animate-bounce text-yellow-300' : 'text-purple-600'}`} />
              <span className="hidden sm:inline">Anti-Gravity</span>
              {antiGravity && <span className="text-[10px] bg-purple-900 text-purple-200 px-1 rounded">ON</span>}
            </button>

            {/* Doodle Canvas Drawer Toggle */}
            <button
              onClick={() => {
                setDoodlePadOpen(!doodlePadOpen);
                playSound('scribble');
              }}
              className={`p-2 sketch-border transition-all ${
                doodlePadOpen ? 'bg-amber-300 translate-y-1' : 'bg-white hover:bg-amber-100 sketch-shadow text-stone-900'
              }`}
              title="Draw / Scratchpad"
            >
              <PenTool className="w-4 h-4" />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 sketch-border bg-white hover:bg-stone-100 sketch-shadow text-stone-800"
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            {/* Theme Selector */}
            <select
              value={paperTheme}
              onChange={(e) => {
                setPaperTheme(e.target.value);
                playSound('scribble');
              }}
              aria-label="Select paper background style"
              className="px-2 py-1.5 text-xs font-mono sketch-border bg-white text-stone-900 cursor-pointer focus:outline-none"
            >
              <option value="notebook">📓 Notebook Grid</option>
              <option value="blueprint">📐 Blueprint Blue</option>
              <option value="parchment">📜 Parchment</option>
              <option value="chalkboard">⬛ Chalkboard</option>
            </select>
          </div>
        </div>
      </header>

      {/* Floating Interactive Doodle Overlay Drawer */}
      {doodlePadOpen && (
        <div className="fixed inset-x-4 top-20 z-50 max-w-2xl mx-auto bg-[#FFFDF7] sketch-border-thick sketch-shadow-lg p-4 animate-in fade-in zoom-in-95 text-stone-900">
          <div className="flex items-center justify-between pb-3 border-b-2 border-stone-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-sketch font-bold text-lg">✏️ Sketch & Signature Pad</span>
              <span className="text-xs font-mono text-stone-500">(Sign or doodle on my page!)</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearCanvas}
                className="px-2 py-1 text-xs font-mono bg-red-100 hover:bg-red-200 border border-red-800 rounded flex items-center gap-1"
              >
                <Eraser className="w-3.5 h-3.5 text-red-700" /> Clear
              </button>
              <button 
                onClick={() => setDoodlePadOpen(false)}
                className="px-2 py-1 text-xs font-bold border border-stone-800 rounded hover:bg-stone-200"
              >
                ✕ Close
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={260}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-56 bg-white border-2 border-dashed border-stone-400 rounded cursor-crosshair touch-none"
          />

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono">Pencil Lead:</span>
              {['#292524', '#dc2626', '#2563eb', '#16a34a', '#d97706'].map(color => (
                <button
                  key={color}
                  onClick={() => setDrawColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${drawColor === color ? 'border-stone-900 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono">Thickness:</span>
              {[2, 4, 8].map(size => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`px-2 py-0.5 text-xs border rounded ${brushSize === size ? 'bg-stone-800 text-white' : 'bg-stone-100'}`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 py-12 relative z-10">

        {/* HERO SECTION: Hand-Drawn Notebook Cover */}
        <section className={`mb-20 transition-transform duration-700 ${antiGravity ? 'animate-float' : ''}`}>
          
          {/* Taped Sticky Note Badge */}
          <div className="inline-block relative mb-6">
            <div className="washi-tape absolute -top-3 left-6 w-28 h-5 z-20" />
            <div className="bg-amber-100 text-amber-950 font-notes text-lg px-5 py-2 sketch-border sketch-shadow rotate-[-2deg]">
              📌 Shivam’s Interactive Lab & Portfolio • Est. 2024–2026
            </div>
          </div>

          <div className="relative">
            <h1 className="font-sketch text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-stone-900 mb-4">
              Building for the web,{' '}
              <span className="relative inline-block text-amber-600">
                one sketch at a time.
                {/* Hand-Drawn SVG Scribble Underline */}
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-amber-500 fill-none stroke-current" viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path d="M5 12 Q 75 18 150 11 T 295 14" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="font-hand text-2xl md:text-3xl text-stone-700 max-w-2xl leading-relaxed mt-6 mb-8">
              "Hi, I’m <strong className="text-stone-900 font-bold underline decoration-wavy decoration-amber-500">Shivam Singh</strong>. 
              I design and engineer clean, robust full-stack web applications — turning raw ideas into tactile, responsive digital reality."
            </p>

            {/* Quick CTAs styled like stamped index cards */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                onClick={() => playSound('scribble')}
                className="px-6 py-3 sketch-border-thick bg-amber-400 hover:bg-amber-300 text-stone-950 font-sketch font-bold text-lg sketch-shadow flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
              >
                <FolderGit2 className="w-5 h-5" /> Inspect My Repositories
              </a>

              <a
                href="https://github.com/cv-am"
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound('stamp')}
                className="px-5 py-3 sketch-border bg-white hover:bg-stone-50 text-stone-900 font-sketch font-bold text-lg sketch-shadow flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
              >
                <Github className="w-5 h-5" /> @cv-am on GitHub
              </a>

              <a
                href="https://linkedin.com/in/cvam2006"
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound('stamp')}
                className="px-5 py-3 sketch-border bg-white hover:bg-stone-50 text-sky-800 font-sketch font-bold text-lg sketch-shadow flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
              >
                <Linkedin className="w-5 h-5" /> LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* BENTO SKETCH CARDS: Tech Stack, Stats, & Blueprint */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-sm px-2 py-1 bg-stone-200 text-stone-800 sketch-border rounded">01 / ARCHITECTURE</span>
            <h2 className="font-sketch text-3xl font-bold">The Workbench & Diagnostics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Core Arsenal Sticky Note */}
            <div className={`p-6 ${curTheme.cardBg} sketch-border-thick sketch-shadow relative transition-transform duration-500 ${antiGravity ? 'animate-float [animation-delay:400ms]' : ''}`}>
              <div className="washi-tape-pink absolute -top-3 left-10 w-24 h-5" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sketch font-bold text-xl flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-amber-600" /> Core Tech Stack
                </h3>
                <span className="rubber-stamp text-xs text-amber-700">VERIFIED</span>
              </div>
              <p className="font-hand text-lg text-stone-700 mb-4">
                Technologies I wield daily to craft reliable production software:
              </p>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'Node.js', 'Express', 'MySQL', 'Git & GitHub', 'RESTful APIs'].map(tech => (
                  <span 
                    key={tech} 
                    className="font-notes text-base bg-amber-50 hover:bg-amber-100 text-stone-900 px-3 py-1 sketch-border transition-transform hover:scale-105"
                  >
                    ✓ {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Bento Card 2: Sketched Metrics & Experience */}
            <div className={`p-6 ${curTheme.cardBg} sketch-border-thick sketch-shadow relative rotate-[1deg] transition-transform duration-500 ${antiGravity ? 'animate-float [animation-delay:800ms]' : ''}`}>
              <div className="washi-tape-blue absolute -top-3 right-10 w-24 h-5" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sketch font-bold text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" /> Stats & Milestones
                </h3>
                <span className="rubber-stamp text-xs text-emerald-700">LIVE</span>
              </div>
              
              <div className="space-y-4">
                <div className="border-b-2 border-dashed border-stone-300 pb-2">
                  <div className="font-sketch text-3xl font-bold text-stone-900">120+</div>
                  <div className="font-notes text-base text-stone-600">Total Code Iterations & Labs</div>
                </div>
                <div className="border-b-2 border-dashed border-stone-300 pb-2">
                  <div className="font-sketch text-3xl font-bold text-stone-900">100%</div>
                  <div className="font-notes text-base text-stone-600">Git Commit Transparency</div>
                </div>
                <div>
                  <div className="font-sketch text-3xl font-bold text-stone-900">2+ Years</div>
                  <div className="font-notes text-base text-stone-600">Full-Stack Development</div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Interactive CLI Terminal */}
            <div className={`p-5 ${curTheme.terminalBg} sketch-border-thick sketch-shadow font-mono text-xs flex flex-col justify-between transition-transform duration-500 ${antiGravity ? 'animate-float [animation-delay:1200ms]' : ''}`}>
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-700 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="opacity-70 text-[11px]">terminal.sh</span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {termHistory.map((line, idx) => (
                    <div key={idx} className={line.type === 'error' ? 'text-rose-400' : line.type === 'system' ? 'opacity-70' : 'text-amber-300'}>
                      {line.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-700 flex items-center gap-1">
                <span className="text-emerald-400 font-bold">$</span>
                <input
                  type="text"
                  value={termInput}
                  onChange={(e) => setTermInput(e.target.value)}
                  onKeyDown={handleCommand}
                  placeholder="type 'help' or 'antigravity'"
                  className="w-full bg-transparent text-emerald-300 outline-none placeholder:opacity-40"
                />
              </div>
            </div>

          </div>
        </section>

        {/* FEATURED PROJECTS: Real GitHub Repositories as Taped Polaroids */}
        <section id="projects" className="mb-24 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm px-2 py-1 bg-stone-200 text-stone-800 sketch-border rounded">02 / WORK</span>
                <h2 className="font-sketch text-4xl font-bold">Featured Case Studies</h2>
              </div>
              <p className="font-hand text-2xl text-stone-600">
                Direct snapshots from my GitHub repositories — click through to examine the code.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className={`${curTheme.cardBg} p-6 sketch-border-thick sketch-shadow-lg relative transition-all duration-500 hover:-translate-y-2 ${proj.rotation} ${
                  antiGravity ? `animate-float [animation-delay:${idx * 400}ms]` : ''
                }`}
              >
                {/* Washi Tape Accent on Top of Card */}
                <div className={`${idx % 2 === 0 ? 'washi-tape' : 'washi-tape-pink'} absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 z-20`} />

                {/* Card Header & Badge */}
                <div className="flex items-start justify-between mb-4 pt-2">
                  <div className="p-2 sketch-border bg-stone-100">
                    {proj.icon}
                  </div>
                  <span className={`rubber-stamp text-xs ${proj.stampColor}`}>
                    {proj.stamp}
                  </span>
                </div>

                {/* Project Title & Repo Link */}
                <h3 className="font-sketch text-2xl font-bold text-stone-900 mb-1">
                  {proj.title}
                </h3>
                <div className="font-mono text-xs text-stone-500 mb-3 flex items-center gap-1">
                  <Github className="w-3.5 h-3.5" />
                  <span>{proj.repo}</span>
                </div>

                <p className="font-notes text-lg text-stone-700 leading-snug mb-5">
                  {proj.notes}
                </p>

                {/* Highlight Metric */}
                <div className="bg-amber-50 p-2.5 sketch-border border-dashed mb-5">
                  <span className="font-mono text-xs text-amber-950 font-bold block mb-0.5">Key Implementation:</span>
                  <p className="font-notes text-sm text-stone-800">{proj.metrics}</p>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.tech.map(t => (
                    <span key={t} className="font-mono text-[11px] bg-stone-100 text-stone-800 px-2 py-0.5 border border-stone-800 rounded">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="pt-4 border-t-2 border-stone-800 flex items-center justify-between">
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playSound('scribble')}
                    className="font-sketch font-bold text-stone-900 hover:text-amber-600 flex items-center gap-1.5 text-base group"
                  >
                    <span>View Repository</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playSound('stamp')}
                    className="font-notes text-stone-600 hover:text-stone-900 text-sm underline decoration-stone-400"
                  >
                    Source Code →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT ME & PHILOSOPHY SECTION */}
        <section className={`mb-24 p-8 ${curTheme.cardBg} sketch-border-thick sketch-shadow relative transition-transform duration-500 ${antiGravity ? 'animate-float [animation-delay:600ms]' : ''}`}>
          <div className="washi-tape-blue absolute -top-3 left-12 w-32 h-6" />

          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-sm px-2 py-1 bg-stone-200 text-stone-800 sketch-border rounded">03 / PHILOSOPHY</span>
            <h2 className="font-sketch text-3xl font-bold">The Craftsman’s Log</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="font-hand text-2xl text-stone-800 leading-relaxed mb-4">
                "Writing software isn’t just assembling packages; it’s hand-crafting solutions that withstand real-world use. 
                Whether architecting database schemas in MySQL, securing user credentials with cryptographic hashing, or polishing user interactions in React, I strive for clarity, durability, and craftsmanship."
              </p>
              <div className="font-notes text-xl text-stone-600">
                — Shivam Singh (Web Developer & Builder)
              </div>
            </div>

            {/* Checklist of Principles */}
            <div className="bg-amber-50 p-6 sketch-border rotate-[-1deg]">
              <h4 className="font-sketch font-bold text-xl mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Engineering Ground Rules:
              </h4>
              <ul className="space-y-2 font-notes text-lg text-stone-800">
                <li>✏️ 1. Code should be clean, self-documenting, and intentional.</li>
                <li>✏️ 2. Security (sanitization, auth, hashing) is never an afterthought.</li>
                <li>✏️ 3. Interfaces must feel responsive, intuitive, and delightful.</li>
                <li>✏️ 4. Build projects end-to-end: frontend polish + backend integrity.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CONTACT & GET IN TOUCH */}
        <section className={`mb-16 p-8 bg-amber-100 sketch-border-thick sketch-shadow-lg text-stone-900 relative transition-transform duration-500 ${antiGravity ? 'animate-float [animation-delay:1000ms]' : ''}`}>
          <div className="washi-tape absolute -top-3 right-12 w-36 h-6" />
          
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block rubber-stamp text-stone-900 mb-4">INBOX READY</div>
            <h2 className="font-sketch text-4xl md:text-5xl font-bold mb-4">
              Let’s Build Something Remarkable.
            </h2>
            <p className="font-hand text-2xl text-stone-700 mb-8">
              Got an exciting project, a software role, or want to collaborate on open-source web tech? Send a transmission directly to my desk.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:shivamsinghchandel.work@gmail.com"
                onClick={() => playSound('stamp')}
                className="px-6 py-3.5 sketch-border-thick bg-stone-900 hover:bg-stone-800 text-amber-200 font-sketch font-bold text-lg sketch-shadow flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
              >
                <Mail className="w-5 h-5" /> shivamsinghchandel.work@gmail.com
              </a>

              <a
                href="https://github.com/cv-am"
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound('scribble')}
                className="px-5 py-3.5 sketch-border bg-white hover:bg-stone-100 text-stone-900 font-sketch font-bold text-lg sketch-shadow flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
              >
                <Github className="w-5 h-5" /> Follow on GitHub
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t-2 border-stone-800 py-8 px-6 bg-white/50 backdrop-blur-sm text-stone-700">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-notes text-lg">
          <div>
            © {new Date().getFullYear()} Shivam Singh (cv-am). Handcrafted with React, Tailwind CSS & Anti-Gravity Physics.
          </div>
          <div className="flex items-center gap-6 font-sketch text-base">
            <a href="https://github.com/cv-am" target="_blank" rel="noreferrer" className="hover:text-amber-600 underline">GitHub</a>
            <a href="https://linkedin.com/in/cvam2006" target="_blank" rel="noreferrer" className="hover:text-amber-600 underline">LinkedIn</a>
            <a href="https://x.com/cvam2006" target="_blank" rel="noreferrer" className="hover:text-amber-600 underline">Twitter/X</a>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-600 underline">↑ Back to Top</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
