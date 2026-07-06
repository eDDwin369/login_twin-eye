import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import './index.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vargheseSimonRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  
  // Track loaded frames so we only draw when ready
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const frameCount = 121;

  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // 1. Initialize Lenis for smooth page scrolling
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
    });

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const images: HTMLImageElement[] = [];

    // Preload all frames into memory for instant scrubbing
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      // Format number to 4 digits: 0000, 0001
      const frameIndex = i.toString().padStart(4, '0');
      img.src = `assets/frames/frame_${frameIndex}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImagesLoaded(true);
          // Draw first frame immediately to set up the canvas
          if (context && canvas) {
             canvas.width = images[0].width;
             canvas.height = images[0].height;
             context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
          }
        }
      };
      images.push(img);
    }

    let targetScroll = 0;
    let currentScroll = 0;
    let animationFrameId: number;
    let currentFrameIndex = -1;

    const onScroll = (e: any) => {
      targetScroll = e.animatedScroll || e.scroll || window.scrollY;
    };

    lenis.on('scroll', onScroll);

    const renderLoop = () => {
      // Lerp scroll for buttery smooth effect
      currentScroll += (targetScroll - currentScroll) * 0.1;
      
      // Calculate hero scroll progress (mapped to the 400vh scroll space)
      const heroScrollSpace = window.innerHeight * 3; 
      let heroProgress = heroScrollSpace > 0 ? currentScroll / heroScrollSpace : 0;
      heroProgress = Math.max(0, Math.min(1, heroProgress));

      // 1. Canvas Scrubbing (Image Sequence)
      if (images.length === frameCount && loadedCount === frameCount && canvas && context) {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(heroProgress * frameCount))
        );
        
        if (frameIndex !== currentFrameIndex) {
          context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
          currentFrameIndex = frameIndex;
        }
      }

      // 2. Text Reveal Based on Scroll
      const vsProgress = Math.max(0, Math.min(1, (heroProgress - 0.1) / 0.3));
      if (vargheseSimonRef.current) {
        vargheseSimonRef.current.style.opacity = vsProgress.toString();
        vargheseSimonRef.current.style.transform = `translateX(${-(1 - vsProgress) * 40}px)`;
        vargheseSimonRef.current.style.filter = `blur(${(1 - vsProgress) * 4}px)`;
      }

      const descProgress = Math.max(0, Math.min(1, (heroProgress - 0.4) / 0.3));
      if (descRef.current) {
        descRef.current.style.opacity = descProgress.toString();
        descRef.current.style.transform = `translateX(${-(1 - descProgress) * 40}px)`;
        descRef.current.style.filter = `blur(${(1 - descProgress) * 4}px)`;
      }

      // 3. Experience Timeline Scroll Logic
      if (timelineRef.current && timelineProgressRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        // Calculate progress based on the center of the viewport
        let expProgress = (window.innerHeight / 2 - rect.top) / rect.height;
        expProgress = Math.max(0, Math.min(1, expProgress));
        
        timelineProgressRef.current.style.height = `${expProgress * 100}%`;

        // Activate dots as the line passes them
        dotsRef.current.forEach((dot) => {
          if (dot) {
            const dotRect = dot.getBoundingClientRect();
            // If dot passes above the center of the screen, mark as active
            if (dotRect.top < window.innerHeight / 2) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          }
        });
      }

      animationFrameId = requestAnimationFrame(requestAnimationFrameCallback);
    };
    
    // We wrap it so we can use animationFrameId
    const requestAnimationFrameCallback = () => {
       renderLoop();
    };

    renderLoop();

    // Trigger initial calculation
    window.addEventListener('resize', () => { targetScroll = window.scrollY; });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="hero" id="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            <span className="title-word">Akhil </span>
            <span className="title-word" ref={vargheseSimonRef} style={{ opacity: 0 }}>
              Varghese Simon<span className="dot">.</span>
            </span>
          </h1>
          <p className="hero-description" ref={descRef} style={{ opacity: 0 }}>
I believe great retail spaces balance adaptability with a strong brand identity. Through thoughtful use of space, materials, and light, I aim to create experiences that go beyond commerce and foster meaningful human connections.          </p>
        </div>
        <div className="hero-right">
          <div className="video-container">
            {/* Show a loading state until all 121 frames are cached in memory */}
            {!imagesLoaded && (
               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontFamily: 'Inter' }}>
                  Loading high-res frames...
               </div>
            )}
            <canvas 
              ref={canvasRef} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                opacity: imagesLoaded ? 1 : 0,
                transition: 'opacity 0.5s'
              }} 
            />
          </div>
        </div>
      </div>
      
      <div className="scroll-space"></div>

      <section className="experience-section">
        <h2 className="section-title">Experience</h2>
        <div className="timeline-container" ref={timelineRef}>
          <div className="timeline-line"></div>
          <div className="timeline-progress" ref={timelineProgressRef}></div>
          
          {[
            { role: 'Designer-SpatialExperience', company: 'MatterMotorWork', years: '2024 - Present' },
            { role: 'Associate Architect', company: 'Studio Commune', years: '2022 - 2024' },
            { role: 'Associate Architect', company: 'Connect art and architecture', years: '2021 - 2022' }
          ].map((job, index) => (
            <div className="timeline-item" key={index}>
              <div 
                className="timeline-dot" 
                ref={(el) => {
                  if (el) dotsRef.current[index] = el;
                }}
              ></div>
              <div className={`timeline-content ${index % 2 === 0 ? 'left' : 'right'}`}>
                <h3>{job.role}</h3>
                <h4>{job.company}</h4>
                <p>{job.years}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default App;
