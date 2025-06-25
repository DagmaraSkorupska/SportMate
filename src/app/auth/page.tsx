"use client";

import { useState } from "react";
import { TextField, Typography, Box, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { useUserStore } from "@/store/useUserStore";
import AppButton from "@/components/AppButton";

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setUser(data.user);
      router.push("/dashboard");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: 3,
        pb: 10,
      }}
    >
      <Typography variant="h4" align="center" fontWeight="bold" mb={4}>
        SportMate
      </Typography>

      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <AppButton
        fullWidth
        variant="contained"
        tw="bg-primary text-white hover:bg-blue-700"
        loading={loading}
        onClick={handleLogin}
        sx={{ mt: 3 }}
      >
        Log in
      </AppButton>

      <Typography variant="body2" align="center" mt={3}>
        Don’t have an account?
      </Typography>
      <Typography variant="body2" align="center" mt={0.5}>
        <Link href="/auth/signup" underline="hover">
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
