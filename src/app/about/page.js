import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-[#0a0a09] text-gray-100 py-16 px-6 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#acbf00]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c3afb7]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Back Link */}
        <Link href="/" className="text-sm font-bold text-[#c3afb7] mb-10 inline-block hover:text-white transition-colors">
          &larr; Back to SwiftBag
        </Link>
        
        {/* Hero Section */}
        <div className="bg-[#ffffff]/5 backdrop-blur-xl border border-[#ffffff]/10 p-8 sm:p-14 rounded-[2rem] shadow-2xl mb-10 relative overflow-hidden group hover:border-[#d6eb1d]/30 transition-colors duration-500">
          
          <div className="inline-block bg-[#d6eb1d]/10 text-[#d6eb1d] border border-[#d6eb1d]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            Full-Stack Web Developer & Logistics Operator
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 text-white leading-tight">
            Hi, I'm Nichol. <br/>
            <span className="text-[#c3afb7]">I build digital infrastructure.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-[#c3afb7] leading-relaxed font-medium mb-10 max-w-2xl">
            I see solutions in every problem. I build websites and online stores that actually work for you—proudly based right here in CDO.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:nichollecera11@gmail.com" 
              className="bg-[#acbf00] hover:bg-[#d6eb1d] text-[#0a0a09] px-8 py-4 rounded-xl font-black text-center transition-all shadow-[0_0_20px_rgba(172,191,0,0.3)] hover:shadow-[0_0_30px_rgba(214,235,29,0.5)] hover:-translate-y-1"
            >
              Let's Build Your App
            </a>
            <a 
              href="https://github.com/nichollecera11" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#ffffff]/5 hover:bg-[#ffffff]/10 text-white border border-[#ffffff]/10 px-8 py-4 rounded-xl font-bold text-center transition-all backdrop-blur-sm hover:-translate-y-1"
            >
              Explore GitHub
            </a>
            <a 
              href="https://nichollecera11.rf.gd/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#ffffff]/5 hover:bg-[#ffffff]/10 text-white border border-[#ffffff]/10 px-8 py-4 rounded-xl font-bold text-center transition-all backdrop-blur-sm hover:-translate-y-1"
            >
              Full Portfolio
            </a>
          </div>
        </div>

        {/* The Story Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#ffffff]/5 backdrop-blur-md border border-[#ffffff]/10 p-8 rounded-3xl hover:bg-[#ffffff]/10 transition-colors duration-300">
            <div className="text-3xl mb-4">🛵</div>
            <h3 className="text-xl font-bold text-white mb-3">The Hustle</h3>
            <p className="text-[#c3afb7] text-sm leading-relaxed">
              As an active Maxim delivery rider, operating real-world logistics gives me a unique edge. I understand business bottlenecks, routing efficiency, and exactly what it takes to build software that solves actual revenue problems on the ground.
            </p>
          </div>

          <div className="bg-[#ffffff]/5 backdrop-blur-md border border-[#ffffff]/10 p-8 rounded-3xl hover:bg-[#ffffff]/10 transition-colors duration-300">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-3">The Engineering</h3>
            <p className="text-[#c3afb7] text-sm leading-relaxed">
              From my KodeGo Bootcamp training to working as a Web Developer at Itech Media Logic, I build clean architectures using Next.js, React, Tailwind CSS, PHP, and custom MySQL databases designed for zero latency.
            </p>
          </div>
        </div>

        {/* Featured Project Card */}
        <div className="bg-gradient-to-br from-[#ffffff]/10 to-transparent border border-[#ffffff]/10 p-8 sm:p-10 rounded-3xl mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d6eb1d]/20 rounded-bl-full blur-2xl transition-all group-hover:bg-[#d6eb1d]/30"></div>
          
          <span className="text-xs font-black text-[#d6eb1d] uppercase tracking-widest block mb-3">Live Case Study</span>
          <h2 className="text-3xl font-black text-white mb-4">SwiftBag (formerly ZT Trading)</h2>
          <p className="text-[#c3afb7] text-base leading-relaxed mb-8 max-w-2xl">
            A fully custom, mobile-first ordering platform tailored for CDO logistics. Engineered with a global state cart (Zustand), live client-side search, a dynamic distance-based delivery calculator, and a secure admin dashboard. Built to bypass membership friction and streamline regional delivery operations.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#ffffff]/10 border border-[#ffffff]/20 text-white text-xs font-bold px-4 py-1.5 rounded-full">Next.js</span>
            <span className="bg-[#ffffff]/10 border border-[#ffffff]/20 text-white text-xs font-bold px-4 py-1.5 rounded-full">React</span>
            <span className="bg-[#ffffff]/10 border border-[#ffffff]/20 text-white text-xs font-bold px-4 py-1.5 rounded-full">Tailwind CSS</span>
            <span className="bg-[#ffffff]/10 border border-[#ffffff]/20 text-white text-xs font-bold px-4 py-1.5 rounded-full">MySQL / Aiven</span>
            <span className="bg-[#ffffff]/10 border border-[#ffffff]/20 text-white text-xs font-bold px-4 py-1.5 rounded-full">Zustand</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-10 border-t border-[#ffffff]/10">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to scale your operations?</h3>
          <p className="text-[#c3afb7] text-base font-medium mb-6">
            Looking for a developer who understands both code and business logistics?
          </p>
          <a 
            href="mailto:nichollecera11@gmail.com" 
            className="inline-block text-[#d6eb1d] font-black text-lg hover:text-[#acbf00] transition-colors border-b-2 border-[#d6eb1d] hover:border-[#acbf00] pb-1"
          >
            Get in touch today &rarr;
          </a>
        </div>

      </div>
    </main>
  );
}