"use client";

import { useEffect, useState } from "react";
import { UserCard } from "@/components/UserCard";
import SportFilterDropdown from "@/components/SportFilterDropdown";
import supabase from "@/lib/supabaseClient";
import { AppUserWithSports } from "@/types";
import { PublicProfile } from "@/types/user";

type RawUserSportsRow = {
  user: PublicProfile | null;
  sports: { name: string } | null;
  level: { name: string; label: string } | null;
};

export default function DashboardPage() {
  const [users, setUsers] = useState<AppUserWithSports[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase.from("user_sports").select(`
  user:public_profiles (
    id, name, bio, profile_image_url
  ),
  sports (
    name
  ),
  level:levels (
    name,
    label
  )
`);

      if (selectedSports.length > 0) {
        query = query.in("sports.id", selectedSports);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        return;
      }

      const grouped: { [uid: string]: AppUserWithSports } = {};

      for (const row of data as unknown as RawUserSportsRow[]) {
        if (!row.user || !row.sports || !row.level) continue;

        if (!grouped[row.user.id]) {
          grouped[row.user.id] = {
            id: row.user.id,
            name: row.user.name || "",
            bio: row.user.bio || "",
            profile_image_url: row.user.profile_image_url || "",
            sports: [],
          };
        }

        grouped[row.user.id].sports.push({
          sport: row.sports.name,
          level: row.level.label,
        });
      }

      setUsers(Object.values(grouped));
    };

    fetchData();
  }, [selectedSports]);

  return (
    <div style={{ padding: "2rem" }}>
      <SportFilterDropdown
        selected={selectedSports}
        onChange={setSelectedSports}
      />

      {users.map((u) => (
        <UserCard
          key={u.id}
          name={u.name}
          bio={u.bio}
          profileImageUrl={u.profile_image_url}
          sportsWithLevels={u.sports}
        />
      ))}
    </div>
  );
}
