// HPI 1.6-V
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Target, TrendingUp, Map, BarChart3, BookOpen, Award, ArrowRight, CheckCircle2, ChevronRight, MousePointer2 } from 'lucide-react';
import { Image } from '@/components/ui/image';

// --- Utility Components for "Living" Experience ---

// 1. Intersection Observer Reveal Component (Mandatory Pattern)
type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-up' | 'fade-in' | 'slide-in-right' | 'scale-up';
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0, animation = 'fade-up' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
        observer.unobserve(element);
      }
    }, { threshold: 0.15 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-in': return 'opacity-0 transition-opacity duration-1000 ease-out';
      case 'slide-in-right': return 'opacity-0 translate-x-10 transition-all duration-1000 ease-out';
      case 'scale-up': return 'opacity-0 scale-95 transition-all duration-1000 ease-out';
      case 'fade-up': default: return 'opacity-0 translate-y-10 transition-all duration-1000 ease-out';
    }
  };

  return (
    <div ref={ref} className={`${className || ''} ${getAnimationClass()} [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 [&.is-visible]:translate-x-0 [&.is-visible]:scale-100`}>
      {children}
    </div>
  );
};

// 2. Parallax Text Component
const ParallaxText = ({ children, baseVelocity = 100 }: { children: string; baseVelocity: number }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(scrollY, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(scrollVelocity, [0, 1000], [0, 5], { clamp: false });

  const x = useTransform(baseX, (v) => `${v}%`); // Changed to useMotionTemplate if needed, but simple transform works

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div className="scroller font-heading font-black uppercase text-9xl flex whitespace-nowrap" style={{ x }}>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
      </motion.div>
    </div>
  );
};

// Helper for animation frame
import { useAnimationFrame } from 'framer-motion';

// 3. Magnetic Button (Micro-interaction)
const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.3);
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// --- Main Page Component ---

