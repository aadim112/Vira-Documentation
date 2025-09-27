import React, { useState, useRef, useEffect } from 'react';

const CustomVideoPlayer = ({ src, poster, className = "" }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const controlsTimeoutRef = useRef(null);

  // Default video source
  const defaultSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const videoSrc = src || defaultSrc;

  // Custom SVG Icons as components
  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
      <path d="M8 5v14l11-7z"/>
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
  );

  const VolumeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="m19.07 4.93-10 10M15.54 8.46l3.07-3.07"/>
    </svg>
  );

  const VolumeOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  );

  const FullscreenIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M8 21h3a2 2 0 0 0 2-2v-3m0-8V5a2 2 0 0 0-2-2H8"/>
      <rect x="7" y="13" width="10" height="8" rx="2"/>
    </svg>
  );

  const RewindIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  );

  const FastForwardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
    </svg>
  );

  const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    video.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const volumeBar = volumeRef.current;
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const changePlaybackRate = (rate) => {
    const video = videoRef.current;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const handleKeyPress = (e) => {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        skip(10);
        break;
      case 'ArrowLeft':
        skip(-10);
        break;
      case 'KeyF':
        toggleFullscreen();
        break;
      case 'KeyM':
        toggleMute();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const volumePercentage = (isMuted ? 0 : volume) * 100;

  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer'
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    playOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    playButton: {
      width: '80px',
      height: '80px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      backdropFilter: 'blur(4px)',
      transition: 'background-color 0.2s'
    },
    playIcon: {
      width: '40px',
      height: '40px',
      color: 'white',
      marginLeft: '4px'
    },
    controls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, black, rgba(0,0,0,0.7), transparent)',
      padding: '16px',
      transition: 'all 0.3s ease',
      opacity: 1,
      transform: 'translateY(0)'
    },
    controlsHidden: {
      opacity: 0,
      transform: 'translateY(8px)'
    },
    progressContainer: {
      marginBottom: '16px'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#666',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'height 0.15s'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#3b82f6',
      borderRadius: '4px',
      position: 'relative'
    },
    controlsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    controlsLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    controlsRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    controlButton: {
      color: 'white',
      backgroundColor: 'transparent',
      border: 'none',
      padding: '4px',
      cursor: 'pointer',
      transition: 'color 0.2s',
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      width: '24px',
      height: '24px'
    },
    smallIcon: {
      width: '20px',
      height: '20px'
    },
    volumeContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    volumeSlider: {
      width: '80px',
      height: '8px',
      backgroundColor: '#666',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    volumeFill: {
      height: '100%',
      backgroundColor: '#3b82f6',
      borderRadius: '4px'
    },
    timeDisplay: {
      color: 'white',
      fontSize: '14px',
      fontFamily: 'monospace'
    },
    speedMenu: {
      position: 'absolute',
      bottom: '100%',
      right: 0,
      marginBottom: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '8px',
      padding: '8px',
      minWidth: '80px'
    },
    speedButton: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: 'transparent',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    speedButtonActive: {
      color: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)'
    }
  };

  return (
    <div 
      style={styles.container}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={togglePlay}
      tabIndex={0}
      className={className}
    >
      <video
        ref={videoRef}
        style={styles.video}
        src={videoSrc}
        poster={poster}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Play button overlay for when paused */}
      {!isPlaying && (
        <div style={styles.playOverlay}>
          <button
            onClick={togglePlay}
            style={{
              ...styles.playButton,
              ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            <div style={styles.playIcon}>
              <PlayIcon />
            </div>
          </button>
        </div>
      )}

      {/* Controls */}
      <div 
        style={{
          ...styles.controls,
          ...((!showControls && isPlaying) ? styles.controlsHidden : {})
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div style={styles.progressContainer}>
          <div 
            ref={progressRef}
            style={styles.progressBar}
            onClick={handleProgressClick}
          >
            <div 
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`
              }}
            />
          </div>
        </div>

        {/* Control buttons */}
        <div style={styles.controlsRow}>
          <div style={styles.controlsLeft}>
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              style={styles.controlButton}
            >
              <div style={styles.icon}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </div>
            </button>

            {/* Skip buttons */}
            <button
              onClick={() => skip(-10)}
              style={styles.controlButton}
              title="Rewind 10s"
            >
              <div style={styles.smallIcon}>
                <RewindIcon />
              </div>
            </button>
            <button
              onClick={() => skip(10)}
              style={styles.controlButton}
              title="Forward 10s"
            >
              <div style={styles.smallIcon}>
                <FastForwardIcon />
              </div>
            </button>

            {/* Volume */}
            <div 
              style={styles.volumeContainer}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={toggleMute}
                style={styles.controlButton}
              >
                <div style={styles.smallIcon}>
                  {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeIcon />}
                </div>
              </button>
              
              {showVolumeSlider && (
                <div 
                  ref={volumeRef}
                  style={styles.volumeSlider}
                  onClick={handleVolumeChange}
                >
                  <div 
                    style={{
                      ...styles.volumeFill,
                      width: `${volumePercentage}%`
                    }}
                  />
                </div>
              )}
            </div>

            {/* Time display */}
            <span style={styles.timeDisplay}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div style={styles.controlsRight}>
            {/* Playback speed */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                style={{
                  ...styles.controlButton,
                  gap: '4px'
                }}
              >
                <div style={styles.smallIcon}>
                  <SettingsIcon />
                </div>
                <span style={{ fontSize: '14px' }}>{playbackRate}x</span>
              </button>
              
              {showSpeedMenu && (
                <div style={styles.speedMenu}>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      style={{
                        ...styles.speedButton,
                        ...(playbackRate === rate ? styles.speedButtonActive : {})
                      }}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              style={styles.controlButton}
            >
              <div style={styles.smallIcon}>
                <FullscreenIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;