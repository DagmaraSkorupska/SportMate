"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "@/constants/navigation";
import { useUserStore } from "@/store/useUserStore";
import supabase from "@/lib/supabaseClient";

export function TopNav() {
  const router = useRouter();
  const { user } = useUserStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path?: string) => {
    if (path) router.push(path);
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <AppBar position="static" sx={{ display: { xs: "none", md: "flex" } }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={4}>
          <Typography
            variant="h6"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            ZagrajMy
          </Typography>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>{user.user_metadata?.name || "Użytkownik"}</Typography>
            <IconButton onClick={handleUserMenu}>
              <Avatar
                src={user.user_metadata?.profile_image_url || undefined}
                alt="avatar"
              />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
              <MenuItem onClick={() => handleClose("/profile")}>
                Profil
              </MenuItem>
              <MenuItem onClick={handleLogout}>Wyloguj się</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
