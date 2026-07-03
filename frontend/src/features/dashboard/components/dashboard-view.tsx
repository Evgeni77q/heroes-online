"use client";

import axios from "axios";
import { useDashboard } from "../hooks/use-dashboard";

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
      <h1>Heroes Online</h1>

      <section style={{ marginTop: "24px", display: "grid", gap: "8px" }}>
        <p>Player: {data.account.username}</p>
        <p>World: {data.player.world}</p>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Resources</h2>
        <ul style={{ listStyle: "none", marginTop: "8px", display: "grid", gap: "4px" }}>
          <li>Wood {data.resources.wood}</li>
          <li>Stone {data.resources.stone}</li>
          <li>Gold {data.resources.gold}</li>
          <li>Food {data.resources.food}</li>
        </ul>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Buildings</h2>
        <p style={{ marginTop: "8px" }}>
          Town Hall Lv.{data.city.townHallLevel}
        </p>
        <p>{data.city.name}</p>
      </section>
    </main>
  );
}
