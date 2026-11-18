"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Me } from "@/types/api";

export const useMe = () => useQuery({ queryKey: ["me"], queryFn: async () => (await api<Me>("/me")).data });
