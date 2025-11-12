import React, { useState, useEffect, useRef, memo } from 'react';
import { User, Terminal, Tv, Skull } from 'lucide-react';

// ============================================
// COMPONENTES OTIMIZADOS (Memoizados)
// ============================================

const CustomCursor = memo(() => {
  const cursorRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 769);
    
    if (isMobile) return;

    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 w-5 h-5 border-2 border-green-400 opacity-80 pointer-events-none z-[10000] mix-blend-difference"
      style={{ willChange: 'transform' }}
    >
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-400 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
});

const VHSTimestamp = memo(() => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 text-2xl text-green-400 z-[9995] opacity-70" style={{ textShadow: '0 0 5px #00FF1A' }}>
      {time}
    </div>
  );
});

const Scanlines = memo(() => (
  <div 
    className="fixed inset-0 pointer-events-none z-[9990] opacity-50"
    style={{
      background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 2px, transparent 3px)',
      animation: 'scanline 12s linear infinite'
    }}
  />
));

const VHSNoise = memo(() => (
  <div 
    className="fixed inset-0 pointer-events-none z-[9991] opacity-10"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      animation: 'vhsNoise 0.15s steps(2) infinite',
      willChange: 'transform'
    }}
  />
));

const TypeWriter = memo(({ text, delay = 0, speed = 40 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    let index = 0;

    const startTyping = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        const char = text[index];
        const nextSpeed = (char === '.' || char === ',') ? 450 : speed;
        timeout = setTimeout(() => {
          index++;
          startTyping();
        }, nextSpeed);
      } else {
        setIsTyping(false);
      }
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(delayTimeout);
    };
  }, [text, delay, speed]);

  return (
    <span>
      {displayText}
      {isTyping && <span className="animate-pulse text-green-400 ml-1">_</span>}
    </span>
  );
});

