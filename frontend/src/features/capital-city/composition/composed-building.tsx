"use client";

import Image from "next/image";
import { useMemo } from "react";
import { CompositionPart } from "./composition-part";
import {
  BuildingComposition,
  compositionUsesCompositeFallback,
} from "./types";

interface ComposedBuildingProps {
  composition: BuildingComposition;
  /** Show dashed Lego part slots (edit mode blueprint). */
  showPartBlueprint?: boolean;
}

export function ComposedBuilding({
  composition,
  showPartBlueprint = false,
}: ComposedBuildingProps) {
  const sortedParts = useMemo(
    () => [...composition.parts].sort((a, b) => a.zIndex - b.zIndex),
    [composition.parts],
  );

  const useComposite = compositionUsesCompositeFallback(composition);
  const compositeSrc = composition.compositeFallbackSrc;

  if (useComposite && compositeSrc && !showPartBlueprint) {
    return (
      <Image
        src={compositeSrc}
        alt=""
        width={composition.footprint.width}
        height={composition.footprint.height}
        unoptimized
        draggable={false}
        priority
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center bottom",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: composition.footprint.width,
        height: composition.footprint.height,
      }}
    >
      {useComposite && compositeSrc && showPartBlueprint ? (
        <Image
          src={compositeSrc}
          alt=""
          width={composition.footprint.width}
          height={composition.footprint.height}
          unoptimized
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center bottom",
            opacity: 0.28,
            pointerEvents: "none",
          }}
        />
      ) : null}

      {sortedParts.map((part) => (
        <CompositionPart
          key={part.id}
          part={part}
          showPlaceholder={showPartBlueprint || Boolean(part.assetSrc)}
        />
      ))}
    </div>
  );
}
