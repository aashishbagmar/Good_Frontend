import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Droplet, Fish, Anchor, Activity, ChevronUp } from 'lucide-react';

// --- Custom Hooks ---

// Hook to detect when an element enters the viewport for scroll animations
const useInView = (options = { threshold: 0.1 }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target); // Only animate once
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
};

// --- Components ---

// 1. Reusable Animated Section Wrapper (Requirement: Scroll Reveal Effects)
const FadeInSection = ({ children, delay = "delay-0", className = "" }) => {
  const [ref, isVisible] = useInView({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? `opacity-100 translate-y-0 ${delay}` : 'opacity-0 translate-y-12'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// 2. Interactive Bioluminescent Card (Requirement: Interactive Elements & Hover Animations)
const BioCard = ({ title, desc, icon: Icon, delay }) => {
  return (
    <FadeInSection delay={delay} className="w-full md:w-1/3 p-4">
      <div className="group relative bg-blue-900/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 transition-all duration-500 hover:scale-105 hover:bg-blue-800/40 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] cursor-pointer h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-blue-600/0 group-hover:from-cyan-400/10 group-hover:to-blue-600/10 rounded-xl transition-all duration-500"></div>
        <Icon className="w-12 h-12 text-cyan-500 mb-4 transition-transform duration-500 group-hover:-translate-y-2 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
      </div>
    </FadeInSection>
  );
};

// 3. Sonar Interaction Component (Requirement: Interactive click/reveal animation)
const SonarInteraction = () => {
  const [pinging, setPinging] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handlePing = () => {
    if (pinging) return;
    setPinging(true);
    setTimeout(() => {
      setRevealed(true);
      setPinging(false);
    }, 1500); // Reveal after ping animation
  };

  return (
    <div className="flex flex-col items-center mt-12 w-full max-w-2xl mx-auto">
      <div className="relative flex justify-center items-center w-32 h-32 mb-8">
        {pinging && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}></div>
          </>
        )}
        <button
          onClick={handlePing}
          className="relative z-10 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/50 p-6 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex flex-col items-center group"
        >
          <Activity className="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold tracking-wider">SONAR</span>
        </button>
      </div>

      <div className={`transition-all duration-1000 transform text-center w-full ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-slate-800/80 border border-slate-600 rounded-lg p-6 text-slate-300 shadow-2xl">
          <p className="text-lg italic text-cyan-200 mb-2">"Ping... Received."</p>
          <p>The pressure here is over 1,000 times that at the surface. It's equivalent to having 50 jumbo jets piled on top of you. Yet, extremophiles thrive here, proving life's incredible adaptability.</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---
export default function App() {
  const [scrollDepth, setScrollDepth] = useState(0);
  const maxDepth = 11000; // Marianas Trench depth in meters

  // Scroll handler for Depth Meter and Parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate depth based on scroll percentage
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
      const currentDepth = Math.min(Math.round(scrollPercentage * maxDepth), maxDepth);
      setScrollDepth(currentDepth);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to next section
  const scrollToNext = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="relative w-full min-h-screen font-sans text-white overflow-x-hidden"
      style={{
        // Continuous smooth gradient background matching ocean layers
        background: 'linear-gradient(to bottom, #38bdf8 0%, #1e40af 20%, #172554 40%, #0f172a 65%, #000000 100%)'
      }}
    >
      {/* Global Styles for Custom Animations */}
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes float {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }
        .bubble {
          position: fixed;
          bottom: -100px;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1));
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          animation: float infinite linear;
          pointer-events: none;
          z-index: 0;
        }
        .text-glow { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
      `}</style>

      {/* Floating Background Bubbles (Requirement: Background Animation & Parallax feel) */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="bubble"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 20 + 5}px`,
            height: `${Math.random() * 20 + 5}px`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: scrollDepth > 4000 ? 0 : 1, // Bubbles disappear in deep ocean
            transition: 'opacity 2s ease'
          }}
        />
      ))}

      {/* Fixed Sticky Depth Meter (Requirement: Sticky Element & Scroll Interaction) */}
      <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-50">
        <div className="h-48 md:h-64 w-1 bg-slate-700/50 rounded-full relative overflow-hidden backdrop-blur-sm border border-slate-600/30">
          <div 
            className="absolute top-0 w-full bg-cyan-400 rounded-full transition-all duration-300"
            style={{ height: `${(scrollDepth / maxDepth) * 100}%`, boxShadow: '0 0 10px #22d3ee' }}
          ></div>
        </div>
        <div className="mt-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded text-xs md:text-sm font-mono border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          {scrollDepth.toLocaleString()}m
        </div>
      </div>

      {/* SECTION 1: Hero - The Sunlight Zone (0-200m) */}
      <section id="sunlight" className="relative w-full h-screen flex flex-col justify-center items-center px-6 text-center z-10">
        <FadeInSection>
          <div className="inline-flex items-center gap-2 mb-4 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/30 text-white text-sm font-semibold uppercase tracking-widest">
            <Droplet className="w-4 h-4" /> Epipelagic Zone
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white text-glow tracking-tight mb-6">
            The Ocean Depths
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-12 font-light">
            Scroll down to leave the light behind and explore the profound mysteries of the deep blue.
          </p>
          <button 
            onClick={() => scrollToNext('twilight')}
            className="group flex flex-col items-center text-blue-50 hover:text-white transition-colors"
          >
            <span className="text-sm font-medium tracking-widest mb-2 opacity-80 group-hover:opacity-100 transition-opacity">BEGIN DESCENT</span>
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white transition-all bg-white/10 backdrop-blur-sm">
              <ArrowDown className="w-6 h-6 animate-bounce" />
            </div>
          </button>
        </FadeInSection>
      </section>

      {/* SECTION 2: Introduction - The Twilight Zone (200-1000m) */}
      <section id="twilight" className="relative w-full min-h-screen flex flex-col justify-center px-6 py-20 z-10">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <FadeInSection className="order-2 md:order-1">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">The Twilight Zone</h2>
            <p className="text-lg md:text-xl text-blue-200 mb-6 leading-relaxed">
              As we pass 200 meters, the vibrant colors of the surface fade. The light here is faint, creating a world of shadows. Photosynthesis is no longer possible, and the creatures that live here rely on marine snow—organic debris falling from above.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-3 py-1 bg-blue-800/50 border border-blue-600 rounded-full text-sm text-blue-100">Temp: 5°C to 20°C</span>
              <span className="px-3 py-1 bg-blue-800/50 border border-blue-600 rounded-full text-sm text-blue-100">Depth: 200m - 1000m</span>
            </div>
          </FadeInSection>
          <FadeInSection className="order-1 md:order-2 flex justify-center" delay="delay-200">
            {/* Abstract visual representation */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-900/40 border border-blue-500/20 backdrop-blur-sm flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
              <Fish className="w-24 h-24 text-blue-300 opacity-50" />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 3: Exploration - The Midnight Zone (1000-4000m) */}
      <section id="midnight" className="relative w-full min-h-screen flex flex-col justify-center px-6 py-20 z-10">
        <div className="max-w-6xl mx-auto w-full">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">The Midnight Zone</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Total darkness. The only light here is created by the animals themselves through bioluminescence. 
              Hover over the entities below to illuminate their secrets.
            </p>
          </FadeInSection>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            <BioCard 
              title="Anglerfish" 
              desc="Uses a glowing lure protruding from its head to attract unsuspecting prey in the pitch black."
              icon={Activity}
              delay="delay-0"
            />
            <BioCard 
              title="Vampire Squid" 
              desc="Instead of ink, it ejects a cloud of bioluminescent mucus to confuse predators and escape into the dark."
              icon={Fish}
              delay="delay-[200ms]"
            />
            <BioCard 
              title="Lanternfish" 
              desc="Possesses photophores along its body, used for camouflage against the faint light from above and for communication."
              icon={Droplet}
              delay="delay-[400ms]"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: Insight - The Abyss (4000-6000m) */}
      <section id="abyss" className="relative w-full min-h-screen flex flex-col justify-center px-6 py-20 z-10 bg-slate-950/40">
        <div className="max-w-4xl mx-auto w-full text-center">
          <FadeInSection>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-200 mb-6">The Abyss</h2>
            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
              We have entered the abyssopelagic zone. The water is freezing, and the pressure is crushing. 
              It is a seemingly barren landscape, yet life endures. Scan the area to learn more.
            </p>
          </FadeInSection>

          {/* Interactive Element */}
          <FadeInSection delay="delay-300">
             <SonarInteraction />
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 5: Conclusion - The Trenches (6000m+) */}
      <section id="trenches" className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 py-20 z-10 border-t border-slate-800">
        <FadeInSection className="text-center max-w-3xl">
          <Anchor className="w-16 h-16 text-slate-600 mx-auto mb-8" />
          <h2 className="text-5xl md:text-7xl font-bold text-slate-500 mb-6 tracking-tighter">
            The Trenches
          </h2>
          <p className="text-xl text-slate-400 mb-12 font-light">
            You've reached the Hadalpelagic zone, the deepest parts of the ocean floor, inside narrow trenches. 
            More people have been to the moon than to the bottom of the Mariana Trench. 
            The ocean remains our planet's final unexplored frontier.
          </p>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-slate-700 hover:border-cyan-500 hover:text-cyan-400 text-slate-400 rounded-full transition-all duration-300 group"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            <span className="font-semibold tracking-widest text-sm">RETURN TO SURFACE</span>
          </button>
        </FadeInSection>
      </section>
    </div>
  );
}