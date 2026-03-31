import { useGSAP } from '@gsap/react'
import sky from '../assets/pannel3.jpg'
import windowImg from '../assets/eyeWindowHollow.png'
import { ScrollTrigger } from 'gsap/all'
import gsap from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {

  // references
  const heroRef = useRef(null);
  const skyContainerRef = useRef(null);
  const windowContainerRef = useRef(null);


  useGSAP(() => {

    // current refs
    const skyContainer = skyContainerRef.current;
    const windowContainer = windowContainerRef.current;

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: `${4 * window.innerHeight}px`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const SCALE_CONSTANT = 20;

        let windowScale;
        if (progress <= 0.5) {
          windowScale = 1 + (progress / 0.5) * (SCALE_CONSTANT - 1);
        } else {
          windowScale = SCALE_CONSTANT;
        }

        // Window scaling to zoomIn
        gsap.set(windowContainer, {
          scale: windowScale,
        });
        
        // Height calculation to calculate moveDistance
        const skyHeight = skyContainer.offsetHeight;
        const viewportHeight = window.innerHeight;
        const moveDistance = skyHeight - viewportHeight;
        //  Moving downward with the scroll
        gsap.set(skyContainer, {
          y: -progress * moveDistance,
          filter: `blur(${SCALE_CONSTANT - (windowScale*1.5)}px)`
        });    

      }

    })

  }, [])

  return (
    <section
      ref={heroRef}
      className='hero'
    >

      <div
        ref={skyContainerRef}
        className='sky-container'
      >
        <img src={sky} />
      </div>

      <div
        ref={windowContainerRef}
        className='window-container'
      >
        <img src={windowImg} />
      </div>
    </section>
  )
}

export default HeroSection