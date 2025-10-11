import { useEffect, useState, useRef } from 'react';
import lottie from 'lottie-web';
import './App.css';
import HeroVideo from './Assets/HeroVideo.mp4';
import Prototype from './Assets/ViraVideo.mp4';
import drone from './Assets/Drone.json';
import Blurtext from './Component/Blurtext'
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Documentation from './Components/Documentation';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnmuteButton, setShowUnmuteButton] = useState(true);
  const navigate  = useNavigate();

  // Initialize Lottie animation for main content
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: document.querySelector('#dotlottie'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: drone,
    });

    return () => {
      anim.destroy();
    };
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = window.innerHeight;
      const progress = Math.min(scrollPosition / maxScroll, 1);
      setScrollProgress(progress);

      // Control video audio based on scroll
      if (videoRef.current && !isMuted) {
        const volume = Math.max(0, 1 - progress * 1.5);
        videoRef.current.volume = volume;

        if (progress >= 0.7) {
          videoRef.current.muted = true;
        }
      }

      // Hide unmute button after scrolling or if already unmuted
      if (progress > 0.1 || !isMuted) {
        setShowUnmuteButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMuted]);

  // Calculate video transformations
  const videoScale = 1 - scrollProgress * 0.2;
  const videoOpacity = 1 - scrollProgress * 0.6;

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      setIsMuted(false);
      setShowUnmuteButton(false);
    }
  };

  const handleDocumentation = () => navigate('/Documentation');
  const handleAbout = () => navigate('/');

  return (
    <Routes>
      <Route path="/Documentation" element={<Documentation file="example"/>} />
      <Route path="/docs/:docId" element={<Documentation />} />
      <Route path='/Vira-Documentation' element={
        <div className="app-container">
          {/* Fixed Video Container */}
          <div
            className="video-hero-container"
            style={{
              zIndex: scrollProgress >= 0.95 ? -1 : 10,
              transform: `translate(-50%, -50%) scale(${videoScale})`,
              opacity: videoOpacity,
              pointerEvents: scrollProgress >= 0.95 ? 'none' : 'auto',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={HeroVideo} type="video/mp4" />
            </video>

            {/* Unmute Button */}
              <button onClick={handleUnmute} className="unmute-button">
                <svg viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </button>

            {/* Overlay gradient */}
            <div className="video-overlay" />
          </div>

          {/* Scroll indicator */}
          {scrollProgress < 0.3 && (
            <div
              className="scroll-indicator"
              style={{ opacity: 1 - scrollProgress * 3 }}
            >
              <span>Scroll to explore</span>
              <div className="scroll-indicator-line" />
            </div>
          )}

          {/* Spacer to allow scrolling */}
          <div className="spacer" />

          {/* Main Content */}
          <div className="main-content">
            {/* Header */}
            <header className="header">
              <h2>VIRA</h2>
              <div className="header-options">
                <button className="header-button download">Download</button>
                <button className="header-button about" onClick={handleAbout}>About</button>
                <button className="header-button documentation" onClick={handleDocumentation}>Documentation</button>
              </div>
            </header>

            {/* Hero Space */}
            <div className="hero-space">
              <h2 className="hero-title">
                Enhance SECURITY with our advanced drone surveillance technology
              </h2>
              <div id="dotlottie" className="drone-container" />
            </div>

            {/* Prototype Video Section */}
            <div className="prototype-section">
              <h1 className="prototype-title">Prototype Video</h1>
              <div className="prototype-grid">
                <div className="prototype-video-container">
                  <video controls>
                    <source src={Prototype} type="video/mp4" />
                  </video>
                </div>
                <div className="prototype-info">
                  <h3>About the Prototype</h3>
                  <p>
                    Our advanced drone surveillance system provides real-time
                    monitoring and security solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>}/>
    </Routes>
  );
}

export default App;