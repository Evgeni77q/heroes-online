"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCityConstructor,
  moveBuildingPlacement,
} from "../api/city-constructor.api";

const QUERY_KEY = ["city-constructor"];

export function useCityConstructor() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getCityConstructor,
    refetchOnMount: "always",
    staleTime: 0,
  });
}

export function useMoveBuildingPlacement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      buildingId,
      slotIndex,
    }: {
      buildingId: string;
      slotIndex: number;
    }) => moveBuildingPlacement(buildingId, slotIndex),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });
}
