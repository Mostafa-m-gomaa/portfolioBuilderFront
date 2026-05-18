import { apiClient } from "@/api/axios";
import type { Package } from "@/types/package.types";

export const fetchPackages = () =>
  apiClient.get<Package[]>("/packages").then((res) => res.data);

export const fetchPackageById = (id: string) =>
  apiClient.get<Package>(`/packages/${encodeURIComponent(id)}`).then((res) => res.data);
