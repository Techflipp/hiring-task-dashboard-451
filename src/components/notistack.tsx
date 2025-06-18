"use client";

import React, { ReactNode } from "react";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { X } from "lucide-react";

type Props = {
  children: ReactNode;
};

const Notistack = ({ children }: Props) => {
  const notistackRef = React.useRef<SnackbarProvider>();

  return (
    <SnackbarProvider
      ref={notistackRef as any}
      variant="default"
      maxSnack={5}
      preventDuplicate
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      autoHideDuration={4000}
      action={(snackbarId) => (
        <X
          className="h-4 w-4 cursor-pointer"
          onClick={() => closeSnackbar(snackbarId)}
        />
      )}
    >
      {children}
    </SnackbarProvider>
  );
};

export default Notistack;
