import Link from "next/link";

// 👇 Real certificates. `image` points to /public/images/certificates/ —
// see the note below the component for exactly how to add that folder.
const CERTIFICATES = [
  {
    name: "Virtual Assistant Training",
    issuer: "Clairvoyance (JKY Customer Mgmt. Training Services)",
    year: "2022",
    image: "/images/certificates/VirtualAssistant.png",
  },
  {
    name: "Teaching English as Second Language",
    issuer: "Clairvoyance (JKY Customer Mgmt. Training Services)",
    year: "2022",
    image: "/images/certificates/TESL.png",
  },
  {
    name: "Full-Stack Web Development Bootcamp",
    issuer: "KodeGo · Best Capstone Project",
    year: "2023",
    image: "/images/certificates/KodeGo.png",
  },
  {
    name: "Call Center Agent Core Skills Training",
    issuer: "Clairvoyance (TESDA Registered)",
    year: "2022",
    image: "/images/certificates/CSR.png",
  },
  {
    name: "Software Development & Design Thinking",
    issuer: "DICT Region X — ICT Literacy & Competency Dev. Bureau",
    year: "2025",
    image: "/images/certificates/Certificate-SDDT-63.png",
  },
];

const EXPERIENCE = [
  {
    role: "Web Developer",
    org: "Itech Media Logic",
    period: "Jan 2024 – Mar 2025",
    detail:
      "Developed and customized WordPress websites — front-end and back-end, troubleshooting, plugin integrations, and performance optimization.",
  },
  {
    role: "Virtual Assistant",
    org: "Freelancer",
    period: "2017 – 2024",
    detail:
      "Broad client support — troubleshooting, content creation, data encoding, and technical support across devices.",
  },
  {
    role: "Transcriber",
    org: "iDictate",
    period: "2017 – 2023",
    detail:
      "Transcribed voicemails, legal and medical files, and call recordings. 50 WPM, English transcription.",
  },
  {
    role: "Customer Service Representative",
    org: "IBEX Global",
    period: "2016 – 2017",
    detail:
      "Helped streamline product support materials, cutting escalated-case resolution time by 20%.",
  },
];

const PROJECTS = [
  {
    name: "Reserva — Hotel Reservation",
    org: "KodeGo Capstone",
    detail: "Login/auth backend, full frontend & backend build.",
    stack: "ReactJS, MySQL, PHP, Laravel",
    link: "https://capstone-psi-six.vercel.app/",
  },
  {
    name: "Reserva — Parking Reservation",
    org: "KodeGo Capstone",
    detail: "Led a team building the frontend from scratch.",
    stack: "HTML, CSS, Bootstrap, ReactJS",
    link: "https://mp2-for-deployment-mw91vhw21-nichollecera11.vercel.app/Home",
  },
  {
    name: "Itech Media Logic",
    org: "Client Site",
    detail: "Designed and built from branding to deployment; custom animations.",
    stack: "WordPress",
    link: "https://itechmedialogic.com",
  },
  {
    name: "Rotorcraft Support Inc.",
    org: "Client Site",
    detail: "Professional WordPress build with custom service-presentation features.",
    stack: "WordPress",
    link: "https://rotorcraftsupport.com",
  },
  {
    name: "Aurora Event Team",
    org: "Client Site",
    detail: "Redesigned pages, fixed layout issues, improved navigation flow.",
    stack: "WordPress / Gutenberg",
    link: "https://auroraeventteam.com/",
  },
  {
    name: "Go Forward Pest Control",
    org: "Client Site",
    detail: "Content updates, new pages, ongoing site maintenance.",
    stack: "WordPress",
    link: "https://goforwardpestcontrol.com.ph/",
  },
];

const SKILLS = {
  "Front-End": ["HTML", "CSS", "Bootstrap", "JavaScript", "ReactJS", "WordPress"],
  "Back-End": ["Node.js", "PHP", "Laravel"],
  "Database": ["MySQL", "DBeaver"],
  "Tools": ["Postman", "Discord", "Zoom", "Canva", "Photoshop"],
};

