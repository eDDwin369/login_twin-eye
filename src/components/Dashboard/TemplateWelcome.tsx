import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import './Dashboard.css';

interface TemplateWelcomeProps {
  onNavigate?: (tab: string) => void;
  onSettingsClick?: () => void;
  productName?: string;
  stepGifs?: { [key: number]: string };
}

export function TemplateWelcome({
  onNavigate: _onNavigate, 
  onSettingsClick: _onSettingsClick, 
  productName: _productName = 'My Product',
  stepGifs: _stepGifs
}: TemplateWelcomeProps) {
  // Related Ventures data for Version 2 layout
  const venturesData = [
    {
      id: 'brand',
      prefix: 'Set up Your',
      highlight: 'Brand',
      gradientClass: 'v6-gradient-brand',
      title: 'Set up Your Brand',
      image: '/assets/venture_appliance.png'
    },
    {
      id: 'appearance',
      prefix: 'Customize Your',
      highlight: 'Appearance',
      gradientClass: 'v6-gradient-appearance',
      title: 'Customize Your Appearance',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'content',
      prefix: 'Build Your',
      highlight: 'Content',
      gradientClass: 'v6-gradient-content',
      title: 'Build Your Content',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const [activeVentureIndex, setActiveVentureIndex] = useState<number>(0);

  // Video player state
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(35);
  const [isAutoPlaying] = useState<boolean>(true);
  const [isVideoExpanded, setIsVideoExpanded] = useState<boolean>(false);

  // Ambient Particle Canvas Ref for Version 2
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Intro text sequence for Version 2 video screen ("Welcome to" -> "OmniEye")
  const [introTextIndex, setIntroTextIndex] = useState<number>(0);
  const introPhrases = ['Welcome to', 'OmniEye'];

  // Full Dashboard Pure Black Intro Screen State for Version 2 ("Welcome to" -> "OomniEye")
  const [showFullIntro, setShowFullIntro] = useState<boolean>(true);
  const [introPhase, setIntroPhase] = useState<'welcome' | 'omni'>('welcome');
  const [isIntroFadingOut, setIsIntroFadingOut] = useState<boolean>(false);

  const handleDismissIntro = () => {
    if (isIntroFadingOut) return;
    setIsIntroFadingOut(true);
    setTimeout(() => {
      setShowFullIntro(false);
    }, 800);
  };

  useEffect(() => {
    setShowFullIntro(true);
    setIntroPhase('welcome');
    setIsIntroFadingOut(false);

    const timer1 = setTimeout(() => {
      setIntroPhase('omni');
    }, 2000);

    const timer2 = setTimeout(() => {
      setIsIntroFadingOut(true);
    }, 3800);

    const timer3 = setTimeout(() => {
      setShowFullIntro(false);
    }, 4600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntroTextIndex(prev => (prev + 1) % introPhrases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Video scrubbing simulation & step auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlayingVideo) {
      timer = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            if (isAutoPlaying) {
              setActiveVentureIndex(current => (current >= venturesData.length - 1 ? 0 : current + 1));
            }
            return 0;
          }
          return prev + 1.5;
        });
      }, 450);
    }
    return () => clearInterval(timer);
  }, [isPlayingVideo, isAutoPlaying, venturesData.length]);

  // Canvas particle wave animation for Version 2 background
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const numParticles = 160;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2
    }));

    let step = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.015;

      particles.forEach((p, i) => {
        p.x += p.vx + Math.sin(step + i) * 0.3;
        p.y += p.vy + Math.cos(step + i * 0.5) * 0.2;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.6})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Fixed Full Screen Black Intro Overlay for Version 2 (Rendered at document.body level to prevent sidebar clipping) */}
      {showFullIntro && typeof document !== 'undefined' && document.body && createPortal(
        <div 
          className={`v2-full-dashboard-intro-overlay ${introPhase === 'omni' ? 'phase-omni' : 'phase-welcome'} ${isIntroFadingOut ? 'intro-fade-out' : ''}`}
          onClick={handleDismissIntro}
          title="Click anywhere to skip intro"
        >
          <div className="v2-sonar-ring ring-1" />
          <div className="v2-sonar-ring ring-2" />
          <div className="v2-sonar-ring ring-3" />

          <div key={introPhase} className={`v2-full-intro-text ${introPhase === 'welcome' ? 'text-welcome' : 'text-omni'}`}>
            {introPhase === 'welcome' ? 'Welcome to' : 'OomniEye'}
          </div>

          <div className="v2-skip-intro-hint">Click anywhere to skip</div>
        </div>,
        document.body
      )}

      <div className={`dash-layout-container dashboard-fade-in mode-v2 v2-active-${venturesData[activeVentureIndex].id}`}>

      {/* Top Header Row */}
      <div className="dash-top-header-row">
        <div className="dash-header-left">
          <div className="dash-breadcrumb-bar anim-header-entry">
            <h3 className="dash-breadcrumb-text">
              <span className="v6-dashboard-title">Dashboard</span>
            </h3>
          </div>
        </div>
      </div>

      {/* ==================== VERSION 2: Executive Minimal Ice Blue Card Layout ==================== */}
      <div className="v2-ice-full-container">
        {/* Ambient Particle Animation Layer */}
        <div className="ambient-particles-layer" aria-hidden="true">
          <canvas ref={particleCanvasRef} className="v2-bottom-particle-wave-canvas" />
          <div className="particle-orb orb-1" />
          <div className="particle-orb orb-2" />
          <div className="particle-orb orb-3" />
          <div className="particle-orb orb-4" />
          <div className="particle-orb orb-5" />
          <div className="particle-orb orb-6" />
          <div className="particle-orb orb-7" />
          <div className="particle-orb orb-8" />
        </div>

        <div className="v2-ice-card">
          <div className={`v6-ventures-body ${isVideoExpanded ? 'v2-card-expanded-video' : ''}`}>
            {/* Left Column: Venture Titles */}
            <div className="v6-ventures-left">
              {/* Prefix line above */}
              <div className="v2-prefix-line">
                {venturesData[activeVentureIndex].prefix}
              </div>

              {/* Step highlights list below */}
              <div className="v6-highlight-list">
                {venturesData.map((venture, idx) => (
                  <div
                    key={venture.id}
                    className={`v2-highlight-item ${idx === activeVentureIndex ? 'active' : ''}`}
                    onClick={() => setActiveVentureIndex(idx)}
                  >
                    <span className={`v2-text-span ${venture.gradientClass}`}>
                      {venture.highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Rectangular Video Player Placeholder */}
            <div className="v5-ventures-right">
              <div className="v5-video-player-container">
                {/* Rectangular Video Frame */}
                <div className="v5-video-screen">
                  {/* Intro Animated Text Overlay with Sonar Rings */}
                  <div className="v2-intro-animated-text-stage" aria-hidden="true">
                    <div className="v2-sonar-ring ring-1" />
                    <div className="v2-sonar-ring ring-2" />
                    <div className="v2-sonar-ring ring-3" />
                    
                    <div key={introTextIndex} className="v2-intro-text-anim-item">
                      {introPhrases[introTextIndex]}
                    </div>
                  </div>

                  <img 
                    src={venturesData[activeVentureIndex].image} 
                    alt={venturesData[activeVentureIndex].title}
                    className="v5-video-poster v5-anim-fade-img"
                    key={venturesData[activeVentureIndex].id}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/venture_appliance.png';
                    }}
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="v5-video-overlay-gradient" />

                  {/* Top Video Header Tag & Expand Toggle */}
                  <div className="v5-video-top-bar">
                    <div className="v5-video-tag">
                      <span className={`v5-live-dot ${isPlayingVideo ? 'playing' : ''}`} />
                      <span className="v5-tag-text">{isPlayingVideo ? 'PLAYING DEMO' : 'PAUSED'}</span>
                    </div>
                    <div className="v5-video-top-right-group">
                      <span className="v5-hd-badge">1080P HD</span>
                      <button 
                        className="v5-expand-toggle-btn"
                        onClick={() => setIsVideoExpanded(!isVideoExpanded)}
                        title={isVideoExpanded ? "Compress Video" : "Expand Video"}
                      >
                        {isVideoExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Center Glass Play/Pause Button */}
                  <button 
                    className="v5-center-play-btn"
                    onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                    title={isPlayingVideo ? "Pause Video" : "Play Video"}
                  >
                    {isPlayingVideo ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: 3 }} />}
                  </button>

                  {/* Bottom Controls Bar & Red Progress Track */}
                  <div className="v5-video-controls-bottom">
                    <div className="v5-video-time">
                      <span>{`00:${Math.floor((videoProgress / 100) * 45).toString().padStart(2, '0')}`} / 00:45</span>
                    </div>

                    {/* Small Red Progress Bar showing when video will end */}
                    <div 
                      className="v5-red-progress-track"
                      title="Click to scrub video position"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const newPct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
                        setVideoProgress(newPct);
                      }}
                    >
                      <div 
                        className="v5-red-progress-fill" 
                        style={{ width: `${videoProgress}%` }}
                      >
                        <div className="v5-red-scrub-handle" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Step Navigation Arrows & Dots */}
                <div className="v5-player-footer-row">
                  <button 
                    className="v5-nav-btn"
                    onClick={() => setActiveVentureIndex(prev => (prev <= 0 ? venturesData.length - 1 : prev - 1))}
                    title="Previous Step"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="v5-carousel-dots">
                    {venturesData.map((_, idx) => (
                      <span
                        key={idx}
                        className={`v5-dot ${idx === activeVentureIndex ? 'active' : ''}`}
                        onClick={() => setActiveVentureIndex(idx)}
                      />
                    ))}
                  </div>

                  <button 
                    className="v5-nav-btn"
                    onClick={() => setActiveVentureIndex(prev => (prev >= venturesData.length - 1 ? 0 : prev + 1))}
                    title="Next Step"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default TemplateWelcome;