const CreditCard = memo(({ member, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <article 
      ref={cardRef}
      className="border-2 border-green-400 bg-black/20 p-5 transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(0,255,26,0.5)] opacity-0 translate-y-8"
      style={{ 
        boxShadow: '0 0 15px rgba(0, 255, 26, 0.2)',
        transitionDelay: `${index * 100}ms`
      }}
    >
      <div className="flex gap-5 flex-col md:flex-row items-start md:items-start">
        <div className="flex-shrink-0 w-32 h-32 border-2 border-green-400 overflow-hidden mx-auto md:mx-0">
          <img 
            src={member.image} 
            alt={member.pokemon}
            className="w-full h-full object-cover animate-pulse"
            style={{
              filter: 'grayscale(1) contrast(1.2) brightness(0.9)',
              mixBlendMode: 'screen',
              opacity: 0.8
            }}
            loading="lazy"
          />
        </div>
        
        <div className="flex flex-col w-full text-center md:text-left">
          <h2 className="text-4xl text-red-500 mb-1 font-bold relative" style={{ textShadow: '0 0 8px #FF003C' }}>
            <TypeWriter text={member.name} delay={index * 600 + 500} />
          </h2>
          
          <p className="text-2xl text-blue-400 mb-3">
            <TypeWriter text={member.role} delay={index * 600 + 800} />
          </p>
          
          <div className="inline-block bg-green-400 text-black text-xl px-3 py-1 mb-4 self-center md:self-start">
            <TypeWriter text={member.pokemon} delay={index * 600 + 1100} />
          </div>
          
          <span className="text-xl italic text-gray-300 opacity-70 border-l-4 md:border-l-4 md:border-t-0 border-t-4 border-green-400 pl-3 md:pl-3 pt-3 md:pt-0">
            <TypeWriter text={member.quote} delay={index * 600 + 1400} speed={30} />
          </span>
        </div>
      </div>
    </article>
  );
});

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function VHSCreditsPage() {
  const [glitching, setGlitching] = useState(false);
  const [theme, setTheme] = useState('dark');

  const teamMembers = [
    {
      name: 'viniciusomagoo',
      role: 'Desenvolvedor/Designer',
      pokemon: 'Oshawott',
      quote: '"levei vantagi hehe"',
      image: 'https://images.unsplash.com/photo-1542779283-429940ce8336?w=400&h=400&fit=crop'
    },
    {
      name: 'gabrielneiffe',
      role: 'Tester',
      pokemon: 'Greninja',
      quote: '"vou roubar sua makita"',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop'
    },
    {
      name: 'WedNX',
      role: 'Ideias/Tester',
      pokemon: 'Arceus',
      quote: '"Os caminhos entre eles cairão sobre mim."',
      image: 'https://images.unsplash.com/photo-1531256456579-c3b58fe2e186?w=400&h=400&fit=crop'
    },
    {
      name: 'Gusttavo',
      role: 'Tester',
      pokemon: 'Pikachu',
      quote: '"Que os professores temam sobre nós."',
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop'
    }
  ];

  // Glitch aleatório
  useEffect(() => {
    const triggerGlitch = () => {
      const delay = Math.random() * 20000 + 10000;
      setTimeout(() => {
        setGlitching(true);
        setTimeout(() => {
          setGlitching(false);
          triggerGlitch();
        }, 300);
      }, delay);
    };

    triggerGlitch();

    // Mensagem no console (ARG)
    console.log(
      '%c[SISTEMA]: ACESSO AUTORIZADO. BEM VINDO WANDERSON %c[ARQUIVO: DOC_CREDITOS.log]',
      'color: #00FF1A; font-size: 1.2rem; font-family: monospace;',
      'color: #E0E0E0; font-size: 1.2rem; font-family: monospace;'
    );
  }, []);

  return (
    <div 
      className="min-h-screen bg-[#010103] text-gray-200 overflow-x-hidden relative"
      style={{ 
        fontFamily: "'Courier New', monospace",
        cursor: 'none',
        letterSpacing: '1px'
      }}
    >
      <style jsx>{`
        @keyframes scanline {
          0% { background-position-y: 0px; }
          100% { background-position-y: 400px; }
        }
        @keyframes vhsNoise {
          0% { transform: translate(0, 0); }
          25% { transform: translate(2px, 3px); }
          50% { transform: translate(-2px, -1px); }
          75% { transform: translate(-1px, 2px); }
          100% { transform: translate(1px, -2px); }
        }
        @keyframes vhsGlitch {
          0% { transform: translate(0, 0); }
          49% { transform: translate(0, 0); }
          50% { transform: translate(2px, 1px); }
          51% { transform: translate(0, 0); }
        }
        @keyframes vhsGlitchIntense {
          0% { transform: translate(-5px, 2px); }
          25% { transform: translate(3px, -3px); opacity: 0.8; }
          50% { transform: translate(6px, 4px); }
          75% { transform: translate(-5px, -2px); opacity: 0.9; }
          100% { transform: translate(2px, 3px); }
        }
        .vhs-container {
          animation: vhsGlitch 15s linear infinite;
          will-change: transform;
        }
        .vhs-container.glitching {
          animation: vhsGlitchIntense 0.3s steps(2) infinite;
        }
        @media (max-width: 768px) {
          body { cursor: auto !important; }
        }
      `}</style>

      <CustomCursor />
      <Scanlines />
      <VHSNoise />

      {/* REC Indicator */}
      <div 
        className="fixed top-5 left-5 text-3xl text-red-500 z-[9995] animate-pulse"
        style={{ textShadow: '0 0 8px #FF003C' }}
      >
        ● REC
      </div>

      <VHSTimestamp />

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-5 right-5 px-5 py-2 text-xl bg-[#010103] text-blue-400 border-2 border-blue-400 z-[9995] transition-all hover:bg-blue-400 hover:text-black"
        style={{ 
          boxShadow: '0 0 10px #00A2FF',
          fontFamily: "'Courier New', monospace"
        }}
      >
        <Terminal className="inline mr-2" size={20} />
        CMD: TROCAR_TEMA
      </button>

      {/* Main Container */}
      <div className={`vhs-container ${glitching ? 'glitching' : ''}`}>
        <main className="max-w-6xl mx-auto px-5 pt-32 pb-10">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 
              className="text-7xl md:text-9xl mb-3 relative"
              style={{ 
                fontFamily: "'Creepster', cursive",
                color: '#FF003C',
                textShadow: '0 0 10px #FF003C, 0 0 20px #ff0000',
                letterSpacing: '8px'
              }}
            >
              <TypeWriter text="CRÉDITOS" speed={100} />
            </h1>
            
            <p className="text-2xl text-green-400 opacity-80 mb-8" style={{ textShadow: '0 0 5px #00FF1A' }}>
              <TypeWriter text="Equipe Darkness Of Control / Apoio Brasil.IA" delay={1000} speed={50} />
            </p>

            <div className="flex justify-center items-center gap-8 mt-8">
              <div className="w-32 h-32 bg-gray-800/30 border-2 border-green-400 flex items-center justify-center opacity-70 animate-pulse">
                <Skull size={64} className="text-green-400" />
              </div>
              <div className="w-32 h-32 bg-gray-800/30 border-2 border-green-400 flex items-center justify-center opacity-70 animate-pulse">
                <Tv size={64} className="text-green-400" />
              </div>
            </div>
          </header>

          {/* Credits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <CreditCard key={member.name} member={member} index={index} />
            ))}
          </div>

          {/* Back Button */}
          <div className="text-center mt-16">
            <button
              onClick={() => window.history.back()}
              className="inline-block px-8 py-4 text-2xl text-green-400 border-2 border-green-400 bg-transparent transition-all hover:bg-green-400 hover:text-black hover:shadow-[0_0_20px_#00FF1A]"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              <span className="mr-2">&lt;</span> VOLTAR.exe
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}