/**
 * Reusable inline SVG <symbol> defs for vehicle silhouettes.
 * Ported from the design prototype's <defs> block; consumed via <use href="#silh-sedan"/>.
 */
export default function SilhouetteDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="silh-sedan" viewBox="0 0 320 120">
          <ellipse cx="160" cy="106" rx="125" ry="4" fill="rgba(0,0,0,0.32)" />
          <path d="M 25 78 L 25 95 Q 30 102 50 102 L 270 102 Q 290 102 295 95 L 295 78 Z" fill="#f4f1e5" opacity="0.95" />
          <path d="M 82 78 Q 100 32 145 28 L 195 28 Q 235 32 252 78 Z" fill="#f4f1e5" opacity="0.95" />
          <path d="M 92 72 Q 105 36 142 33 L 142 72 Z" fill="rgba(10,18,30,0.55)" />
          <path d="M 148 33 L 192 33 L 192 72 L 148 72 Z" fill="rgba(10,18,30,0.55)" />
          <path d="M 198 33 L 225 33 Q 240 42 247 72 L 198 72 Z" fill="rgba(10,18,30,0.55)" />
          <rect x="142" y="30" width="8" height="44" fill="#f4f1e5" opacity="0.95" />
          <circle cx="78" cy="100" r="14" fill="rgba(15,15,15,0.95)" />
          <circle cx="78" cy="100" r="7.5" fill="rgba(255,255,255,0.18)" />
          <circle cx="78" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <circle cx="245" cy="100" r="14" fill="rgba(15,15,15,0.95)" />
          <circle cx="245" cy="100" r="7.5" fill="rgba(255,255,255,0.18)" />
          <circle cx="245" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <rect x="286" y="82" width="9" height="6" rx="1" fill="rgba(255,248,210,0.9)" />
          <rect x="25" y="82" width="9" height="6" rx="1" fill="rgba(210,40,40,0.9)" />
        </symbol>

        <symbol id="silh-suv" viewBox="0 0 320 120">
          <ellipse cx="160" cy="106" rx="128" ry="4" fill="rgba(0,0,0,0.32)" />
          <path d="M 30 75 L 30 95 Q 35 102 55 102 L 265 102 Q 285 102 290 95 L 290 75 Z" fill="#f4f1e5" opacity="0.95" />
          <path d="M 60 75 Q 65 28 120 22 L 220 22 Q 265 26 280 75 Z" fill="#f4f1e5" opacity="0.95" />
          <path d="M 68 70 Q 75 30 118 27 L 118 70 Z" fill="rgba(10,18,30,0.55)" />
          <path d="M 124 27 L 180 27 L 180 70 L 124 70 Z" fill="rgba(10,18,30,0.55)" />
          <path d="M 186 27 L 235 27 Q 265 32 275 70 L 186 70 Z" fill="rgba(10,18,30,0.55)" />
          <rect x="118" y="25" width="6" height="48" fill="#f4f1e5" opacity="0.95" />
          <rect x="180" y="25" width="6" height="48" fill="#f4f1e5" opacity="0.95" />
          <rect x="70" y="20" width="200" height="3" fill="#f4f1e5" opacity="0.85" />
          <circle cx="78" cy="100" r="16" fill="rgba(15,15,15,0.95)" />
          <circle cx="78" cy="100" r="9" fill="rgba(255,255,255,0.18)" />
          <circle cx="78" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <circle cx="245" cy="100" r="16" fill="rgba(15,15,15,0.95)" />
          <circle cx="245" cy="100" r="9" fill="rgba(255,255,255,0.18)" />
          <circle cx="245" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <path d="M 62 100 Q 62 80 78 80 Q 94 80 94 100 Z" fill="rgba(0,0,0,0.35)" />
          <path d="M 229 100 Q 229 80 245 80 Q 261 80 261 100 Z" fill="rgba(0,0,0,0.35)" />
          <rect x="282" y="78" width="9" height="8" rx="1" fill="rgba(255,248,210,0.9)" />
          <rect x="30" y="78" width="9" height="8" rx="1" fill="rgba(210,40,40,0.9)" />
        </symbol>

        <symbol id="silh-minivan" viewBox="0 0 320 120">
          <ellipse cx="160" cy="106" rx="130" ry="4" fill="rgba(0,0,0,0.32)" />
          <path d="M 25 75 L 25 95 Q 30 102 50 102 L 270 102 Q 290 102 295 95 L 295 75 Z" fill="#f4f1e5" opacity="0.95" />
          <path d="M 55 75 Q 60 35 95 28 L 245 28 Q 280 30 285 75 Z" fill="#f4f1e5" opacity="0.95" />
          <path d="M 62 70 Q 68 36 92 32 L 92 70 Z" fill="rgba(10,18,30,0.55)" />
          <path d="M 98 32 L 165 32 L 165 70 L 98 70 Z" fill="rgba(10,18,30,0.55)" />
          <path d="M 171 32 L 240 32 L 240 70 L 171 70 Z" fill="rgba(10,18,30,0.55)" />
          <path d="M 246 32 Q 275 34 282 70 L 246 70 Z" fill="rgba(10,18,30,0.55)" />
          <rect x="92" y="30" width="6" height="44" fill="#f4f1e5" opacity="0.95" />
          <rect x="165" y="30" width="6" height="44" fill="#f4f1e5" opacity="0.95" />
          <rect x="240" y="30" width="6" height="44" fill="#f4f1e5" opacity="0.95" />
          <circle cx="78" cy="100" r="15" fill="rgba(15,15,15,0.95)" />
          <circle cx="78" cy="100" r="8" fill="rgba(255,255,255,0.18)" />
          <circle cx="78" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <circle cx="245" cy="100" r="15" fill="rgba(15,15,15,0.95)" />
          <circle cx="245" cy="100" r="8" fill="rgba(255,255,255,0.18)" />
          <circle cx="245" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <rect x="120" y="78" width="60" height="2" fill="rgba(0,0,0,0.32)" />
          <rect x="286" y="78" width="9" height="8" rx="1" fill="rgba(255,248,210,0.9)" />
          <rect x="25" y="78" width="9" height="8" rx="1" fill="rgba(210,40,40,0.9)" />
        </symbol>

        <symbol id="silh-passenger" viewBox="0 0 320 120">
          <ellipse cx="160" cy="106" rx="135" ry="4" fill="rgba(0,0,0,0.32)" />
          <path d="M 20 22 L 20 95 Q 25 102 45 102 L 275 102 Q 295 102 300 95 L 300 30 Q 295 22 280 20 L 260 20 Q 245 24 245 28 L 245 102 Z" fill="#f4f1e5" opacity="0.95" />
          <path d="M 252 26 Q 275 30 296 38 L 296 64 L 252 64 Z" fill="rgba(10,18,30,0.55)" />
          <rect x="40" y="28" width="34" height="32" rx="2" fill="rgba(10,18,30,0.55)" />
          <rect x="80" y="28" width="34" height="32" rx="2" fill="rgba(10,18,30,0.55)" />
          <rect x="120" y="28" width="34" height="32" rx="2" fill="rgba(10,18,30,0.55)" />
          <rect x="160" y="28" width="34" height="32" rx="2" fill="rgba(10,18,30,0.55)" />
          <rect x="200" y="28" width="38" height="32" rx="2" fill="rgba(10,18,30,0.55)" />
          <circle cx="291" cy="60" r="4" fill="rgba(255,255,255,0.5)" />
          <circle cx="68" cy="100" r="16" fill="rgba(15,15,15,0.95)" />
          <circle cx="68" cy="100" r="9" fill="rgba(255,255,255,0.18)" />
          <circle cx="68" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <circle cx="255" cy="100" r="16" fill="rgba(15,15,15,0.95)" />
          <circle cx="255" cy="100" r="9" fill="rgba(255,255,255,0.18)" />
          <circle cx="255" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <line x1="155" y1="65" x2="155" y2="98" stroke="rgba(0,0,0,0.28)" strokeWidth="1" />
          <rect x="292" y="78" width="8" height="8" rx="1" fill="rgba(255,248,210,0.9)" />
          <rect x="20" y="78" width="8" height="8" rx="1" fill="rgba(210,40,40,0.9)" />
        </symbol>

        <symbol id="silh-cargo" viewBox="0 0 320 120">
          <ellipse cx="160" cy="106" rx="135" ry="4" fill="rgba(0,0,0,0.32)" />
          <path d="M 20 22 L 20 95 Q 25 102 45 102 L 275 102 Q 295 102 300 95 L 300 30 Q 295 22 280 20 L 260 20 Q 245 24 245 28 L 245 102 Z" fill="#f4f1e5" opacity="0.95" />
          <path d="M 252 26 Q 275 30 296 38 L 296 64 L 252 64 Z" fill="rgba(10,18,30,0.55)" />
          <rect x="212" y="28" width="32" height="32" rx="2" fill="rgba(10,18,30,0.55)" />
          <line x1="40" y1="60" x2="208" y2="60" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
          <line x1="120" y1="22" x2="120" y2="98" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          <line x1="200" y1="22" x2="200" y2="98" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
          <circle cx="291" cy="60" r="4" fill="rgba(255,255,255,0.5)" />
          <circle cx="68" cy="100" r="16" fill="rgba(15,15,15,0.95)" />
          <circle cx="68" cy="100" r="9" fill="rgba(255,255,255,0.18)" />
          <circle cx="68" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <circle cx="255" cy="100" r="16" fill="rgba(15,15,15,0.95)" />
          <circle cx="255" cy="100" r="9" fill="rgba(255,255,255,0.18)" />
          <circle cx="255" cy="100" r="3" fill="rgba(15,15,15,0.95)" />
          <rect x="292" y="78" width="8" height="8" rx="1" fill="rgba(255,248,210,0.9)" />
          <rect x="20" y="78" width="8" height="8" rx="1" fill="rgba(210,40,40,0.9)" />
        </symbol>
      </defs>
    </svg>
  );
}
