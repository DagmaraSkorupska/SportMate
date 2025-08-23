"use client";

import { useState } from "react";
import { Box, Button, Avatar, LinearProgress, Typography } from "@mui/material";
import supabase from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

type Props = {
  userId: string;
  value?: string;
  onChange: (url: string) => void;
};

export default function AvatarUploader({ userId, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [, setProgress] = useState<number | null>(null);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Wybierz plik graficzny (jpg, png, webp).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Maksymalny rozmiar pliku to 5MB.");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${uuidv4()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      if (!data?.publicUrl) throw new Error("Brak publicznego URL-a");

      onChange(data.publicUrl);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message || "Nie udało się wgrać pliku");
      } else {
        alert("Nie udało się wgrać pliku");
      }
    } finally {
      setUploading(false);
      setProgress(null);
      e.target.value = "";
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Avatar
        src={value || undefined}
        alt="Avatar"
        sx={{ width: 64, height: 64 }}
      />
      <div>
        <Button variant="outlined" component="label" disabled={uploading}>
          {uploading ? "Wgrywanie..." : "Wybierz zdjęcie"}
          <input type="file" hidden accept="image/*" onChange={handleSelect} />
        </Button>
        {uploading && (
          <Box mt={1}>
            <LinearProgress />
            <Typography variant="caption">Przesyłanie...</Typography>
          </Box>
        )}
      </div>
    </Box>
  );
}
