import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabin";

export function useCabins() {
  const { data: cabins, isLoading } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  return { isLoading, cabins };
}
