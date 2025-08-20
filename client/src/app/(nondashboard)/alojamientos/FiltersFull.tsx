"use client";

import { FiltersState, initialState, setFilters } from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AmenityIcons, PropertyTypeIcons, IncludedExpenseIcons } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const FiltersFull = ({ forceOpen = false }: { forceOpen?: boolean }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const [localFilters, setLocalFilters] = useState(initialState.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  const updateURL = debounce((newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  });

  const handleSubmit = () => {
    dispatch(setFilters(localFilters));
    updateURL(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialState.filters);
    dispatch(setFilters(initialState.filters));
    updateURL(initialState.filters);
  };

  const handleAmenityChange = (amenity: AmenityEnum) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };
  const handleIncludedExpenseChange = (expense: keyof typeof IncludedExpenseIcons) => {
    setLocalFilters((prev) => ({
      ...prev,
      includedExpenses: prev.includedExpenses.includes(expense)
        ? prev.includedExpenses.filter((e) => e !== expense)
        : [...prev.includedExpenses, expense],
    }));
  };

  const handleLocationSearch = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          localFilters.location
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setLocalFilters((prev) => ({
          ...prev,
          coordinates: [lng, lat],
        }));
      }
    } catch (err) {
      console.error("Error buscando la ubicación:", err);
    }
  };

  if (!isFiltersFullOpen && !forceOpen) return null;

  return (
    <div className="bg-white rounded-lg px-4 h-full overflow-auto pb-10">
      <div className="flex flex-col space-y-6">
        {/* Ubicación */}
        <div>
          <h4 className="font-bold mb-2">Ubicación</h4>
          <div className="flex items-center">
            <Input
              placeholder="Introduce la ubicación"
              value={filters.location}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="rounded-l-xl rounded-r-none border-r-0"
            />
            <Button
              onClick={handleLocationSearch}
              className="rounded-r-xl rounded-l-none border-l-none border-black shadow-none border hover:bg-primary-700 hover:text-primary-50"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tipo de alojamiento */}
        <div>
          <h4 className="font-bold mb-2">Tipo de alojamiento</h4>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <div
                key={type}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer",
                  localFilters.tipoAlojamiento === type
                    ? "border-black"
                    : "border-gray-200"
                )}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    tipoAlojamiento: type as PropertyTypeEnum,
                  }))
                }
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-center">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rango de precios */}
        <div>
          <h4 className="font-bold mb-2">Rango de precios (mensual)</h4>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[
              localFilters.rangoPrecio[0] ?? 0,
              localFilters.rangoPrecio[1] ?? 10000,
            ]}
            onValueChange={(value: any) =>
              setLocalFilters((prev) => ({
                ...prev,
                priceRange: value as [number, number],
              }))
            }
          />
          <div className="flex justify-between mt-2">
            <span>${localFilters.rangoPrecio[0] ?? 0}</span>
            <span>${localFilters.rangoPrecio[1] ?? 10000}</span>
          </div>
        </div>

        {/* Habitaciones */}
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="font-bold mb-2">Habitaciones</h4>
            <Select
              value={localFilters.habitaciones || "any"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, beds: value }))
              }
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Habitaaciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Sin filtrar</SelectItem>
                <SelectItem value="1">+1 habitación</SelectItem>
                <SelectItem value="2">+2 habitaciones</SelectItem>
                <SelectItem value="3">+3 habitaciones</SelectItem>
                <SelectItem value="4">+4 habitaciones</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <h4 className="font-bold mb-2">Baños</h4>
            <Select
              value={localFilters.banos || "any"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, banos: value }))
              }
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Baños" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Sin filtrar</SelectItem>
                <SelectItem value="1">+1 baño</SelectItem>
                <SelectItem value="2">+2 baños</SelectItem>
                <SelectItem value="3">+2 baños</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>


        {/* Características */}
        <div>
          <h4 className="font-bold mb-2">Características</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AmenityIcons).map(([amenity, Icon]) => (
              <div
                key={amenity}
                className={cn(
                  "flex items-center space-x-2 p-2 border rounded-lg hover:cursor-pointer",
                  localFilters.amenities.includes(amenity as AmenityEnum)
                    ? "border-black"
                    : "border-gray-200"
                )}
                onClick={() => handleAmenityChange(amenity as AmenityEnum)}
              >
                <Icon className="w-5 h-5 hover:cursor-pointer" />
                <Label className="hover:cursor-pointer">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Gastos Incluidos */}
        <div>
          <h4 className="font-bold mb-2">Gastos Incluidos</h4>
          <div className="flex flex-wrap gap-2">
          {Object.entries(IncludedExpenseIcons).map(([label, Icon]) => {
            const isActive = localFilters.includedExpenses.includes(label as keyof typeof IncludedExpenseIcons);

            return (
              <div
                key={label}
                className={cn(
                  "flex items-center space-x-2 p-2 border rounded-lg hover:cursor-pointer",
                  isActive ? "border-black" : "border-gray-200"
                )}
                onClick={() => handleIncludedExpenseChange(label as keyof typeof IncludedExpenseIcons)}
              >
                <Icon className="w-5 h-5 hover:cursor-pointer" />
                <Label className="hover:cursor-pointer">{label}</Label>
              </div>
            );
          })}

          </div>
        </div>


        {/* Apply and Reset buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary-700 text-white rounded-xl"
          >
            Filtrar
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 rounded-xl"
          >
            Reiniciar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersFull;
