import Link from "next/link";
import Image from "next/image";

export default function OfficialStatement() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full">
        {/* Return Button */}
        <Link
          href="/"
          className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 inline-block hover:text-gray-900 transition-colors"
        >
          ← Return to Homepage
        </Link>

        {/* The Official Document Frame */}
        <div className="bg-white border-t-4 border-black pt-12 pb-20 px-8 sm:px-16 shadow-xl text-center">
          {/* 📍 CLUB CREST / LOGO HERE */}
          <div className="flex justify-center mb-8">
            <img
              src="/images/new_logo.jpg"
              alt="Club Logo"
              className="h-32 sm:h-48 w-auto object-contain opacity-90"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] text-gray-900 mb-10 border-b border-gray-100 pb-6">
            Official Statement
          </h1>

          {/* Date and Location */}
          <div className="text-right mb-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Cagayan de Oro City
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              July 31, 2026
            </p>
          </div>

          {/* Statement Body */}
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-gray-800 text-justify font-serif">
            <p>
              <strong>Adogs Football Club</strong> deeply laments the passing of{" "}
              <strong>Gereme Valdez</strong>, a cherished player and beloved
              member of our local football family, who tragically lost his life
              in a motorcycle accident yesterday.
            </p>
            <p>
              The club wishes to express its deepest condolences and its utmost
              affection to his family, his loved ones, and all of his teammates
              during this incredibly difficult time.
            </p>
            <p>
              His passion, dedication, and spirit on the pitch will forever
              remain in the memory of our club and the Cagayan de Oro football
              community.
            </p>
            <p className="font-black pt-8 text-center text-gray-900 uppercase tracking-widest text-sm">
              May he rest in peace.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
