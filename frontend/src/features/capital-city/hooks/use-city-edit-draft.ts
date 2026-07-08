"use client";

import { useCallback, useMemo, useState } from "react";
import { CityConstructorPlacement } from "../types/city-constructor.types";

export interface CityEditDraft {
  placementsBySlot: Map<number, CityConstructorPlacement>;
  unplaced: CityConstructorPlacement[];
}

function buildDraftFromServer(
  placements: CityConstructorPlacement[],
  unplaced: CityConstructorPlacement[],
): CityEditDraft {
  const placementsBySlot = new Map<number, CityConstructorPlacement>();

  for (const placement of placements) {
    placementsBySlot.set(placement.slotIndex, placement);
  }

  return {
    placementsBySlot,
    unplaced: [...unplaced],
  };
}

function swapOrMoveInDraft(
  draft: CityEditDraft,
  buildingId: string,
  targetSlotIndex: number,
): CityEditDraft {
  const placementsBySlot = new Map(draft.placementsBySlot);
  let unplaced = [...draft.unplaced];

  let moving: CityConstructorPlacement | undefined;
  let sourceSlotIndex: number | null = null;

  for (const [slotIndex, placement] of placementsBySlot.entries()) {
    if (placement.buildingId === buildingId) {
      moving = placement;
      sourceSlotIndex = slotIndex;
      break;
    }
  }

  if (!moving) {
    const unplacedIndex = unplaced.findIndex(
      (item) => item.buildingId === buildingId,
    );

    if (unplacedIndex === -1) {
      return draft;
    }

    moving = unplaced[unplacedIndex]!;
    unplaced = unplaced.filter((item) => item.buildingId !== buildingId);
  } else {
    placementsBySlot.delete(sourceSlotIndex!);
  }

  const occupant = placementsBySlot.get(targetSlotIndex);

  if (occupant) {
    placementsBySlot.set(targetSlotIndex, { ...moving, slotIndex: targetSlotIndex });

    if (sourceSlotIndex !== null) {
      placementsBySlot.set(sourceSlotIndex, {
        ...occupant,
        slotIndex: sourceSlotIndex,
      });
    } else {
      unplaced.push({ ...occupant, slotIndex: -1 });
    }
  } else {
    placementsBySlot.set(targetSlotIndex, { ...moving, slotIndex: targetSlotIndex });
  }

  return { placementsBySlot, unplaced };
}

export function computePendingMoves(
  draft: CityEditDraft,
  serverPlacements: CityConstructorPlacement[],
): Array<{ buildingId: string; slotIndex: number }> {
  const serverByBuildingId = new Map(
    serverPlacements.map((placement) => [placement.buildingId, placement]),
  );
  const moves: Array<{ buildingId: string; slotIndex: number }> = [];

  for (const placement of draft.placementsBySlot.values()) {
    const serverPlacement = serverByBuildingId.get(placement.buildingId);

    if (!serverPlacement || serverPlacement.slotIndex !== placement.slotIndex) {
      moves.push({
        buildingId: placement.buildingId,
        slotIndex: placement.slotIndex,
      });
    }
  }

  return moves;
}

export function useCityEditDraft(
  serverPlacements: CityConstructorPlacement[],
  serverUnplaced: CityConstructorPlacement[],
) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [draft, setDraft] = useState<CityEditDraft | null>(null);

  const enterEditMode = useCallback(() => {
    setDraft(buildDraftFromServer(serverPlacements, serverUnplaced));
    setIsEditMode(true);
  }, [serverPlacements, serverUnplaced]);

  const cancelEditMode = useCallback(() => {
    setDraft(null);
    setIsEditMode(false);
  }, []);

  const applyDraftMove = useCallback((buildingId: string, slotIndex: number) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return swapOrMoveInDraft(current, buildingId, slotIndex);
    });
  }, []);

  const activePlacements = useMemo(() => {
    if (isEditMode && draft) {
      return draft.placementsBySlot;
    }

    const map = new Map<number, CityConstructorPlacement>();

    for (const placement of serverPlacements) {
      map.set(placement.slotIndex, placement);
    }

    return map;
  }, [draft, isEditMode, serverPlacements]);

  const activeUnplaced = useMemo(() => {
    if (isEditMode && draft) {
      return draft.unplaced;
    }

    return serverUnplaced;
  }, [draft, isEditMode, serverUnplaced]);

  const pendingMoves = useMemo(() => {
    if (!draft) {
      return [];
    }

    return computePendingMoves(draft, serverPlacements);
  }, [draft, serverPlacements]);

  const hasPendingChanges = pendingMoves.length > 0;

  return {
    isEditMode,
    enterEditMode,
    cancelEditMode,
    finishEditMode: cancelEditMode,
    draft,
    activePlacements,
    activeUnplaced,
    applyDraftMove,
    pendingMoves,
    hasPendingChanges,
  };
}
