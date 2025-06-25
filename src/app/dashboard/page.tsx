"use client";

import { useEffect, useState } from "react";
import { UserCard } from "@/components/UserCard";
import SportFilterDropdown from "@/components/SportFilterDropdown";
import supabase from "@/lib/supabaseClient";
import { AppUserWithSports, UserSport } from "@/types";
import { SupabaseUserRow, SupabaseSportRow } from "@/types/user";
import { SupabaseLevel } from "@/types/level";

type RawUserSportsRow = {
  user: SupabaseUserRow | SupabaseUserRow[];
  sports: SupabaseSportRow | SupabaseSportRow[];
  level: SupabaseLevel | SupabaseLevel[];
};

export default function DashboardPage() {
  const [users, setUsers] = useState<AppUserWithSports[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase.from("user_sports").select(`
          user:users (
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

      for (const row of data as RawUserSportsRow[]) {
        const userObj = Array.isArray(row.user) ? row.user[0] : row.user;
        const sportObj = Array.isArray(row.sports) ? row.sports[0] : row.sports;
        const levelObj = Array.isArray(row.level) ? row.level[0] : row.level;

        if (!userObj || !sportObj || !levelObj) continue;

        if (!grouped[userObj.id]) {
          grouped[userObj.id] = {
            id: userObj.id,
            name: userObj.name,
            bio: userObj.bio,
            profile_image_url: userObj.profile_image_url,
            sports: [],
          };
        }

        const sportWithLevel: UserSport = {
          sport: sportObj.name,
          level: levelObj.label,
        };

        grouped[userObj.id].sports.push(sportWithLevel);
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
