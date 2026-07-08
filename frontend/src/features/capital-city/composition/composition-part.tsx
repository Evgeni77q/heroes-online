"use client";

import Image from "next/image";
import { CompositionPartDef } from "./types";

interface CompositionPartProps {
  part: CompositionPartDef;
  showPlaceholder: boolean;
}

export function CompositionPart({
  part,
  showPlaceholder,
}: CompositionPartProps) {
  const rotation = part.rotation ?? 0;
  const scale = part.scale ?? 1;

  if (part.assetSrc) {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: part.x,
          top: part.y,
          width: part.width,
          height: part.height,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: "center bottom",
          zIndex: part.zIndex,
          pointerEvents: "none",
        }}
      >
        <Image
          src={part.assetSrc}
          alt=""
          width={part.width}
          height={part.height}
          unoptimized
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center bottom",
          }}
        />
      </div>
    );
  }

  if (!showPlaceholder) {
    return null;
  }

  return (
    <div
      aria-hidden
      title={part.label}
      style={{
        position: "absolute",
        left: part.x,
        top: part.y,
        width: part.width,
        height: part.height,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: "center bottom",
        zIndex: part.zIndex,
        border: "1px dashed rgba(44,82,130,0.45)",
        borderRadius: "4px",
        background: "rgba(156,163,175,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: "9px",
        fontWeight: 700,
        color: "#1e293b",
        padding: "4px",
        pointerEvents: "none",
      }}
    >
      {part.label}
    </div>
  );
}
