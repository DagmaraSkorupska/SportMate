"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Level } from "@/types/level";

interface Props {
  selectedLevelId: string;
  onChange: (levelId: string) => void;
}

export default function LevelSelectDropdown({
  selectedLevelId,
  onChange,
}: Props) {
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    const fetchLevels = async () => {
      const { data, error } = await supabase
        .from("levels")
        .select("id, name, label")
        .order("order_index", { ascending: true });

      if (error) console.error("Error loading levels:", error);
      if (data) setLevels(data);
    };

    fetchLevels();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Level</InputLabel>
      <Select value={selectedLevelId} onChange={handleChange} label="Level">
        {levels.map((lvl) => (
          <MenuItem key={lvl.id} value={lvl.id}>
            {lvl.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
