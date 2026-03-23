export const Background = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-base pointer-events-none select-none">
    {/* Foundation Gradient - Subtle transition from center */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.08)_0%,transparent_50%)]" />
    
    {/* The Mesh Gradients from Hero - Globalized and animated */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[200vh] opacity-[0.15] blur-[150px]">
      <div className="absolute top-1/4 left-1/4 w-[1000px] h-[1000px] bg-primary/30 rounded-full animate-mesh blur-[250px]" />
      <div className="absolute top-1/2 right-1/4 w-[900px] h-[900px] bg-secondary/20 rounded-full animate-mesh blur-[250px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[800px] h-[800px] bg-accent/15 rounded-full animate-mesh blur-[250px]" />
    </div>

    {/* Professional Grid - Larger and more subtle for depth */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_50%_50%,black_20%,transparent_100%)]" />
    
    {/* Micro Noise for that ELITE texture */}
    <div className="absolute inset-0 opacity-[0.02] grainy-bg" />
    
    {/* Bottom Glow for balance */}
    <div className="absolute bottom-[-10%] left-0 right-0 h-[40vh] bg-gradient-to-t from-primary/5 to-transparent blur-[120px]" />
  </div>
);
