import { useState, useMemo, useEffect } from "react";
import {
  LayoutGrid,
  Salad,
  Flame,
  Sprout,
  UtensilsCrossed,
  IceCream,
  Coffee,
  X,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "veg-starter", label: "Veg Starters", icon: Salad },
  { id: "nonveg-starter", label: "Non-Veg Starters", icon: Flame },
  { id: "veg-main", label: "Veg Mains", icon: Sprout },
  { id: "nonveg-main", label: "Non-Veg Mains", icon: UtensilsCrossed },
  { id: "dessert", label: "Desserts", icon: IceCream },
  { id: "beverage", label: "Beverages", icon: Coffee },
];

function DietMark({ veg }) {
  return (
    <span
      className={`inline-flex h-3 w-3 flex-none items-center justify-center border ${
        veg ? "border-emerald-500/70" : "border-rose-500/70"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${veg ? "bg-emerald-500/70" : "bg-rose-500/70"}`} />
    </span>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/menu.json")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Failed to load menu:", err));
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const activeLabel = CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "All";

  const radius = 132;
  const startAngle = 185;
  const endAngle = 270;
  const arcCategories = CATEGORIES.filter((c) => c.id !== "all");
  const angleStep = (endAngle - startAngle) / (arcCategories.length - 1);

  return (
    <div
      className="relative min-h-screen w-full bg-[#12100D] text-[#EDE7DA]"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      {/* Header */}
      <header className="mx-auto max-w-xl px-6 pt-14 pb-8 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8935A]">
          Est. Digital Menu
        </p>
        <h1
          className="mt-3 text-4xl italic"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          Spice Route Kitchen
        </h1>
        <div className="mx-auto mt-5 h-px w-16 bg-[#B8935A]/60" />
      </header>

      {/* Category label */}
      <div className="mx-auto max-w-xl px-6 pb-2 text-center">
        <span
          className="text-xs tracking-[0.25em] uppercase text-[#B8935A]"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          {activeLabel}
        </span>
      </div>

      {/* Menu list */}
      <main className="mx-auto max-w-xl px-6 pb-32 pt-6">
        {items.length === 0 ? (
          <p className="mt-16 text-center text-sm text-[#8A8577]">
            Loading menu ...
          </p>
        ) : (
          <ul className="flex flex-col gap-7">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <div className="flex items-baseline gap-2">
                  <DietMark veg={item.veg} />
                  <h3
                    className="whitespace-nowrap text-lg leading-none"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                  >
                    {item.name}
                  </h3>
                  <span
                    className="flex-1 border-b border-dotted border-[#B8935A]/40"
                    style={{ transform: "translateY(-3px)" }}
                  />
                  <span
                    className="whitespace-nowrap text-lg text-[#D9BE84]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                  >
                    ₹{item.price}
                  </span>
                </div>
                <p className="mt-1.5 pl-5 text-[13px] italic leading-snug text-[#9A9284]">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Backdrop */}
      {sheetOpen && (
        <button
          aria-label="Close category menu"
          onClick={() => setSheetOpen(false)}
          className="fixed inset-0 z-30 bg-black/50"
        />
      )}

      {/* Fan-out category arc */}
      <div className="fixed bottom-24 right-8 z-40">
        {arcCategories.map((cat, i) => {
          const angleDeg = startAngle + angleStep * i;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSheetOpen(false);
              }}
              className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
                isActive
                  ? "border-[#B8935A] bg-[#B8935A] text-[#12100D]"
                  : "border-[#B8935A]/50 bg-[#1B1712] text-[#D9BE84]"
              }`}
              style={{
                left: sheetOpen ? x : 0,
                bottom: sheetOpen ? y : 0,
                opacity: sheetOpen ? 1 : 0,
                pointerEvents: sheetOpen ? "auto" : "none",
                transitionDelay: sheetOpen ? `${i * 30}ms` : "0ms",
              }}
              title={cat.label}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setSheetOpen((v) => !v)}
        className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-[#B8935A] bg-[#1B1712] text-[#D9BE84] shadow-[0_0_0_1px_rgba(184,147,90,0.15)] transition-transform active:scale-95"
        aria-label={sheetOpen ? "Close categories" : "Browse categories"}
      >
        {sheetOpen ? <X className="h-6 w-6" /> : <LayoutGrid className="h-6 w-6" />}
      </button>
    </div>
  );
}