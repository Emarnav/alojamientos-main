"use client";

import {
  useGetPropertiesQuery
} from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { setFilters } from "@/state";
import { cleanParams } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import Listings from "./Listings";
import Map from "./Map";
import React, { useEffect } from "react";
import { NAVBAR_HEIGHT } from "@/lib/constants";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  const {
    data: alojamientos,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "rangoPrecio" || key === "superficie") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else {
          acc[key] = value === "any" ? null : value;
        }

        return acc;
      },
      {}
    );

    const cleanedFilters = cleanParams(initialFilters);
    dispatch(setFilters(cleanedFilters));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="w-full mx-auto px-5 flex flex-col"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      <FiltersBar />
      <div className="flex justify-between flex-1 overflow-hidden gap-3 mb-5">
        <div
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${
            isFiltersFullOpen
              ? "w-3/12 opacity-100 visible"
              : "w-0 opacity-0 invisible"
          }`}
        >
          <FiltersFull />
        </div>

        <Map alojamientos={alojamientos} isLoading={isLoading} isError={isError} />
        <div className="basis-4/12 overflow-y-auto">
          <Listings alojamientos={alojamientos} isLoading={isLoading} isError={isError} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
