import { useGSAP } from '@gsap/react'
import sky from '../assets/pannel3.jpg'
import end from '../assets/end.jpg'
import windowImg from '../assets/eyeWindowHollowBW.png'
import { ScrollTrigger } from 'gsap/all'
import gsap from 'gsap'
import { useRef } from 'react'
import Lenis from 'lenis'
import { ChevronsDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {

  // References
  const heroRef = useRef(null);
  const skyContainerRef = useRef(null);
  const windowContainerRef = useRef(null);
  const heroHeaderRef = useRef(null);

  useGSAP(() => {

    // Current refs
    const skyContainer = skyContainerRef.current;
    const windowContainer = windowContainerRef.current;
    const heroHeader = heroHeaderRef.current;

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

        // Moving the hero-header up the screen
        const perspective = 1000;
        const zScale = perspective * (1 - 1 / windowScale);

        gsap.set(heroHeader, {
          z: zScale,
        })

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
    <div className='text-[#ffffff96]'>
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

        <div
          ref={heroHeaderRef}
          className='hero-header'
        >
          <div className='absolute top-10 left-1/2 -translate-x-1/2 flex'>
            <span className='tracking-widest text-2xl font-bold'>Scroll Down</span>
            <span><ChevronsDown size={40} /></span>
          </div>

          <div className='absolute right-0 top-0 translate-y-1/2 h-svh p-8 text-6xl text-center'>
            <h1 className="drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-loose">~Words <br /> Left <br /> Unspoken~</h1>
          </div>

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