import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-8 no-underline text-white">
              <span className="material-symbols-outlined text-4xl text-primary">rocket_launch</span>
              <span className="text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: '"Playfair Display", serif' }}>
                Calgary Best
              </span>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed">
              The definitive guide to city culture, hidden gems, and the viral moments that define modern Calgary.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-primary">Navigation</h4>
            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              <Link href="/categories/culture" className="hover:text-white transition-colors no-underline text-gray-400">Culture</Link>
              <Link href="/categories/food-drink" className="hover:text-white transition-colors no-underline text-gray-400">Food + Drink</Link>
              <Link href="/categories/city-life" className="hover:text-white transition-colors no-underline text-gray-400">City Life</Link>
              <Link href="/admin" className="hover:text-white transition-colors no-underline text-gray-400">Admin</Link>
            </div>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-primary">Connect</h4>
            <div className="flex gap-4">
              {["public", "camera", "video_library"].map((icon) => (
                <div
                  key={icon}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600">
            &copy; {new Date().getFullYear()} CALGARY BEST MEDIA GROUP. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
