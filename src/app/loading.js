export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center p-4 w-full">
      <div className="flex flex-col items-center gap-6 relative">
        
        {/* The Animated Icon Container */}
        <div className="relative flex items-center justify-center w-24 h-24 bg-[#c3afb7]/10 rounded-full border border-[#c3afb7]/20 shadow-[0_0_30px_rgba(214,235,29,0.1)]">
          {/* Bouncing Shopping Bag */}
          <span className="text-5xl animate-bounce pt-2">🛍️</span>
          
          {/* Fast Spinning Accent Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#d6eb1d] animate-spin"></div>
        </div>

        {/* Brand Text & Pulsing Status */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-wider text-white uppercase italic">
            Swift<span className="text-[#d6eb1d]">Bag</span>
          </h1>
          <p className="text-[#c3afb7] text-sm font-medium animate-pulse tracking-wide">
            Packing your essentials...
          </p>
        </div>

      </div>
    </div>
  );
}