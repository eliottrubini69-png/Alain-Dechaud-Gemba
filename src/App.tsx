import React, { useEffect, useRef, useCallback, useState } from 'react';
import { ArrowUpRight, ChevronDown, Play, Star, CheckCircle2, Settings, Database, Code, Zap, Phone, BarChart3, PieChart, Users, ArrowRight, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Check } from 'lucide-react';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
    <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-sm rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="AD Gemba Logo" className="h-10 md:h-12 w-auto object-contain" style={{ imageRendering: 'high-quality', transform: 'translateZ(0)' }} referrerPolicy="no-referrer" />
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
        <a href="#approche" className="hover:text-gray-900 transition-colors">Mon approche</a>
        <a href="#mission" className="hover:text-gray-900 transition-colors">Ma mission</a>
        <a href="#contact" className="hover:text-gray-900 transition-colors">Me contacter</a>
      </div>
      <a href="#contact" className="bg-[#00ada3] hover:bg-[#00968d] text-white px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-[0_4px_14px_0_rgba(0,173,163,0.39)]">
        Prendre contact
      </a>
    </div>
  </nav>
);

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef<HTMLAnchorElement>(null);
  const mousePosRef = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const drawArrow = useCallback(() => {
      if (!canvasRef.current || !targetRef.current || !ctxRef.current) return;

      const targetEl = targetRef.current;
      const ctx = ctxRef.current;
      const mouse = mousePosRef.current;

      const x0 = mouse.x;
      const y0 = mouse.y;

      if (x0 === null || y0 === null) return;

      const rect = targetEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const a = Math.atan2(cy - y0, cx - x0);
      const x1 = cx - Math.cos(a) * (rect.width / 2 + 12);
      const y1 = cy - Math.sin(a) * (rect.height / 2 + 12);

      const midX = (x0 + x1) / 2;
      const midY = (y0 + y1) / 2;
      const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5);
      const t = Math.max(-1, Math.min(1, (y0 - y1) / 200));
      const controlX = midX;
      const controlY = midY + offset * t;
      
      const r = Math.sqrt((x1 - x0)**2 + (y1 - y0)**2);
      const baseOpacity = Math.min(1.0, (r - Math.max(rect.width, rect.height) / 2) / 500); 
      
      // Fade out smoothly as the user scrolls down
      const scrollFade = Math.max(0, 1 - (window.scrollY / (window.innerHeight * 0.5)));
      const opacity = baseOpacity * scrollFade;

      if (opacity <= 0) return;

      ctx.strokeStyle = `rgba(0, 173, 163, ${opacity})`;
      ctx.lineWidth = 2;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(controlX, controlY, x1, y1);
      ctx.setLineDash([10, 5]);
      ctx.stroke();
      ctx.restore();

      const angle = Math.atan2(y1 - controlY, x1 - controlX);
      const headLength = 10 * (ctx.lineWidth / 1.5); 
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(
          x1 - headLength * Math.cos(angle - Math.PI / 6),
          y1 - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(x1, y1);
      ctx.lineTo(
          x1 - headLength * Math.cos(angle + Math.PI / 6),
          y1 - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
  }, []);

  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !targetRef.current) return;

      ctxRef.current = canvas.getContext("2d");
      const ctx = ctxRef.current;

      const updateCanvasSize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
      };

      const handleMouseMove = (e: MouseEvent) => {
          mousePosRef.current = { x: e.clientX, y: e.clientY };
      };

      window.addEventListener("resize", updateCanvasSize);
      window.addEventListener("mousemove", handleMouseMove);
      updateCanvasSize();

      const animateLoop = () => {
          if (ctx && canvas) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              // Stop drawing the arrow if we've scrolled past the hero section
              if (window.scrollY < window.innerHeight * 0.8) {
                  drawArrow();
              }
          }
          animationFrameIdRef.current = requestAnimationFrame(animateLoop);
      };
      
      animateLoop();

      return () => {
          window.removeEventListener("resize", updateCanvasSize);
          window.removeEventListener("mousemove", handleMouseMove);
          if (animationFrameIdRef.current) {
              cancelAnimationFrame(animationFrameIdRef.current);
          }
      };
  }, [drawArrow]);

  return (
  <section className="relative pt-40 pb-20 px-4 overflow-hidden min-h-screen flex flex-col items-center text-center">
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"></canvas>
    {/* Background Gradients */}
    <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
    <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
    <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10" />

    <div className="max-w-4xl mx-auto relative z-10">
      <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
        Transformez vos pertes<br />
        industrielles en <span className="text-[#00ada3]">
          performance <span className="relative inline-block">
            durable.
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#00ada3]/30" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00023 6.99999C43.1259 2.15814 117.82 -1.97022 198.001 6.99999" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
          </span>
        </span>
      </h1>

      <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
        Identifiez les gaspillages et ancrez l'amélioration continue au cœur de vos ateliers avec une méthode pragmatique et humaine.
      </p>

      <div className="flex items-center justify-center gap-4">
        <a ref={targetRef} href="#contact" className="group bg-[#00ada3] hover:bg-[#00968d] text-white px-8 py-3.5 rounded-full font-medium flex items-center gap-2 transition-all shadow-[0_8px_20px_-6px_rgba(0,173,163,0.5)] hover:shadow-[0_10px_25px_-6px_rgba(0,173,163,0.6)] hover:-translate-y-0.5">
          Prendre contact <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
        <a href="#mission" className="group bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
          Découvrir mes formations <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>
    </div>
  </section>
  );
};

