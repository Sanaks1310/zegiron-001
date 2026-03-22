/**
 * Simplified world map outline focused on the North Sea / UK / Northern Europe region
 * for a tactical radar display background.
 */
export function WorldMapSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full z-0 opacity-25"
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(145 50% 30%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(145 40% 20%)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Great Britain */}
      <path
        d="M280,180 L290,170 L310,165 L320,155 L335,150 L340,140 L330,125 L325,110 L315,100 
           L305,95 L295,100 L285,110 L275,120 L265,130 L260,140 L255,150 L258,160 
           L262,170 L270,178 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />
      {/* Scotland */}
      <path
        d="M280,100 L275,85 L270,75 L265,70 L260,60 L255,55 L248,58 L242,65 
           L240,75 L245,82 L250,90 L260,95 L270,98 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />
      {/* Ireland */}
      <path
        d="M200,130 L210,120 L220,115 L230,118 L235,125 L238,135 L235,148 
           L228,158 L218,162 L208,158 L200,148 L195,140 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />

      {/* Norway */}
      <path
        d="M420,20 L415,35 L410,50 L405,65 L395,80 L388,95 L385,110 L390,120 
           L400,115 L410,105 L418,90 L425,75 L430,60 L435,45 L438,30 L432,22 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />
      {/* Sweden */}
      <path
        d="M440,25 L445,40 L448,60 L450,80 L452,100 L455,120 L458,140 L460,155 
           L470,160 L478,150 L480,130 L478,110 L475,90 L472,70 L468,50 L462,35 
           L455,25 L448,22 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />
      {/* Denmark */}
      <path
        d="M390,140 L395,135 L400,130 L408,128 L415,132 L418,140 L415,148 
           L408,152 L400,150 L394,146 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />
      {/* Denmark - Jutland */}
      <path
        d="M385,148 L388,140 L392,132 L398,125 L402,120 L405,115 L400,112 
           L392,115 L385,122 L380,132 L378,142 L380,150 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />

      {/* Netherlands / Belgium / France coast */}
      <path
        d="M340,175 L355,170 L370,168 L385,165 L400,162 L405,170 L400,178 
           L390,185 L375,190 L360,195 L345,198 L335,195 L330,188 L332,180 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />
      {/* France */}
      <path
        d="M250,195 L270,190 L290,188 L310,190 L330,195 L345,200 L360,205 
           L370,215 L375,230 L370,250 L360,265 L345,275 L325,280 L305,278 
           L285,270 L265,260 L250,248 L240,235 L235,220 L238,205 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />

      {/* Germany / Poland */}
      <path
        d="M400,165 L420,162 L445,160 L470,162 L495,165 L520,168 L540,172 
           L545,185 L540,200 L530,210 L515,215 L495,212 L475,208 L455,205 
           L435,200 L415,195 L400,190 L395,180 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />

      {/* Iberian Peninsula */}
      <path
        d="M180,280 L200,270 L225,265 L250,262 L270,268 L285,278 L290,295 
           L285,315 L275,330 L260,340 L240,345 L220,342 L200,335 L185,322 
           L175,308 L172,295 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />

      {/* Italy boot shape */}
      <path
        d="M420,240 L430,235 L440,240 L445,255 L448,270 L445,285 L440,300 
           L435,315 L428,325 L420,330 L415,320 L418,305 L422,290 L425,275 
           L422,260 L418,248 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />

      {/* Iceland */}
      <path
        d="M120,30 L135,25 L152,28 L160,38 L155,50 L142,55 L128,52 L118,44 L115,35 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />

      {/* North Africa coast */}
      <path
        d="M150,380 L200,370 L260,360 L320,355 L380,352 L440,350 L500,352 
           L560,358 L600,365 L600,400 L550,395 L500,390 L440,388 L380,390 
           L320,395 L260,400 L200,405 L150,410 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.35)"
        strokeWidth="0.8"
      />

      {/* Coordinate grid labels */}
      <text x="50" y="60" fill="hsl(217 95% 58% / 0.15)" fontSize="8" fontFamily="monospace">60°N</text>
      <text x="50" y="140" fill="hsl(217 95% 58% / 0.15)" fontSize="8" fontFamily="monospace">55°N</text>
      <text x="50" y="220" fill="hsl(217 95% 58% / 0.15)" fontSize="8" fontFamily="monospace">50°N</text>
      <text x="50" y="300" fill="hsl(217 95% 58% / 0.15)" fontSize="8" fontFamily="monospace">45°N</text>
      <text x="50" y="380" fill="hsl(217 95% 58% / 0.15)" fontSize="8" fontFamily="monospace">40°N</text>

      <text x="200" y="695" fill="hsl(217 95% 58% / 0.15)" fontSize="8" fontFamily="monospace">10°W</text>
      <text x="350" y="695" fill="hsl(217 95% 58% / 0.15)" fontSize="8" fontFamily="monospace">0°</text>
      <text x="500" y="695" fill="hsl(217 95% 58% / 0.15)" fontSize="8" fontFamily="monospace">10°E</text>
      <text x="650" y="695" fill="hsl(217 95% 58% / 0.15)" fontSize="8" fontFamily="monospace">20°E</text>

      {/* Horizontal lat lines */}
      {[60, 140, 220, 300, 380].map((y) => (
        <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="hsl(217 95% 58% / 0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Vertical lon lines */}
      {[200, 350, 500, 650, 800].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="700" stroke="hsl(217 95% 58% / 0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
    </svg>
  );
}
