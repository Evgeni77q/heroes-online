"use client";

import { CityCard } from "@/features/city";
import axios from "axios";
import { useDashboard } from "../hooks/use-dashboard";
import { DashboardHeader } from "./dashboard-header";
import { ResourcesPanel } from "./resources-panel";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error?.message;

    if (message === "NO_PLAYER") {
      return "No player found. Create a player to enter the game.";
    }

    if (message === "NO_CITY") {
      return "No city found. Found your city to continue.";
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Failed to load dashboard.";
}

export function DashboardView() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (isError || !data) {
    return <p role="alert">{getErrorMessage(error)}</p>;
  }

  return (
    <main style={{ padding: "24px", maxWidth: "640px" }}>
      <DashboardHeader data={data} />
      <CityCard city={data.city} />
      <ResourcesPanel data={data} />
    </main>
  );
}
