"use client";
import { BeatLoader } from "react-spinners";
import { CSSProperties } from "react";

export default function Spinner() {
  const override: CSSProperties = {
    display: "inline-block",
    margin: "0 4rem",
  };
  return (
    <BeatLoader
      color={"var(--color-primary)"}
      loading={true}
      cssOverride={override}
      size={16}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}
