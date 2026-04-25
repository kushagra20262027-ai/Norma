export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-950 rounded-none flex items-center justify-center">
            <div className="w-3 h-3 bg-zinc-950 rounded-full" />
          </div>
          <h1 className="font-black text-xl tracking-tight text-zinc-950 uppercase leading-none">
            NORMA
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">
            ● Secure Edge-AI Processing • v1.0.0
          </div>
        </div>
      </div>
    </header>
  );
}
