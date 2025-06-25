"use client";

import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
} from "@mui/material";

interface UserCardProps {
  name: string;
  bio?: string;
  sportsWithLevels: { sport: string; level: string }[];
  profileImageUrl?: string;
}

export const UserCard = ({
  name,
  bio,
  sportsWithLevels,
  profileImageUrl,
}: UserCardProps) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" gap={2} alignItems="center">
          <Avatar src={profileImageUrl} alt={name} />
          <Box>
            <Typography variant="h6">{name}</Typography>
            {bio && (
              <Typography variant="body2" color="text.secondary">
                {bio}
              </Typography>
            )}
          </Box>
        </Box>

        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          {sportsWithLevels.map((item, index) => (
            <Chip
              key={index}
              label={`${item.sport} – ${item.level}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
