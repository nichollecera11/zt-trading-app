import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Link */}
        <Link href="/" className="text-sm font-bold text-gray-400 mb-8 inline-block hover:text-white transition-colors">
          ← Back to ZT Trading Shop
        </Link>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 border border-gray-800 p-8 sm:p-12 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            Full-Stack Web Developer & Maxim Logistics Rider
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Hi, I'm Nichol. 👋
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed font-medium mb-8">
            I'm a career-shifter turned full-stack developer, engineering production-grade web applications and e-commerce infrastructure from Cagayan de Oro City.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:nichollecera11@gmail.com" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-center transition-all shadow-lg shadow-blue-600/20"
            >
              Let's Build Your App
            </a>
            <a 
              href="https://github.com/nichollecera11" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-8 py-4 rounded-xl font-bold text-center transition-all"
            >
              Explore GitHub
            </a>
            <a 
              href="https://nichollecera11.rf.gd/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-8 py-4 rounded-xl font-bold text-center transition-all"
            >
              Full Portfolio
            </a>
          </div>
        </div>

        {/* The Story Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/80 border border-gray-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-3">The Hustle</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              As an active Maxim delivery rider, operating real-world logistics gives me a unique edge. I understand business bottlenecks, routing efficiency, and what it takes to build software that solves actual revenue problems on the ground.
            </p>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-3">The Engineering</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              From my KodeGo Bootcamp training to working as a Web Developer at Itech Media Logic, I build clean architectures using Next.js, React, Tailwind CSS, PHP, and custom MySQL databases designed for zero latency.
            </p>
          </div>
        </div>

        {/* Featured Project Card */}
        <div className="bg-gray-900/80 border border-gray-800 p-8 rounded-3xl mb-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">Live Case Study</span>
          <h2 className="text-2xl font-bold text-white mb-3">ZT Trading E-Commerce Ecosystem</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            A fully custom, mobile-first ordering platform tailored for CDO logistics. Features a global state cart (Zustand), live client-side search, a dynamic distance-based delivery calculator, and a secure PIN admin dashboard. Built to bypass membership friction and streamline regional delivery.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-lg">Next.js</span>
            <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-lg">React</span>
            <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-lg">Tailwind CSS</span>
            <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-lg">MySQL</span>
            <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-lg">Zustand</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm font-medium">
            Looking for a developer who understands code and business operations? <br className="hidden sm:inline"/>
            <a href="mailto:nichollecera11@gmail.com" className="text-blue-400 font-bold hover:underline">Get in touch today.</a>
          </p>
        </div>

      </div>
    </main>
  );
}