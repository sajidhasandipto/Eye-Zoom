import { useGSAP } from '@gsap/react'
import sky from '../assets/pannel3.jpg'
import end from '../assets/end.jpg'
import windowImg from '../assets/eyeWindowHollowBW.png'
import { ScrollTrigger } from 'gsap/all'
import gsap from 'gsap'
import { useRef } from 'react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {

  // References
  const heroRef = useRef(null);
  const skyContainerRef = useRef(null);
  const windowContainerRef = useRef(null);


  useGSAP(() => {

    // Current refs
    const skyContainer = skyContainerRef.current;
    const windowContainer = windowContainerRef.current;

    // Lenis for smooth scrolling
    // Initialize a new Lenis instance for smooth scrolling
    const lenis = new Lenis();

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);

    let moveDistance = 0;

    // ScrollTrigger implementation
    const scrollAnim = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: `+=${4 * window.innerHeight}px`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,

      onRefresh: () => {
        // Height calculation to calculate moveDistance
        const skyHeight = skyContainer.offsetHeight;
        const viewportHeight = window.innerHeight;
        moveDistance = skyHeight - viewportHeight;
      },

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

        const blurAmount = Math.max(0, SCALE_CONSTANT - windowScale * 1.5);

        //  Moving downward with the scroll
        gsap.set(skyContainer, {
          y: -progress * moveDistance,
          filter: `blur(${blurAmount}px)`
        });

      }

    })

    ScrollTrigger.refresh();

    // Cleanup function
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerFn);
      scrollAnim.kill();
    };

  }, [])

  return (
    <div>
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

      <section className="relative w-full min-h-screen">
        <img
          src={end}
          alt="End section"
          className="w-full h-screen object-cover block"
          onLoad={() => ScrollTrigger.refresh()}
        />
      </section>
    </div>
  )
}

export default HeroSection