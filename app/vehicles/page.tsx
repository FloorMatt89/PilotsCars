import Link from "next/link";
import VehicleCard from "@/components/VehicleCard";
import AnimationProvider from "@/components/AnimationProvider";
import { IconPin, IconCalendar, IconBadge, IconSearch, IconArrowRight } from "@/components/Icons";

export const metadata = { title: "Vehicles — Pilot Cars" };

function FleetGroup({
  no, label, title, blurb, count, children,
}: {
  no: string; label: string; title: string; blurb: string; count: string; children: React.ReactNode;
}) {
  return (
    <section className="wrap" style={{ padding: "24px 32px 56px" }} data-reveal>
      <div className="section-head">
        <div>
          <span className="eyebrow eyebrow--ink">No. {no} / 05 · {label}</span>
          <h2 className="h-section" style={{ marginTop: 10 }}>{title}</h2>
          <p>{blurb}</p>
        </div>
        <a className="linkcta" href="#">{count} on the manifest <IconArrowRight /></a>
      </div>
      <div className="vgrid vgrid-3" data-stagger>
        {children}
      </div>
    </section>
  );
}

export default function VehiclesPage() {
  return (
    <main>
      <AnimationProvider />

      <section className="pagehead wrap" data-hero-reveal>
        <div className="pagehead-row">
          <div>
            <span className="eyebrow">The manifest</span>
            <h1 style={{ marginTop: 12 }}>The crew <em className="editorial-italic">manifest</em></h1>
            <p className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Vehicles</p>
          </div>
          <p>Eleven cars from verified crew across the network. Two sedans, two SUVs, two minivans, three passenger vans, two cargo vans — every one hosted by an airline employee, every booking inside the closed marketplace.</p>
        </div>
      </section>

      {/* Compact search dock */}
      <section className="wrap" style={{ paddingTop: 24 }} data-reveal>
        <div className="searchdock" style={{ boxShadow: "var(--shadow-float)", borderRadius: "var(--radius-md)", margin: 0, padding: "18px 22px" }}>
          <div className="searchdock-row">
            <div className="searchdock-cell">
              <span className="searchdock-label">Pick-up field</span>
              <div className="searchdock-value"><IconPin /><input type="text" defaultValue="KORD · Chicago O'Hare" /></div>
            </div>
            <div className="searchdock-cell">
              <span className="searchdock-label">Drop-off field</span>
              <div className="searchdock-value"><IconPin /><input type="text" defaultValue="Same as pick-up" /></div>
            </div>
            <div className="searchdock-cell">
              <span className="searchdock-label">Pick-up</span>
              <div className="searchdock-value"><IconCalendar /><input type="text" defaultValue="May 22 · 14:30" /></div>
            </div>
            <div className="searchdock-cell">
              <span className="searchdock-label">Drop-off</span>
              <div className="searchdock-value"><IconCalendar /><input type="text" defaultValue="May 25 · 09:00" /></div>
            </div>
            <div className="searchdock-cell">
              <span className="searchdock-label">Crew ID</span>
              <div className="searchdock-value">
                <IconBadge />
                <select defaultValue="UAL — Pilot">
                  <option>UAL — Pilot</option>
                  <option>AAL — Flight attendant</option>
                  <option>DAL — Mechanic</option>
                </select>
              </div>
            </div>
            <button className="searchdock-submit" type="button"><IconSearch /> Update</button>
          </div>
        </div>
      </section>

      <FleetGroup no="01" label="Sedans" title="Sedans" blurb="Quiet, efficient. The crew default for solo layovers." count="2">
        <VehicleCard silhouette="sedan" tag="Sedan" title="Toyota Corolla LE Hybrid" rating="4.91" meta="0.8 mi from KORD · Marcus T. · Dispatcher" specs={["5 seats", "Auto", "Hybrid · 50 mpg"]} price="$38" background="linear-gradient(135deg, #8b2222 0%, #3a0d0d 100%)" redCorolla />
        <VehicleCard silhouette="sedan" tag="Sedan" title="Nissan Sentra SV" rating="4.84" meta="1.4 mi from KATL · Priya M. · Pilot" specs={["5 seats", "CVT", "Gas · 33 mpg"]} price="$36" background="linear-gradient(135deg, #4d5a68 0%, #1f262e 100%)" />
      </FleetGroup>

      <FleetGroup no="02" label="SUVs" title="SUVs" blurb="Higher ride, more weather. AWD where the regional bases need it." count="2">
        <VehicleCard silhouette="suv" tag="SUV" title="Nissan Rogue SV · AWD" rating="4.92" meta="0.6 mi from KORD · Captain Reyes" specs={["5 seats", "CVT", "AWD"]} price="$56" background="linear-gradient(135deg, #3a5566 0%, #19262e 100%)" />
        <VehicleCard silhouette="suv" tag="SUV" title="Nissan Kicks SR" rating="4.86" meta="1.1 mi from KLAX · Karen H. · F/A" specs={["5 seats", "CVT", "FWD · 36 mpg"]} price="$46" background="linear-gradient(135deg, #a0683d 0%, #2e1a0c 100%)" />
      </FleetGroup>

      <FleetGroup no="03" label="Mini-vans" title="Mini-vans" blurb="Sliding doors, second-row captains. For crew traveling with family." count="2">
        <VehicleCard silhouette="minivan" tag="Mini-van" title="Honda Odyssey EX-L" rating="4.88" meta="2.3 mi from KDEN · Sam W. · Mechanic" specs={["8 seats", "Auto", "V6 · 28 mpg"]} price="$72" background="linear-gradient(135deg, #5a6b80 0%, #1f2935 100%)" />
        <VehicleCard silhouette="minivan" tag="Mini-van" title="Kia Carnival SX" rating="4.90" meta="1.8 mi from KBOS · Jamie R. · F/A" specs={["8 seats", "Auto", "V6 · 26 mpg"]} price="$78" background="linear-gradient(135deg, #7a6450 0%, #2a2218 100%)" />
      </FleetGroup>

      <FleetGroup no="04" label="Passenger vans" title="Passenger vans" blurb="Eight to fifteen seats — for the whole reserve crew on a single van." count="3">
        <VehicleCard silhouette="passenger" tag="Passenger Van" title="Mercedes Sprinter 2500 · 15-passenger" rating="4.95" meta="1.6 mi from KORD · Pilot Fleet ops" specs={["15 seats", "Auto", "Diesel · High roof"]} price="$165" background="linear-gradient(135deg, #5a6068 0%, #20232a 100%)" />
        <VehicleCard silhouette="passenger" tag="Passenger Van" title="Mercedes Sprinter 2500 · 12-passenger" rating="4.93" meta="1.6 mi from KORD · Pilot Fleet ops" specs={["12 seats", "Auto", "Diesel · Standard roof"]} price="$148" background="linear-gradient(135deg, #3d4f64 0%, #14202c 100%)" />
        <VehicleCard silhouette="passenger" tag="Passenger Van" title="Mercedes Metris Passenger" rating="4.89" meta="2.0 mi from KATL · Pilot Fleet ops" specs={["8 seats", "Auto", "Gas · Mid-size van"]} price="$96" background="linear-gradient(135deg, #8a7e58 0%, #2e2a1d 100%)" />
      </FleetGroup>

      <FleetGroup no="05" label="Cargo vans" title="Cargo vans" blurb="Ramp moves, instrument crates, the occasional bike trip. Diesel-Mercedes muscle." count="2">
        <VehicleCard silhouette="cargo" tag="Cargo Van" title='Mercedes Sprinter Cargo 2500 · 170″ High roof' rating="4.91" meta="3.1 mi from KMSP · Pilot Fleet ops" specs={["2 seats", "Auto", "Diesel · 533 cu ft"]} price="$142" background="linear-gradient(135deg, #4a5260 0%, #1a1f26 100%)" />
        <VehicleCard silhouette="cargo" tag="Cargo Van" title="Mercedes Metris Cargo Worker" rating="4.87" meta="1.4 mi from KLAX · Pilot Fleet ops" specs={["2 seats", "Auto", "Gas · 186 cu ft"]} price="$88" background="linear-gradient(135deg, #5e6240 0%, #20221a 100%)" />
      </FleetGroup>

      <div style={{ height: 64 }} />
    </main>
  );
}
