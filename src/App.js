import './App.css';
import lottie from 'lottie-web';
import { useEffect } from 'react';
import drone from './Assets/Drone.json';
import BlurText from './Component/Blurtext';
import CustomVideoPlayer from './Component/VideoPage';
import HeroVideo from './Assets/ViraVideo.mp4'

function App() {
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: document.querySelector('#dotlottie'), // the canvas div
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: drone, // directly use JSON
    });

    return () => anim.destroy();
  }, []);
  const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

  return (
    <div className="App">
      <header>
        <h2>VIRA</h2>
        <div className='options'>
          <div className='btn'>Download</div>
          <div className='About'>About</div>
          <div className='Documentation' style={{backgroundColor:'#696FC7'}}>Documentation</div>
        </div>
      </header>

      <div className='HeroSpace'>
        <div className='HeroLine'><BlurText text="Enhance security with our advanced drone surveillance technology" delay={150} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="Line" tag="h2"/></div>
        <div id="dotlottie" style={{ width: 'auto', height: '500px' }}></div>
      </div>

      <div className='videoContainer'>
        <div className='vdo'>
          <CustomVideoPlayer src={HeroVideo} poster="your-poster-image.jpg"/>
        </div>
      </div>
    </div>
  );
}

export default App;