const WhyTrustUs = () => (
  <section className="py-24 px-4 bg-slate-50/50 border-y border-slate-100">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Pourquoi me faire confiance ?
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Bullet 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#00ada3]/10 rounded-xl flex items-center justify-center mb-6">
            <CheckCircle2 className="w-6 h-6 text-[#00ada3]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">32 ans d'expérience</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            Expérience industrielle dans l’industrie automobile. Une expertise solide dans les environnements complexes.
          </p>
        </div>

        {/* Bullet 2 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#00ada3]/10 rounded-xl flex items-center justify-center mb-6">
            <Users className="w-6 h-6 text-[#00ada3]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">10 ans de Management</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            D'un Département Autonome de Production. Gestion de 350 personnes et optimisation des performances opérationnelles.
          </p>
        </div>

        {/* Bullet 3 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#00ada3]/10 rounded-xl flex items-center justify-center mb-6">
            <Settings className="w-6 h-6 text-[#00ada3]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">15 ans TPS Manager</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            Toyota Production System European Manager chez JTEKT Europe. Mise en place de systèmes Lean et amélioration continue à l’échelle Européenne.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,178,169,0.05),transparent_50%)]" />
        <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium relative z-10">
          Cette combinaison d’expérience terrain et de leadership dans l’excellence opérationnelle me permet d’accompagner mes clients dans la transformation des pertes industrielles en performance globale.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-lg shadow-blue-900/5 flex flex-col md:flex-row items-center gap-10">
        <div className="shrink-0 relative">
          <div className="absolute inset-0 bg-[#00ada3]/20 rounded-full blur-xl translate-y-2 translate-x-2"></div>
          <img src="/Photo_Alain.png" alt="Alain Dechaud" className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white shadow-xl relative z-10" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-slate-900 mb-5">L'humain au cœur de la performance</h3>
          <p className="text-lg text-slate-600 leading-relaxed mb-6 italic">
            « Ce qui m’anime profondément, c’est de voir des équipes reprendre le contrôle de leur quotidien, comprendre ce qu’il se passe vraiment, et progresser avec fierté. »
          </p>
          <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
             <div className="h-0.5 w-8 bg-[#00ada3] rounded-full hidden md:block"></div>
             <p className="text-base text-slate-800 font-semibold">
               C’est cette conviction qui guide chacune de mes interventions.
             </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesLenders = () => (
  <section id="approche" className="py-20 px-4 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-2 block">MON APPROCHE GEMBA</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Observation */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-slate-700" /> Observation
            </h3>
            <ul className="text-gray-600 space-y-3 list-disc pl-5">
              <li><strong>Comprendre</strong> la réalité du terrain</li>
              <li><strong>Observer</strong> avant d’optimiser</li>
              <li>Une bonne observation aligne les équipes et déclenche des <strong>améliorations concrètes</strong></li>
              <li><strong>Comprendre</strong> comment la matière et l’information circulent</li>
              <li><strong>Observer</strong> avec les équipes pour révéler les <strong>irritants quotidiens</strong></li>
            </ul>
          </div>
        </div>

        {/* Écoute & Compréhension */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-slate-700" /> <span className="text-[#00ada3]">Écoute</span> et <span className="text-[#00ada3]">compréhension</span>
            </h3>
            <ul className="text-gray-600 space-y-3 list-disc pl-5">
              <li>Les opérateurs détiennent la <strong>réalité du terrain</strong></li>
              <li><strong>Analyses des causes</strong> plutôt que traiter les symptômes</li>
              <li>Transformer l’écoute en <strong>action concrètes</strong></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Traque des gaspillages */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-slate-700" /> Traque des <span className="text-[#00ada3]">gaspillages</span>
            </h3>
            <ul className="text-gray-600 space-y-3 list-disc pl-5">
              <li><strong>Mesurer</strong> pour décider</li>
              <li><strong>Mesurer</strong> les temps réels (cycles, attentes…)</li>
              <li><strong>Quantifier</strong> les écarts</li>
              <li>J'identifie et cartographie avec précision toutes les sources de pertes qui freinent votre <strong>rentabilité</strong></li>
            </ul>
          </div>
        </div>

        {/* Co-construction de solutions */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-slate-700" /> Co-construction de <span className="text-[#00ada3]">solutions</span>
            </h3>
            <ul className="text-gray-600 space-y-3 list-disc pl-5">
              <li>Construire avec les équipes des solutions réalistes et <strong>immédiatement</strong> applicables</li>
              <li>Tester <strong>rapidement</strong>, ajuster ensemble</li>
              <li>Aligner la performance et adhésion pour garantir l’<strong>appropriation</strong></li>
              <li>Impliquer pour <strong>pérenniser</strong> des solutions durablement appliquées</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesAgencies = () => {
  const [activeTab, setActiveTab] = useState('intervention');

  return (
    <section id="mission" className="py-24 px-4 bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4 block">MA MISSION</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            J'optimise vos opérations sur le terrain pour ancrer <br className="hidden md:block" />
            <span className="text-[#00B2A9]">l'amélioration continue dans votre ADN.</span>
          </h3>
        </div>

        <div className="flex justify-center mb-12 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('intervention')}
            className={`px-8 py-4 text-lg font-semibold transition-colors ${activeTab === 'intervention' ? 'text-slate-900 border-b-2 border-[#00ada3]' : 'text-gray-500 hover:text-slate-900'}`}
          >
            Cadre d'Intervention
          </button>
          <button 
            onClick={() => setActiveTab('formation')}
            className={`px-8 py-4 text-lg font-semibold transition-colors ${activeTab === 'formation' ? 'text-slate-900 border-b-2 border-[#00ada3]' : 'text-gray-500 hover:text-slate-900'}`}
          >
            Formations & Compétences
          </button>
        </div>

        {activeTab === 'intervention' ? (
          <div className="grid md:grid-cols-2 gap-12 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 h-full flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight text-left mb-4">
                Déployez des améliorations concrètes avec l'<span className="text-[#00ada3]">approche Kaizen</span>
              </h3>
              <p className="text-lg text-slate-600">
                Obtenez des gains rapides et durables avec l’approche Kaizen appliquée à vos processus !
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="bg-blue-50 p-2 rounded-full mt-1">
                  <BarChart3 className="w-5 h-5 text-[#00ada3]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Observation & Analyse</h4>
                  <p className="text-xs text-gray-500">Analyse détaillée de vos flux et de vos processus, réalisée directement sur le terrain.</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="bg-blue-50 p-2 rounded-full mt-1">
                  <Settings className="w-5 h-5 text-[#00ada3]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Traque des gaspillages</h4>
                  <p className="text-xs text-gray-500">Identification stricte des pertes en impliquant activement vos équipes dans la démarche.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="bg-blue-50 p-2 rounded-full mt-1">
                  <MapPin className="w-5 h-5 text-[#00ada3]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Déploiement Kaizen</h4>
                  <p className="text-xs text-gray-500">Mise en œuvre rapide d'améliorations concrètes, simples et durables pour l'atelier.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 h-full flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight text-left">
                Pérennisez vos résultats en développant une <span className="text-[#00ada3]">culture Lean</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="bg-blue-50 p-2 rounded-full mt-1 shrink-0">
                  <BarChart3 className="w-5 h-5 text-[#00ada3]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Fondamentaux de l’Excellence Opérationnelle</h4>
                  <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                    <li>Donner du sens, comprendre les concepts et l’intérêt d’un système Lean</li>
                    <li>Inviter vos équipes aux fondations de l’amélioration continue</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="bg-blue-50 p-2 rounded-full mt-1 shrink-0">
                  <Settings className="w-5 h-5 text-[#00ada3]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Outils amelioration & Leadership Terrain</h4>
                  <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                    <li>5S concept</li>
                    <li>Management visuel</li>
                    <li>Travail standardisé</li>
                    <li>Optimisation des postes de travail (mesurer, équilibrer, savoir observer)</li>
                    <li>Posture & les clés de l’animation journalière en production (Pilotage de la performance)</li>
                    <li>Résolution de problèmes "5 Why"</li>
                    <li>SMED réduction des temps de changement de série</li>
                    <li>Value-Stream Mapping « cartographies des flux »</li>
                    <li>Maintenance autonome</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

import { MultiStepForm } from './components/MultiStepForm';

const ContactCTA = () => (
  <section id="contact" className="py-32 px-4 relative overflow-hidden bg-white">
    {/* Background Gradient */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00B2A9]/5 rounded-full blur-3xl -z-10" />
    
    <div className="max-w-3xl mx-auto text-center relative z-10 mb-16">
      <div className="w-12 h-12 bg-[#00B2A9]/10 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#00B2A9]/20">
        <Zap className="w-6 h-6 text-[#00B2A9]" />
      </div>
      
      <h2 className="text-[#00B2A9] font-semibold text-sm tracking-wider uppercase mb-4 block">Me contacter</h2>
      
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
        Prêt à transformer votre <span className="text-[#00B2A9]">performance ?</span>
      </h2>
      
      <p className="text-gray-500 max-w-xl mx-auto">
        Remplissez ce formulaire pour que je puisse vous recontacter et discuter de vos objectifs d'amélioration continue.
      </p>
    </div>

    <div className="relative z-10">
      <MultiStepForm />
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white pt-20 pb-10 px-4 border-t border-gray-100">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.svg" alt="AD Gemba Logo" className="h-16 md:h-20 w-auto object-contain" style={{ imageRendering: 'high-quality', transform: 'translateZ(0)' }} referrerPolicy="no-referrer" />
        </div>
        <p className="text-gray-500 text-sm max-w-sm">
          Je transforme votre performance opérationnelle directement sur le terrain pour développer une culture pérenne d'amélioration continue.
        </p>
      </div>
      
      <div>
        <h4 className="font-bold text-slate-900 mb-6">Navigation</h4>
        <ul className="space-y-4 text-sm text-gray-500">
          <li><a href="#approche" className="hover:text-[#00ada3] transition-colors">Mon approche</a></li>
          <li><a href="#mission" className="hover:text-[#00ada3] transition-colors">Ma mission</a></li>
          <li><a href="#contact" className="hover:text-[#00ada3] transition-colors">Me contacter</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
        <ul className="space-y-4 text-sm text-gray-500">
          <li className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 shrink-0" />
            <a href="mailto:contact@adgemba.fr" className="hover:text-[#00ada3] transition-colors">contact@adgemba.fr</a>
          </li>
          <li className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 shrink-0" />
            <a href="tel:+33614199154" className="hover:text-[#00ada3] transition-colors">06 14 19 91 54</a>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
            <span>Communay (69)</span>
          </li>
        </ul>
      </div>
    </div>
    
    <div className="max-w-6xl mx-auto pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
      © {new Date().getFullYear()} Alain Dechaud Gemba. Tous droits réservés.
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f7fa] font-sans selection:bg-blue-200">
      <Navbar />
      <main>
        <Hero />
        <WhyTrustUs />
        <FeaturesLenders />
        <FeaturesAgencies />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
