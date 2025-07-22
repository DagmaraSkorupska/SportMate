// constants/navigation.ts
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import { ReactNode } from "react";

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
  { label: "Mapa", path: "/match", icon: <LocationOnIcon /> },
  { label: "Czat", path: "/chat", icon: <ChatIcon /> },
];
