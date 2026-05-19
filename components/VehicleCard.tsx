"use client";

import type { CSSProperties } from "react";
import { IconStar, IconHeart, IconArrowRight } from "./Icons";

export type Silhouette = "sedan" | "suv" | "minivan" | "passenger" | "cargo";

export interface VehicleCardProps {
  silhouette: Silhouette;
  tag: string;
  title: string;
  rating: string;
  meta: string;
  specs: string[];
  price: string;
  background: string; // CSS linear-gradient string
  href?: string;
  redCorolla?: boolean;
}

export default function VehicleCard({
  silhouette,
  tag,
  title,
  rating,
  meta,
  specs,
  price,
  background,
  href = "#",
  redCorolla = false,
}: VehicleCardProps) {
  const photoStyle: CSSProperties = { background };
  return (
    <a className="vcard" href={href}>
      <div
        className={`vcard-photo vcard-photo--silh${redCorolla ? " vcard-photo--corolla-red" : ""}`}
        style={photoStyle}
      >
        <svg className="vcard-silh" viewBox="0 0 320 120" aria-hidden="true">
          <use href={`#silh-${silhouette}`} />
        </svg>
        <span className="vcard-tag">{tag}</span>
        <button className="vcard-fav" aria-label="Save" type="button" onClick={(e) => e.preventDefault()}>
          <IconHeart width={22} height={22} />
        </button>
      </div>
      <div className="vcard-body">
        <div className="vcard-titlerow">
          <span className="vcard-title">{title}</span>
          <span className="vcard-rate">
            <IconStar />
            {rating}
          </span>
        </div>
        <div className="vcard-meta">{meta}</div>
        <div className="vcard-specs">
          {specs.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="vcard-foot">
          <span className="vcard-price">
            <b>{price}</b> / day · all fees in
          </span>
          <span className="vcard-go">
            <IconArrowRight width={14} height={14} />
          </span>
        </div>
      </div>
    </a>
  );
}