export default function HomePage() {
  const { isAuthenticated, actions } = useMember();
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms for hero elements
  const heroTextY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroImageY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  
  // Background noise texture opacity
  const noiseOpacity = 0.05;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-clip selection:bg-primary selection:text-primary-foreground">
      {/* Global Styles for Custom Cursors and Scrollbar */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #BCCCDC; }
        ::-webkit-scrollbar-thumb { background: #004D25; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #00381b; }
        
        .text-stroke {
          -webkit-text-stroke: 1px #004D25;
          color: transparent;
        }
        .text-stroke-light {
          -webkit-text-stroke: 1px rgba(0, 77, 37, 0.3);
          color: transparent;
        }
        
        .grid-bg {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(0, 77, 37, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 77, 37, 0.05) 1px, transparent 1px);
        }
      `}</style>

      <Header />

      {/* --- HERO SECTION --- */}
      {/* Inspiration: Massive typography, structured grid, technical feel */}
      <section className="relative w-full min-h-screen flex flex-col pt-20 overflow-hidden grid-bg">
        {/* Background Abstract Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            style={{ y: heroImageY }}
            className="absolute top-[10%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-primary/5 blur-[100px]" 
          />
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, 200]) }}
            className="absolute bottom-[10%] left-[10%] w-[20vw] h-[20vw] bg-primary-foreground/20 blur-[80px] mix-blend-multiply" 
          />
        </div>

        <div className="flex-grow flex flex-col justify-center px-4 sm:px-8 lg:px-16 max-w-[120rem] mx-auto w-full relative z-10">
          {/* Top Metadata Row */}
          <div className="w-full flex justify-between items-start mb-8 lg:mb-16 border-b border-primary/20 pb-4">
            <AnimatedElement animation="fade-in" delay={200}>
              <div className="flex flex-col">
                <span className="font-paragraph text-xs font-bold uppercase tracking-widest text-primary">
                  [ Version 1.0 ]
                </span>
                <span className="font-paragraph text-xs uppercase tracking-widest text-foreground/60">
                  Student Edition
                </span>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fade-in" delay={400}>
              <div className="flex flex-col text-right">
                <span className="font-paragraph text-xs font-bold uppercase tracking-widest text-primary">
                  AI-Powered
                </span>
                <span className="font-paragraph text-xs uppercase tracking-widest text-foreground/60">
                  Skill Analysis
                </span>
              </div>
            </AnimatedElement>
          </div>

          {/* Massive Hero Typography */}
          <div className="relative w-full">
            <motion.h1 
              style={{ y: heroTextY }}
              className="font-heading font-black text-[14vw] leading-[0.85] uppercase text-primary tracking-tighter mix-blend-darken"
            >
              <AnimatedElement animation="fade-up" delay={100}>
                <span className="block">Skill</span>
              </AnimatedElement>
              <AnimatedElement animation="fade-up" delay={300}>
                <span className="block ml-[10vw] text-stroke">Navigator</span>
              </AnimatedElement>
            </motion.h1>

            {/* Floating Image Insert */}
            <motion.div 
              style={{ y: heroImageY, rotate: -5 }}
              className="absolute top-[20%] right-[5%] lg:right-[15%] w-[25vw] max-w-[400px] aspect-[3/4] z-20 hidden md:block"
            >
              <div className="relative w-full h-full border-2 border-primary bg-background p-2 shadow-2xl">
                <div className="w-full h-full overflow-hidden relative">
                   <Image 
                    src="https://static.wixstatic.com/media/6fd276_58a6ed512bcf4a4aaf982f31cf18637f~mv2.png?originWidth=576&originHeight=768"
                    alt="Student looking at future career path"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    width={600}
                   />
                   <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
                </div>
                {/* Decorative Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary" />
              </div>
            </motion.div>
          </div>

          {/* Bottom Hero Content */}
          <div className="mt-12 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-12">
            <div className="lg:col-span-5">
              <AnimatedElement animation="fade-up" delay={600}>
                <p className="font-paragraph text-lg lg:text-xl leading-relaxed text-foreground max-w-xl">
                  <span className="bg-primary-foreground px-1 mr-2 font-bold text-primary">NEW</span>
                  Discover your strengths, identify critical skill gaps, and chart a personalized, AI-driven learning journey toward your dream career.
                </p>
              </AnimatedElement>
            </div>
            
            <div className="lg:col-span-7 flex flex-wrap gap-4 justify-start lg:justify-end">
              <AnimatedElement animation="scale-up" delay={800}>
                {isAuthenticated ? (
                  <div className="flex gap-4">
                    <Link to="/dashboard">
                      <MagneticButton className="h-16 px-10 bg-primary text-primary-foreground font-heading font-bold text-lg uppercase tracking-wider border-2 border-primary flex items-center gap-3 hover:bg-primary/90 transition-colors">
                        Dashboard <ArrowRight className="w-5 h-5" />
                      </MagneticButton>
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <MagneticButton onClick={actions.login} className="h-16 px-10 bg-primary text-primary-foreground font-heading font-bold text-lg uppercase tracking-wider border-2 border-primary flex items-center gap-3 hover:bg-primary/90 transition-colors">
                      Start Assessment <MousePointer2 className="w-5 h-5" />
                    </MagneticButton>
                    <Link to="/about">
                      <Button variant="outline" className="h-16 px-10 bg-transparent text-primary font-heading font-bold text-lg uppercase tracking-wider border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                )}
              </AnimatedElement>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-paragraph text-[10px] uppercase tracking-[0.2em] text-primary">Scroll</span>
          <div className="w-[1px] h-12 bg-primary/30 overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-1/2 bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* --- MARQUEE SECTION --- */}
      <section className="w-full bg-primary py-6 overflow-hidden border-y border-primary-foreground/20">
        <ParallaxText baseVelocity={-2}>
          ASSESS • ANALYZE • LEARN • GROW • SUCCEED •
        </ParallaxText>
      </section>

      {/* --- MISSION / INTRO SECTION --- */}
      <section className="w-full py-32 px-4 sm:px-8 lg:px-16 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Sticky Sidebar */}
          <div className="lg:col-span-3 relative">
            <div className="sticky top-32">
              <AnimatedElement animation="fade-in">
                <span className="block font-paragraph text-sm font-bold text-primary mb-4 tracking-widest">01. MISSION</span>
                <h2 className="font-heading text-4xl lg:text-5xl font-black uppercase text-primary leading-none mb-8">
                  Bridge<br/>The Gap
                </h2>
                <div className="w-12 h-1 bg-primary mb-8" />
                <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
                  The job market is evolving faster than education. We provide the compass you need to navigate the changing landscape.
                </p>
              </AnimatedElement>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-24">
            <AnimatedElement>
              <p className="font-heading text-3xl lg:text-5xl font-bold uppercase leading-tight text-foreground">
                We don't just tell you what you're good at. <span className="text-primary bg-primary-foreground/50 px-2">We show you exactly how to get where you want to go.</span>
              </p>
            </AnimatedElement>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedElement delay={200}>
                <div className="group relative aspect-[4/3] overflow-hidden border border-primary/20 bg-secondary">
                  <Image 
                    src="https://static.wixstatic.com/media/6fd276_91815f6d0dbe492dbad3165cfe11be04~mv2.png?originWidth=768&originHeight=576"
                    alt="Student analyzing data"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    width={800}
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-background/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-heading text-lg font-bold uppercase text-primary">Data-Driven Insights</p>
                  </div>
                </div>
              </AnimatedElement>

              <AnimatedElement delay={400}>
                <div className="flex flex-col justify-center h-full space-y-6 p-8 border border-primary/20 bg-white/50 backdrop-blur-sm">
                  <Target className="w-12 h-12 text-primary" strokeWidth={1.5} />
                  <h3 className="font-heading text-2xl font-bold uppercase text-primary">Precision Assessment</h3>
                  <p className="font-paragraph text-sm leading-relaxed">
                    Our dynamic quiz engine adapts to your responses, digging deeper into your capabilities to build a comprehensive skill profile that goes beyond simple multiple choice.
                  </p>
                  <ul className="space-y-3 mt-4">
                    {['Cognitive Ability', 'Technical Proficiency', 'Soft Skills', 'Career Aptitude'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 font-paragraph text-xs font-bold uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (THE SYSTEM) --- */}
      <section className="w-full bg-foreground text-background py-32 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[120rem] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-background/20 pb-8">
            <AnimatedElement>
              <span className="block font-paragraph text-sm font-bold text-primary-foreground mb-4 tracking-widest">02. THE SYSTEM</span>
              <h2 className="font-heading text-5xl lg:text-7xl font-black uppercase text-background leading-none">
                Core<br/>Modules
              </h2>
            </AnimatedElement>
            <AnimatedElement delay={200}>
              <p className="font-paragraph text-sm text-background/70 max-w-md text-right mt-8 md:mt-0">
                A comprehensive suite of tools designed to take you from uncertainty to career readiness.
              </p>
            </AnimatedElement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-background/20 border border-background/20">
            {[
              { icon: BarChart3, title: 'Gap Analysis', desc: 'Visual comparison of your skills versus requirements for target careers.' },
              { icon: Map, title: 'Learning Roadmap', desc: 'Personalized step-by-step learning paths tailored to your specific goals.' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Monitor your skill development and completed learning modules in real-time.' },
              { icon: BookOpen, title: 'Resource Library', desc: 'Curated learning materials matched specifically to your identified skill gaps.' },
              { icon: Award, title: 'Career Insights', desc: 'Explore career paths with detailed skill requirements and salary data.' },
              { icon: Target, title: 'Skill Verification', desc: 'Earn badges and certificates as you validate your new capabilities.' },
            ].map((feature, index) => (
              <AnimatedElement key={index} delay={index * 100} className="h-full">
                <div className="group relative h-full bg-foreground p-8 lg:p-12 hover:bg-primary transition-colors duration-500 overflow-hidden">
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowRight className="w-6 h-6 text-background -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                  
                  <feature.icon className="w-12 h-12 text-primary-foreground mb-8 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                  
                  <h3 className="font-heading text-2xl font-bold uppercase text-background mb-4 group-hover:translate-x-2 transition-transform duration-300">
                    {feature.title}
                  </h3>
                  <p className="font-paragraph text-sm text-background/60 leading-relaxed group-hover:text-background/90 transition-colors duration-300">
                    {feature.desc}
                  </p>
                  
                  {/* Decorative Grid on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none" 
                       style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                  />
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (HORIZONTAL SCROLL FEEL) --- */}
      <section className="w-full py-32 px-4 sm:px-8 lg:px-16 max-w-[120rem] mx-auto bg-secondary/30">
        <div className="mb-24 text-center">
          <AnimatedElement>
            <span className="inline-block font-paragraph text-sm font-bold text-primary mb-4 tracking-widest border border-primary px-4 py-1 rounded-full">03. PROCESS</span>
            <h2 className="font-heading text-5xl lg:text-7xl font-black uppercase text-primary leading-none mt-4">
              Your Journey
            </h2>
          </AnimatedElement>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-0 w-full h-0.5 bg-primary/20 hidden lg:block" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your profile and set your career north star.' },
              { step: '02', title: 'Assess', desc: 'Take the adaptive quiz to map your current skill landscape.' },
              { step: '03', title: 'Analyze', desc: 'Visualize the gap between where you are and where you need to be.' },
              { step: '04', title: 'Execute', desc: 'Follow your custom roadmap and close the gap.' },
            ].map((item, index) => (
              <AnimatedElement key={index} delay={index * 150} animation="fade-up">
                <div className="relative pt-8 lg:pt-0 group">
                  {/* Step Number Bubble */}
                  <div className="w-24 h-24 bg-background border-2 border-primary flex items-center justify-center mb-8 relative z-10 group-hover:bg-primary transition-colors duration-500">
                    <span className="font-heading text-4xl font-black text-primary group-hover:text-primary-foreground transition-colors duration-500">
                      {item.step}
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-2xl font-bold uppercase text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="font-paragraph text-sm text-foreground/70 leading-relaxed max-w-xs">
                    {item.desc}
                  </p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE PREVIEW (VISUAL BREAK) --- */}
      <section className="w-full py-32 px-4 sm:px-8 lg:px-16 bg-background overflow-hidden relative">
        <div className="max-w-[120rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <AnimatedElement>
              <div className="relative w-full aspect-square max-w-xl mx-auto bg-white border-2 border-foreground p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                {/* Mock Chart UI */}
                <div className="absolute top-4 left-4 right-4 flex justify-between border-b border-gray-200 pb-4">
                  <span className="font-paragraph text-xs font-bold uppercase">Skill Gap Analysis</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>
                
                <div className="mt-12 space-y-6">
                  {[
                    { label: 'React / Frontend', current: 75, target: 90 },
                    { label: 'Backend / Node', current: 45, target: 85 },
                    { label: 'UI / UX Design', current: 60, target: 80 },
                    { label: 'Data Structures', current: 30, target: 70 },
                  ].map((skill, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between font-paragraph text-xs font-bold uppercase">
                        <span>{skill.label}</span>
                        <span className="text-primary">Gap: {skill.target - skill.current}%</span>
                      </div>
                      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden relative">
                        {/* Target Marker */}
                        <div className="absolute top-0 bottom-0 w-1 bg-primary/30 z-10" style={{ left: `${skill.target}%` }} />
                        {/* Current Progress */}
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.current}%` }}
                          transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                          className="h-full bg-primary"
                        />
                        {/* Gap Fill */}
                        <motion.div 
                          initial={{ width: 0, opacity: 0 }}
                          whileInView={{ width: `${skill.target - skill.current}%`, opacity: 1 }}
                          transition={{ duration: 1.5, delay: 1 + (i * 0.2), ease: "easeOut" }}
                          className="h-full bg-primary-foreground absolute top-0"
                          style={{ left: `${skill.current}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-8 right-8">
                  <div className="bg-foreground text-background px-4 py-2 font-paragraph text-xs font-bold uppercase">
                    Analysis Complete
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <AnimatedElement>
              <span className="font-paragraph text-sm font-bold text-primary tracking-widest">04. VISUALIZE</span>
              <h2 className="font-heading text-5xl lg:text-6xl font-black uppercase text-foreground leading-none mt-4">
                See What You're<br/>Missing
              </h2>
              <p className="font-paragraph text-lg text-foreground/70 mt-6 leading-relaxed">
                Stop guessing. Our visual gap analysis shows you exactly where you stand compared to industry standards for your dream role.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Real-time industry benchmarks',
                  'Personalized improvement targets',
                  'Direct links to learning resources'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <span className="font-paragraph text-sm font-bold uppercase">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="w-full py-32 px-4 sm:px-8 lg:px-16 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#DFFF00 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <AnimatedElement animation="scale-up">
            <h2 className="font-heading text-6xl sm:text-7xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter mb-12">
              Ready To<br/>Navigate?
            </h2>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <p className="font-paragraph text-lg lg:text-xl max-w-2xl mx-auto mb-12 text-primary-foreground/80">
              Join thousands of students who have stopped wandering and started climbing. Your future career is waiting for a map.
            </p>
          </AnimatedElement>

          <AnimatedElement delay={400}>
            {!isAuthenticated ? (
              <MagneticButton onClick={actions.login} className="h-20 px-12 bg-primary-foreground text-primary font-heading font-black text-2xl uppercase tracking-wider hover:bg-white transition-colors shadow-2xl">
                Get Started Now
              </MagneticButton>
            ) : (
              <Link to="/dashboard">
                <MagneticButton className="h-20 px-12 bg-primary-foreground text-primary font-heading font-black text-2xl uppercase tracking-wider hover:bg-white transition-colors shadow-2xl">
                  Go To Dashboard
                </MagneticButton>
              </Link>
            )}
          </AnimatedElement>
        </div>
      </section>

      <Footer />
    </div>
  );
}