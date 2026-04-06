/**
 * Complete world map SVG showing all continents with country outlines
 * for a tactical green radar display background.
 */
export function WorldMapSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full z-0 opacity-25 ${className}`}
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(145 60% 40%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(145 50% 25%)" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="landGradBright" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(145 65% 45%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(145 55% 30%)" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* North America */}
      {/* Canada / Alaska */}
      <path
        d="M60,80 L80,65 L100,55 L130,50 L155,48 L175,50 L195,55 L210,52 L225,48 
           L240,50 L250,55 L248,65 L240,75 L235,85 L230,95 L225,100 L215,105 
           L200,108 L185,112 L170,115 L155,112 L140,108 L125,105 L110,100 
           L95,95 L82,90 L70,85 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* USA */}
      <path
        d="M80,100 L95,95 L110,100 L130,108 L150,112 L170,115 L185,118 L200,120 
           L215,115 L225,108 L235,102 L240,110 L242,120 L240,130 L235,140 
           L228,148 L218,155 L205,158 L190,160 L175,162 L158,160 L140,155 
           L122,150 L105,148 L92,145 L82,140 L75,132 L72,122 L74,112 L78,105 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Alaska */}
      <path
        d="M30,70 L45,62 L58,65 L65,72 L60,80 L48,82 L38,78 L32,74 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Mexico */}
      <path
        d="M82,155 L100,152 L118,155 L135,160 L148,165 L158,170 L165,178 
           L168,188 L165,198 L158,205 L148,208 L135,205 L120,200 L108,195 
           L98,188 L90,178 L85,168 L82,160 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />

      {/* Central America */}
      <path
        d="M158,208 L165,212 L172,218 L178,225 L182,232 L185,240 L180,242 
           L175,238 L168,232 L162,225 L158,218 L155,212 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />

      {/* Caribbean - Cuba */}
      <path
        d="M170,195 L182,192 L195,190 L208,192 L215,196 L210,200 L198,202 L185,200 L175,198 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />

      {/* South America */}
      <path
        d="M185,245 L200,238 L218,235 L235,238 L250,245 L262,255 L270,268 
           L278,285 L282,305 L280,325 L275,345 L268,362 L258,378 L248,390 
           L235,398 L222,402 L210,400 L200,395 L192,385 L188,372 L185,355 
           L182,335 L180,315 L178,295 L180,275 L182,258 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Brazil bulge */}
      <path
        d="M235,238 L255,235 L275,238 L290,245 L300,258 L305,272 L302,288 
           L295,302 L285,310 L278,305 L270,295 L262,280 L255,265 L248,252 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />

      {/* Greenland */}
      <path
        d="M270,25 L285,20 L305,18 L320,22 L330,30 L335,42 L332,55 L325,65 
           L312,72 L298,70 L285,65 L275,55 L268,42 L265,32 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />

      {/* Europe */}
      {/* Iceland */}
      <path
        d="M365,52 L375,48 L388,50 L395,56 L392,64 L382,68 L372,65 L366,58 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />
      {/* Great Britain */}
      <path
        d="M410,82 L415,75 L422,70 L430,68 L435,72 L432,80 L428,88 L422,95 
           L416,100 L410,98 L407,92 L408,86 Z"
        fill="url(#landGradBright)"
        stroke="hsl(145 60% 45% / 0.5)"
        strokeWidth="0.6"
      />
      {/* Ireland */}
      <path
        d="M395,85 L402,80 L408,82 L410,88 L407,95 L400,98 L394,95 L392,90 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />
      {/* Scandinavia - Norway/Sweden */}
      <path
        d="M450,30 L455,38 L458,48 L460,60 L462,72 L465,82 L468,92 L470,100 
           L475,95 L478,85 L480,72 L478,58 L475,45 L470,35 L462,28 L455,25 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Finland */}
      <path
        d="M480,35 L488,32 L495,38 L498,50 L500,65 L498,78 L495,88 L488,92 
           L482,85 L478,72 L476,58 L478,45 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Western Europe - France/Germany/Spain/Italy */}
      <path
        d="M420,102 L435,98 L450,100 L465,102 L478,105 L490,108 L500,112 
           L505,120 L502,130 L495,138 L485,142 L475,140 L462,135 L448,132 
           L435,130 L425,128 L418,122 L415,112 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Iberian Peninsula */}
      <path
        d="M398,130 L410,125 L422,128 L428,135 L425,145 L418,155 L408,160 
           L398,158 L390,150 L388,140 L392,134 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Italy */}
      <path
        d="M458,135 L462,130 L468,132 L472,140 L470,150 L466,160 L460,168 
           L455,172 L452,165 L454,155 L456,145 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />
      {/* Eastern Europe / Russia west */}
      <path
        d="M500,60 L520,55 L545,52 L570,55 L590,60 L605,68 L615,78 L620,90 
           L618,105 L610,118 L600,125 L585,128 L568,125 L550,120 L535,115 
           L520,112 L508,108 L502,100 L498,88 L496,75 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Greece/Turkey */}
      <path
        d="M490,145 L505,140 L520,138 L535,140 L545,145 L548,152 L542,158 
           L530,160 L518,158 L505,155 L495,152 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />

      {/* Africa */}
      <path
        d="M400,175 L420,170 L445,168 L470,170 L495,172 L520,175 L540,180 
           L555,190 L565,205 L570,222 L572,242 L570,262 L565,282 L558,300 
           L548,318 L535,332 L520,342 L502,348 L485,350 L468,348 L452,342 
           L438,332 L428,318 L420,302 L415,285 L412,268 L410,250 L408,232 
           L405,215 L402,198 L400,185 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Madagascar */}
      <path
        d="M575,310 L580,305 L585,308 L588,318 L585,328 L580,335 L575,332 L572,322 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />

      {/* Russia / Central Asia */}
      <path
        d="M620,40 L660,35 L700,32 L740,30 L780,32 L820,35 L855,40 L880,48 
           L895,58 L900,72 L895,85 L885,95 L870,102 L850,108 L825,112 L800,115 
           L775,118 L748,120 L720,118 L695,115 L670,112 L648,108 L630,100 
           L620,90 L616,78 L615,65 L616,52 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Siberia extension */}
      <path
        d="M855,25 L880,20 L905,18 L930,20 L950,25 L965,32 L975,42 L978,55 
           L972,65 L960,72 L945,75 L928,72 L910,68 L895,62 L880,55 L868,45 
           L858,35 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />

      {/* Middle East */}
      <path
        d="M548,152 L568,148 L585,150 L600,155 L612,162 L618,172 L615,185 
           L608,195 L598,200 L585,202 L572,198 L560,192 L552,182 L548,170 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Arabian Peninsula */}
      <path
        d="M570,195 L585,192 L598,195 L608,202 L615,212 L618,225 L612,235 
           L600,240 L588,238 L578,232 L570,222 L568,210 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />

      {/* India */}
      <path
        d="M650,145 L665,140 L680,142 L695,148 L705,158 L710,172 L708,188 
           L702,205 L692,220 L680,232 L668,238 L655,235 L645,225 L638,212 
           L635,198 L635,182 L638,168 L642,155 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Sri Lanka */}
      <path
        d="M680,242 L685,238 L690,240 L692,248 L688,255 L682,252 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.4"
      />

      {/* China */}
      <path
        d="M720,80 L745,75 L770,72 L795,75 L820,80 L840,88 L852,98 L858,112 
           L855,125 L845,138 L832,148 L815,155 L795,158 L775,160 L755,158 
           L738,152 L722,145 L710,135 L705,122 L708,108 L712,95 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Mongolia */}
      <path
        d="M740,70 L765,65 L790,62 L815,65 L835,70 L845,78 L842,85 L830,88 
           L812,85 L792,82 L772,78 L755,75 L745,72 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.3)"
        strokeWidth="0.5"
      />

      {/* Southeast Asia */}
      <path
        d="M760,170 L775,165 L790,168 L802,175 L808,185 L805,198 L798,208 
           L788,215 L775,218 L762,215 L752,208 L748,198 L750,185 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* Malaysia / Indonesia */}
      <path
        d="M770,228 L782,225 L795,228 L808,232 L820,238 L835,245 L848,252 
           L855,260 L848,265 L835,262 L820,258 L805,255 L790,252 L778,248 
           L770,242 L768,235 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />
      {/* Philippines */}
      <path
        d="M835,185 L840,180 L845,182 L848,190 L845,200 L840,205 L835,200 L832,192 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.4"
      />

      {/* Japan */}
      <path
        d="M870,90 L878,85 L885,88 L890,95 L892,105 L888,115 L882,122 
           L875,125 L870,120 L868,110 L866,100 Z"
        fill="url(#landGradBright)"
        stroke="hsl(145 60% 45% / 0.5)"
        strokeWidth="0.5"
      />
      {/* Hokkaido */}
      <path
        d="M878,78 L885,75 L890,78 L892,85 L888,90 L882,88 L878,82 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.4"
      />
      {/* Korea */}
      <path
        d="M855,100 L860,95 L865,98 L868,108 L865,118 L858,122 L852,115 L852,108 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.4"
      />
      {/* Taiwan */}
      <path
        d="M845,158 L850,155 L854,158 L855,165 L852,170 L848,168 L845,162 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.4"
      />

      {/* Australia */}
      <path
        d="M800,310 L825,300 L852,295 L878,298 L900,305 L918,315 L928,330 
           L932,348 L928,365 L918,378 L905,388 L888,395 L868,398 L848,395 
           L830,388 L815,378 L805,365 L800,348 L798,330 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.6"
      />
      {/* New Zealand */}
      <path
        d="M952,370 L958,365 L962,368 L965,378 L962,390 L958,398 L952,395 L950,385 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.4"
      />
      {/* Papua New Guinea */}
      <path
        d="M880,268 L895,262 L910,265 L918,272 L915,280 L905,285 L892,282 L882,278 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />

      {/* Borneo */}
      <path
        d="M800,245 L812,240 L822,242 L828,250 L825,258 L815,262 L805,260 L798,252 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />
      {/* Sumatra */}
      <path
        d="M755,248 L762,242 L770,245 L775,255 L772,268 L765,275 L758,272 L755,260 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.5"
      />
      {/* Java */}
      <path
        d="M775,278 L790,275 L805,278 L815,282 L808,288 L795,290 L782,288 L775,284 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.4)"
        strokeWidth="0.4"
      />

      {/* Antarctica hint */}
      <path
        d="M100,480 L200,475 L350,472 L500,470 L650,472 L800,475 L900,480 
           L900,500 L100,500 Z"
        fill="url(#landGrad)"
        stroke="hsl(145 60% 45% / 0.2)"
        strokeWidth="0.4"
        opacity="0.4"
      />

      {/* Latitude grid lines */}
      {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="hsl(145 60% 45% / 0.06)" strokeWidth="0.4" strokeDasharray="3 6" />
      ))}
      {/* Longitude grid lines */}
      {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="hsl(145 60% 45% / 0.06)" strokeWidth="0.4" strokeDasharray="3 6" />
      ))}

      {/* Coordinate labels */}
      <text x="15" y="55" fill="hsl(145 60% 45% / 0.15)" fontSize="7" fontFamily="monospace">60°N</text>
      <text x="15" y="105" fill="hsl(145 60% 45% / 0.15)" fontSize="7" fontFamily="monospace">45°N</text>
      <text x="15" y="155" fill="hsl(145 60% 45% / 0.15)" fontSize="7" fontFamily="monospace">30°N</text>
      <text x="15" y="255" fill="hsl(145 60% 45% / 0.15)" fontSize="7" fontFamily="monospace">EQ</text>
      <text x="15" y="355" fill="hsl(145 60% 45% / 0.15)" fontSize="7" fontFamily="monospace">30°S</text>
      <text x="15" y="455" fill="hsl(145 60% 45% / 0.15)" fontSize="7" fontFamily="monospace">60°S</text>
    </svg>
  );
}
