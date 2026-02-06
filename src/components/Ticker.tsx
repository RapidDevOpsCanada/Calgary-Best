"use client";

const tickerItems = [
  { icon: "bolt", text: "BREAKING NOW: 5 New Festivals Announced for Summer" },
  { icon: "warning", text: "TRAFFIC ALERT: Deerfoot Trail Cleared" },
  { icon: "sunny", text: "WEATHER: Calgary Sun is Here! 28°C" },
  { icon: "trending_up", text: "VIRAL: The Secret Rooftop Bar You Didn't Know Existed" },
];

export default function Ticker() {
  return (
    <div className="w-full bg-primary py-1.5 overflow-hidden sticky top-0 z-50">
      <div className="ticker-scroll flex gap-12 items-center">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span
            key={i}
            className="text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-xs">{item.icon}</span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
