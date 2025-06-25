"use client";

import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUserStore } from "@/store/useUserStore";
import { Sport } from "@/types/index";
import { Level } from "@/types/level";
import { v4 as uuidv4 } from "uuid";

interface Entry {
  id: string;
  sportId: string;
  sportName: string;
  levelId: string;
  levelLabel: string;
}

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [sports, setSports] = useState<Sport[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selSport, setSelSport] = useState("");
  const [selLevel, setSelLevel] = useState("");
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      const [{ data: s1 }, { data: s2 }] = await Promise.all([
        supabase.from("sports").select("id,name").eq("is_active", true),
        supabase
          .from("levels")
          .select("id,name,label")
          .order("order_index", { ascending: true }),
      ]);
      if (s1) setSports(s1);
      if (s2) setLevels(s2);
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: userData }, { data: usports }] = await Promise.all([
        supabase.from("users").select("name,bio").eq("id", user.id).single(),
        supabase
          .from("user_sports")
          .select(
            "sport_id, level_id, sports!user_sports_sport_id_fkey(name), level:levels!user_sports_level_id_fkey(label)"
          )
          .eq("user_id", user.id),
      ]);

      if (userData) {
        setName(userData.name || "");
        setBio(userData.bio || "");
      }

      if (usports) {
        setEntries(
          usports.map((row: any) => ({
            id: uuidv4(),
            sportId: row.sport_id,
            sportName: Array.isArray(row.sports)
              ? row.sports[0]?.name
              : row.sports?.name,
            levelId: row.level_id,
            levelLabel: Array.isArray(row.level)
              ? row.level[0]?.label
              : row.level?.label,
          }))
        );
      }
    })();
  }, [user]);

  const handleAdd = () => {
    if (!selSport || !selLevel) return;
    const sportName = sports.find((s) => s.id === selSport)?.name || "";
    const levelLabel = levels.find((l) => l.id === selLevel)?.label || "";
    setEntries((prev) => [
      ...prev,
      {
        id: uuidv4(),
        sportId: selSport,
        sportName,
        levelId: selLevel,
        levelLabel,
      },
    ]);
    setSelSport("");
    setSelLevel("");
  };

  const handleRemove = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await supabase.from("users").update({ name, bio }).eq("id", user.id);
      await supabase.from("user_sports").delete().eq("user_id", user.id);
      const inserts = entries.map((e) => ({
        user_id: user.id,
        sport_id: e.sportId,
        level_id: e.levelId,
      }));
      await supabase
        .from("user_sports")
        .upsert(inserts, { onConflict: "user_id,sport_id" });
      alert("Profil zapisany!");
    } catch (error) {
      console.error("Błąd przy zapisie:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Twój profil</Typography>
        <Button color="secondary" onClick={handleLogout}>
          Wyloguj się
        </Button>
      </Box>

      <TextField
        label="Imię"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Bio"
        fullWidth
        multiline
        rows={3}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Typography variant="h6" mb={2}>
        Dodaj sport + poziom:
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Sport</InputLabel>
          <Select
            value={selSport}
            onChange={(e) => setSelSport(e.target.value)}
            label="Sport"
          >
            {sports.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Poziom</InputLabel>
          <Select
            value={selLevel}
            onChange={(e) => setSelLevel(e.target.value)}
            label="Poziom"
          >
            {levels.map((l) => (
              <MenuItem key={l.id} value={l.id}>
                {l.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!selSport || !selLevel}
        >
          Dodaj
        </Button>
      </Box>

      <List>
        {entries.map((e) => (
          <ListItem
            key={e.id}
            divider
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRemove(e.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`${e.sportName} – ${e.levelLabel}`} />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 4 }}
        onClick={handleSubmit}
      >
        Zapisz profil
      </Button>
    </Box>
  );
}