export default function About() {
  return (
    <main className="min-h-screen bg-[#0a0a09] text-gray-100 py-16 px-6 relative overflow-hidden">
      {/* Background glow — subtle, consistent with the rest of the app */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#acbf00]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c3afb7]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* CSS-only infinite marquee: transform-only, GPU-composited, no JS.
          Pauses on hover, respects reduced motion. */}
      <style>{`
        @keyframes sb-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .sb-marquee-track {
          animation: sb-marquee 28s linear infinite;
        }
        .sb-marquee-wrap:hover .sb-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-marquee-track { animation: none; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="text-sm font-bold text-[#c3afb7] mb-10 inline-block hover:text-white transition-colors"
        >
          &larr; Back to SwiftBag
        </Link>

        {/* Hero Section */}
        <div className="bg-[#141412] border border-[#c3afb7]/15 p-8 sm:p-14 rounded-2xl shadow-2xl mb-8 relative overflow-hidden">
          <div className="inline-block bg-[#d6eb1d]/10 text-[#d6eb1d] border border-[#d6eb1d]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            Full-Stack Web Developer &amp; Logistics Operator
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 text-white leading-tight">
            Hi, I&apos;m Nichol. <br />
            <span className="text-[#c3afb7]">I build digital infrastructure.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#c3afb7] leading-relaxed font-medium mb-10 max-w-2xl">
            A creative web developer working across HTML/CSS, JavaScript,
            ReactJS, PHP, MySQL, and WordPress. Career shifter, self-managed
            on independent projects, and comfortable collaborating in a team
            — proudly based right here in CDO.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <a
              href="mailto:nichollecera11@gmail.com"
              className="bg-[#acbf00] hover:bg-[#d6eb1d] text-[#0a0a09] px-8 py-4 rounded-xl font-black text-center transition-all shadow-[0_0_20px_rgba(172,191,0,0.25)] hover:shadow-[0_0_30px_rgba(214,235,29,0.4)] hover:-translate-y-0.5"
            >
              Let&apos;s Build Your App
            </a>
            <a
              href="https://github.com/nichollecera11"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#c3afb7]/10 hover:bg-[#c3afb7]/15 text-white border border-[#c3afb7]/20 px-8 py-4 rounded-xl font-bold text-center transition-all hover:-translate-y-0.5"
            >
              GitHub
            </a>
            {/* TODO: drop in your real LinkedIn URL - the CV only had the
                display name "Nichol Lecera" linked, not the raw URL */}
            <a
              href="https://linkedin.com/in/REPLACE-WITH-YOUR-HANDLE"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#c3afb7]/10 hover:bg-[#c3afb7]/15 text-white border border-[#c3afb7]/20 px-8 py-4 rounded-xl font-bold text-center transition-all hover:-translate-y-0.5"
            >
              LinkedIn
            </a>
            <a
              href="https://nichollecera11.rf.gd/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#c3afb7]/10 hover:bg-[#c3afb7]/15 text-white border border-[#c3afb7]/20 px-8 py-4 rounded-xl font-bold text-center transition-all hover:-translate-y-0.5"
            >
              Full Portfolio
            </a>
          </div>
        </div>

        {/* The Story Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#141412] border border-[#c3afb7]/15 p-8 rounded-2xl hover:border-[#c3afb7]/30 transition-colors">
            <div className="text-3xl mb-4">🛵</div>
            <h3 className="text-xl font-bold text-white mb-3">The Hustle</h3>
            <p className="text-[#c3afb7] text-sm leading-relaxed">
              As an active Maxim delivery rider, operating real-world
              logistics gives me a unique edge. I understand business
              bottlenecks, routing efficiency, and exactly what it takes to
              build software that solves actual revenue problems on the
              ground.
            </p>
          </div>

          <div className="bg-[#141412] border border-[#c3afb7]/15 p-8 rounded-2xl hover:border-[#c3afb7]/30 transition-colors">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-3">
              The Engineering
            </h3>
            <p className="text-[#c3afb7] text-sm leading-relaxed">
              From my KodeGo Bootcamp training to working as a Web Developer
              at Itech Media Logic, I build clean architectures using
              Next.js, React, Tailwind CSS, PHP, and custom MySQL databases
              designed for zero latency.
            </p>
          </div>
        </div>

        {/* Work Experience Timeline */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-6">
            Work Experience
          </h2>
          <div className="flex flex-col gap-3">
            {EXPERIENCE.map((job) => (
              <div
                key={job.role + job.org}
                className="bg-[#141412] border border-[#c3afb7]/15 rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6"
              >
                <span className="text-xs font-bold text-[#acbf00] whitespace-nowrap sm:w-36 flex-shrink-0 pt-0.5">
                  {job.period}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">
                    {job.role} <span className="text-[#c3afb7] font-medium">· {job.org}</span>
                  </p>
                  <p className="text-xs text-[#c3afb7] leading-relaxed mt-1">
                    {job.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Project — SwiftBag, the app this page lives in */}
        <div className="bg-[#141412] border border-[#c3afb7]/15 p-8 sm:p-10 rounded-2xl mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d6eb1d]/10 rounded-bl-full blur-2xl pointer-events-none"></div>

          <span className="text-xs font-black text-[#d6eb1d] uppercase tracking-widest block mb-3">
            Live Case Study — You&apos;re Using It Right Now
          </span>
          <h2 className="text-3xl font-black text-white mb-4">
            SwiftBag (formerly ZT Trading)
          </h2>
          <p className="text-[#c3afb7] text-base leading-relaxed mb-8 max-w-2xl">
            A fully custom, mobile-first ordering platform tailored for CDO
            logistics. Engineered with a global state cart (Zustand), live
            client-side search, a dynamic distance-based delivery
            calculator, and a secure admin dashboard. Built to bypass
            membership friction and streamline regional delivery operations.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "React", "Tailwind CSS", "MySQL / Aiven", "Zustand"].map(
              (tech) => (
                <span
                  key={tech}
                  className="bg-[#c3afb7]/10 border border-[#c3afb7]/20 text-white text-xs font-bold px-4 py-1.5 rounded-full"
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Other Project Experience */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">
            More Project Experience
          </h2>
          <p className="text-sm text-[#c3afb7] mb-6">
            Capstone builds and client sites, front-end and back-end.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROJECTS.map((p) => (
              <a
                key={p.name}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#141412] border border-[#c3afb7]/15 rounded-xl p-5 hover:border-[#d6eb1d]/30 transition-colors group"
              >
                <p className="text-sm font-bold text-white group-hover:text-[#d6eb1d] transition-colors">
                  {p.name}
                </p>
                <p className="text-[10px] font-bold text-[#acbf00] uppercase tracking-wide mt-1">
                  {p.org}
                </p>
                <p className="text-xs text-[#c3afb7] leading-relaxed mt-2">
                  {p.detail}
                </p>
                <p className="text-[10px] text-[#c3afb7]/60 mt-3 font-medium">
                  {p.stack}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[#141412] border border-[#c3afb7]/15 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-white mb-6">Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(SKILLS).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-bold text-[#acbf00] uppercase tracking-wide mb-2">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#c3afb7]/10 border border-[#c3afb7]/20 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-6">Education</h2>
          <div className="flex flex-col gap-3">
            <div className="bg-[#141412] border border-[#c3afb7]/15 rounded-xl p-5">
              <p className="text-sm font-bold text-white">
                Associate in Computer Technology (ACT)
              </p>
              <p className="text-xs text-[#c3afb7] mt-1">
                University of Rizal System — Antipolo Campus · 2013–2015
              </p>
            </div>
            <div className="bg-[#141412] border border-[#c3afb7]/15 rounded-xl p-5">
              <p className="text-sm font-bold text-white">
                Full-Stack Web Development Bootcamp
              </p>
              <p className="text-xs text-[#c3afb7] mt-1">
                KodeGo · April – July 2023
              </p>
            </div>
          </div>
        </div>

        {/* Certificates & Credentials — infinite slider */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">
                Certificates &amp; Credentials
              </h2>
              <p className="text-sm text-[#c3afb7]">
                Hover to pause — full set below is also in the Drive folder.
              </p>
            </div>
            <a
              href="https://drive.google.com/drive/folders/1pAh2g_bo0zJ3ihxghBnSWOvQRmGPiG9X?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#acbf00] hover:text-[#d6eb1d] transition-colors whitespace-nowrap"
            >
              View full folder &rarr;
            </a>
          </div>

          <div
            className="sb-marquee-wrap relative overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div className="sb-marquee-track flex gap-4 w-max">
              {/* Rendered twice back-to-back so the loop is seamless */}
              {[...CERTIFICATES, ...CERTIFICATES].map((cert, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-72 bg-[#141412] border border-[#c3afb7]/15 rounded-xl overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-[#0a0a09] overflow-hidden">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-white leading-tight truncate">
                      {cert.name}
                    </p>
                    <p className="text-xs text-[#c3afb7] mt-1 truncate">
                      {cert.issuer}
                    </p>
                    <p className="text-[10px] text-[#c3afb7]/60 mt-1 font-semibold">
                      {cert.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-10 border-t border-[#c3afb7]/15">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to scale your operations?
          </h3>
          <p className="text-[#c3afb7] text-base font-medium mb-6">
            Looking for a developer who understands both code and business
            logistics?
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