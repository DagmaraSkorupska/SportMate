"use client";

import { useState } from "react";
import { TextField, Typography, Box, Link } from "@mui/material";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AppButton from "@/components/AppButton";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm your account!");
      router.push("/auth");
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
      }}
    >
      <Typography variant="h4" align="center" fontWeight="bold" mb={4}>
        Sign up
      </Typography>

      <TextField
        label="Email"
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
        variant="contained"
        fullWidth
        tw="bg-primary text-white hover:bg-blue-700"
        sx={{ mt: 3 }}
        loading={loading}
        onClick={handleSignup}
      >
        Create account
      </AppButton>

      <Typography variant="body2" align="center" mt={2}>
        Already have an account?{" "}
        <Link href="/auth" underline="hover">
          Log in
        </Link>
      </Typography>
    </Box>
  );
}
