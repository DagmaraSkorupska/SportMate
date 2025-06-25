"use client";

import { Button, ButtonProps, CircularProgress } from "@mui/material";
import classNames from "classnames";

type AppButtonProps = ButtonProps & {
  loading?: boolean;
  tw?: string;
};

export default function AppButton({
  children,
  loading = false,
  disabled,
  tw,
  ...props
}: AppButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "rounded-full px-5 py-2 text-sm sm:text-base transition",
        tw,
        props.className
      )}
      disabled={disabled || loading}
      disableElevation
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  );
}
