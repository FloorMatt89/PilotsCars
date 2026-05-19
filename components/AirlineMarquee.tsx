"use client";

/**
 * Infinite-scrolling airline logo band.
 *
 * Logos are pulled from the Kiwi.com public airline-logo CDN by IATA code.
 * If a logo 404s or the CDN is unreachable, the onError handler hides the
 * <img> and reveals a styled text wordmark in its place — so the band
 * degrades to a clean typographic marquee instead of broken-image icons
 * (same graceful-fallback pattern the design system uses for vehicle tiles).
 *
 * The track renders the list twice and the CSS animation translates it by
 * -50%, so the loop is seamless.
 */

type Airline = { name: string; iata: string };

const AIRLINES: Airline[] = [
  // US mainline + low-cost
  { name: "American Airlines", iata: "AA" },
  { name: "Delta Air Lines", iata: "DL" },
  { name: "United Airlines", iata: "UA" },
  { name: "Southwest Airlines", iata: "WN" },
  { name: "Alaska Airlines", iata: "AS" },
  { name: "JetBlue Airways", iata: "B6" },
  { name: "Hawaiian Airlines", iata: "HA" },
  { name: "Frontier Airlines", iata: "F9" },
  { name: "Spirit Airlines", iata: "NK" },
  { name: "Sun Country Airlines", iata: "SY" },
  { name: "Allegiant Air", iata: "G4" },
  { name: "Breeze Airways", iata: "MX" },
  { name: "SkyWest Airlines", iata: "OO" },
  // Americas + Caribbean
  { name: "Air Canada", iata: "AC" },
  { name: "WestJet", iata: "WS" },
  { name: "Aeromexico", iata: "AM" },
  { name: "Volaris", iata: "Y4" },
  { name: "Copa Airlines", iata: "CM" },
  { name: "Avianca", iata: "AV" },
  { name: "LATAM Airlines", iata: "LA" },
  // Europe
  { name: "British Airways", iata: "BA" },
  { name: "Lufthansa", iata: "LH" },
  { name: "Air France", iata: "AF" },
  { name: "KLM", iata: "KL" },
  { name: "Virgin Atlantic", iata: "VS" },
  { name: "Aer Lingus", iata: "EI" },
  { name: "Iberia", iata: "IB" },
  { name: "Swiss", iata: "LX" },
  { name: "Finnair", iata: "AY" },
  { name: "Icelandair", iata: "FI" },
  { name: "TAP Air Portugal", iata: "TP" },
  { name: "SAS", iata: "SK" },
  { name: "Turkish Airlines", iata: "TK" },
  // Middle East
  { name: "Emirates", iata: "EK" },
  { name: "Qatar Airways", iata: "QR" },
  { name: "Etihad Airways", iata: "EY" },
  // Asia + Oceania
  { name: "Singapore Airlines", iata: "SQ" },
  { name: "Cathay Pacific", iata: "CX" },
  { name: "Japan Airlines", iata: "JL" },
  { name: "All Nippon Airways", iata: "NH" },
  { name: "Korean Air", iata: "KE" },
  { name: "EVA Air", iata: "BR" },
  { name: "Qantas", iata: "QF" },
  { name: "Air India", iata: "AI" },
  { name: "Ethiopian Airlines", iata: "ET" },
];

function LogoItem({ a }: { a: Airline }) {
  return (
    <span className="airband-item" title={a.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="airband-logo"
        src={`https://images.kiwi.com/airlines/128/${a.iata}.png`}
        alt={a.name}
        loading="lazy"
        onError={(e) => {
          const img = e.currentTarget;
          img.style.display = "none";
          const word = img.nextElementSibling as HTMLElement | null;
          if (word) word.style.display = "inline";
        }}
      />
      <span className="airband-word" style={{ display: "none" }}>
        {a.name}
      </span>
    </span>
  );
}

export default function AirlineMarquee() {
  return (
    <section className="airband" aria-label="Airlines whose crew we serve">
      <div className="airband-label">Verified for crew at every major carrier</div>
      <div className="airband-track-wrap">
        <div className="airband-track">
          {AIRLINES.map((a) => (
            <LogoItem key={`a-${a.iata}`} a={a} />
          ))}
          {/* duplicate for a seamless loop */}
          {AIRLINES.map((a) => (
            <LogoItem key={`b-${a.iata}`} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
