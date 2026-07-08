"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { useBuildings, useUpgradeBuilding } from "@/features/buildings";
import { BuildingType, BuildingStatus, BuildingView } from "@/features/buildings/types/building.types";
import { toBuildingType } from "../config/building-overlay.config";
import {
  useCityConstructor,
  useMoveBuildingPlacement,
} from "../hooks/use-city-constructor";
import { useCityEditDraft, computePendingMoves } from "../hooks/use-city-edit-draft";
import { BuildingOverlay } from "../overlays/building-overlay";
import { CityConstructorPlacement } from "../types/city-constructor.types";
import { CityEditToolbar } from "./city-edit-toolbar";
import { CityScene } from "./city-scene";
import { BuildingBlock } from "./building-block";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error?.message;

    if (message === "NO_CITY") {
      return "Столица не найдена. Сначала основайте город.";
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Не удалось загрузить конструктор города.";
}

function findBuildingView(
  buildings: BuildingView[],
  placement: CityConstructorPlacement,
): BuildingView | undefined {
  return buildings.find((building) => building.id === placement.buildingId);
}

export function CityConstructorView() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useCityConstructor();
  const movePlacement = useMoveBuildingPlacement();
  const { data: dashboardData, buildings, cityId } = useBuildings();
  const { handleUpgrade, upgradingBuildingId } = useUpgradeBuilding(cityId);

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [openBuildingId, setOpenBuildingId] = useState<string | null>(null);

  const {
    isEditMode,
    enterEditMode,
    cancelEditMode,
    draft,
    activePlacements,
    activeUnplaced,
    applyDraftMove,
    hasPendingChanges,
  } = useCityEditDraft(data?.placements ?? [], data?.unplaced ?? []);

  const openBuilding = useMemo(() => {
    if (!openBuildingId) {
      return null;
    }

    return buildings.find((building) => building.id === openBuildingId) ?? null;
  }, [buildings, openBuildingId]);

  const handleDropBuilding = useCallback(
    (buildingId: string, slotIndex: number) => {
      setActionError(null);

      if (isEditMode) {
        applyDraftMove(buildingId, slotIndex);
        setSelectedSlotIndex(null);
        return;
      }
    },
    [applyDraftMove, isEditMode],
  );

  const handleUnplacedClick = useCallback(
    (buildingId: string) => {
      if (selectedSlotIndex === null) {
        return;
      }

      handleDropBuilding(buildingId, selectedSlotIndex);
    },
    [handleDropBuilding, selectedSlotIndex],
  );

  const handleBuildingClick = useCallback(
    (placement: CityConstructorPlacement) => {
      if (isEditMode) {
        return;
      }

      const building =
        findBuildingView(buildings, placement) ??
        ({
          id: placement.buildingId,
          type: toBuildingType(placement.type),
          level: placement.level,
          status: BuildingStatus.Idle,
          upgradeCost: { wood: 0, stone: 0, gold: 0 },
          purpose: placement.label,
        } as BuildingView);

      setOpenBuildingId(building.id);
    },
    [buildings, isEditMode],
  );

  const handleCastleClick = useCallback(() => {
    if (isEditMode) {
      return;
    }

    const townHall = buildings.find(
      (building) => building.type === BuildingType.TownHall,
    );

    if (townHall) {
      setOpenBuildingId(townHall.id);
    }
  }, [buildings, isEditMode]);

  const handleSaveEdit = useCallback(async () => {
    setActionError(null);

    if (!hasPendingChanges || !draft) {
      cancelEditMode();
      setSelectedSlotIndex(null);
      return;
    }

    setIsSaving(true);

    try {
      let guard = 0;

      while (guard < 50) {
        guard += 1;
        const fresh = await refetch();
        const moves = computePendingMoves(draft, fresh.data?.placements ?? []);

        if (moves.length === 0) {
          break;
        }

        await movePlacement.mutateAsync(moves[0]!);
      }

      cancelEditMode();
      setSelectedSlotIndex(null);
    } catch (saveError) {
      setActionError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }, [
    cancelEditMode,
    draft,
    hasPendingChanges,
    movePlacement,
    refetch,
  ]);

  const handleCancelEdit = useCallback(() => {
    setActionError(null);
    cancelEditMode();
    setSelectedSlotIndex(null);
  }, [cancelEditMode]);

  if (isLoading) {
    return (
      <main className="premium-page">
        <p className="premium-note">Загрузка столицы...</p>
      </main>
    );
  }

  if (axios.isAxiosError(error) && error.response?.data?.error?.message === "NO_CITY") {
    router.replace("/found-settlement");
    return (
      <main className="premium-page">
        <p className="premium-note">Перенаправление...</p>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="premium-page">
        <p role="alert" className="premium-note premium-note--error">
          {getErrorMessage(error)}
        </p>
      </main>
    );
  }

  return (
    <main className="premium-page" style={{ position: "relative" }}>
      <section className="premium-card">
        <div
          className="premium-card__content"
          style={{ padding: "24px", display: "grid", gap: "16px" }}
        >
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "grid", gap: "8px" }}>
              <p className="premium-section-kicker">Capital City</p>
              <h1 className="premium-title premium-title--glow">{data.cityName}</h1>
              <p className="premium-subtitle">
                {isEditMode
                  ? "Редактирование активировано: закрепляй постройки по сильным scenic plots и сохраняй новую композицию столицы."
                  : "Город теперь подан как постоянная MMO-сцена: открывай здания напрямую или переходи в edit mode для перепланировки."}
              </p>
            </div>
            <div className="premium-toolbar">
              <CityEditToolbar
                isEditMode={isEditMode}
                isSaving={isSaving}
                hasPendingChanges={hasPendingChanges}
                onEdit={enterEditMode}
                onSave={() => {
                  void handleSaveEdit();
                }}
                onCancel={handleCancelEdit}
              />
              {!isEditMode ? (
                <Link
                  href="/city/manage"
                  className="premium-button premium-button--secondary"
                  style={{ textDecoration: "none" }}
                >
                  Legacy manage →
                </Link>
              ) : null}
            </div>
          </header>

          <div className="premium-stat-grid">
            <div className="premium-stat-tile">
              <p className="premium-stat-label">Scene status</p>
              <p className="premium-stat-value">
                {isEditMode ? "Edit" : "Live"}
              </p>
            </div>
            <div className="premium-stat-tile">
              <p className="premium-stat-label">Placed buildings</p>
              <p className="premium-stat-value">{activePlacements.size}</p>
            </div>
            <div className="premium-stat-tile">
              <p className="premium-stat-label">Open slots reserve</p>
              <p className="premium-stat-value">{activeUnplaced.length}</p>
            </div>
            <div className="premium-stat-tile">
              <p className="premium-stat-label">Pending moves</p>
              <p className="premium-stat-value">{hasPendingChanges ? "Yes" : "No"}</p>
            </div>
          </div>

          <p className={`premium-note ${isEditMode ? "premium-note--warning" : ""}`}>
            {isEditMode
              ? "Выберите площадку у реки, у стены или на холме и переставьте здание. Save применяет новую композицию, Exit выходит без сохранения."
              : "Ваш город больше не воспринимается как таблица. Нажмите на здание для управления или включите Edit City, чтобы задать постоянную сценическую композицию."}
          </p>
        </div>
      </section>

      <div
        style={{
          transition: "filter 150ms ease",
          filter: openBuilding ? "brightness(0.72)" : "none",
        }}
      >
        <CityScene
          field={data.field}
          placementsBySlot={activePlacements}
          cityName={data.cityName}
          townHallLevel={data.townHallLevel}
          mode={isEditMode ? "edit" : "view"}
          selectedSlotIndex={selectedSlotIndex}
          isPending={isSaving || movePlacement.isPending}
          onSelectSlot={setSelectedSlotIndex}
          onDropBuilding={handleDropBuilding}
          onBuildingClick={handleBuildingClick}
          onCastleClick={handleCastleClick}
        />
      </div>

      {isEditMode && activeUnplaced.length > 0 ? (
        <section className="premium-card">
          <div
            className="premium-card__content"
            style={{ padding: "20px", display: "grid", gap: "12px" }}
          >
            <div style={{ display: "grid", gap: "6px" }}>
              <p className="premium-section-kicker">Reserve Buildings</p>
              <h2 style={{ margin: 0, fontSize: "24px", letterSpacing: "-0.04em" }}>
                Неразмещённые здания
              </h2>
              <p className="premium-subtitle">
                Быстрый резерв для перестановки: выбери слот на сцене и затем щёлкни
                по нужному building block.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {activeUnplaced.map((placement) => (
                <div
                  key={placement.buildingId}
                  className="premium-stat-tile"
                  style={{ width: "132px" }}
                >
                  <BuildingBlock
                    placement={placement}
                    mode="edit"
                    selected={selectedSlotIndex !== null}
                    onClick={() => handleUnplacedClick(placement.buildingId)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {actionError ? (
        <p role="alert" className="premium-note premium-note--error">
          {actionError}
        </p>
      ) : null}

      {openBuilding && !isEditMode ? (
        <BuildingOverlay
          building={openBuilding}
          cityId={cityId}
          army={dashboardData?.army}
          onClose={() => setOpenBuildingId(null)}
          onUpgrade={handleUpgrade}
          isUpgrading={upgradingBuildingId === openBuilding.id}
        />
      ) : null}
    </main>
  );
}
