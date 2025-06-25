"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Sport } from "@/types";

interface Props {
  selected: string[];
  onChange: (sports: string[]) => void;
}

export default function SportFilterDropdown({ selected, onChange }: Props) {
  const [availableSports, setAvailableSports] = useState<Sport[]>([]);

  useEffect(() => {
    const fetchSports = async () => {
      const { data, error } = await supabase
        .from("sports")
        .select("id, name")
        .eq("is_active", true);

      if (error) console.error("Error loading sports:", error);
      if (data) setAvailableSports(data);
    };

    fetchSports();
  }, []);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    onChange(event.target.value as string[]);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <FormControl fullWidth>
        <InputLabel>Sport</InputLabel>
        <Select
          multiple
          value={selected}
          onChange={handleChange}
          label="Sport"
          renderValue={(selected) => (
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {selected.map((id) => {
                const sport = availableSports.find((s) => s.id === id);
                return <Chip key={id} label={sport?.name || id} />;
              })}
            </Box>
          )}
        >
          {availableSports.map((sport) => (
            <MenuItem key={sport.id} value={sport.id}>
              {sport.name.charAt(0).toUpperCase() + sport.name.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
