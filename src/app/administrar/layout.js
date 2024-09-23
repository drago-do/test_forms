"use client";
import React from "react";
import useUser from "./../../hook/useUser";

export default function Layout({ children }) {
  const { getUserRole } = useUser();

  if (typeof window !== "undefined" && getUserRole() !== "Admin") {
    window.location.href = "/";
  }

  return (
    <>
      <main>{children}</main>
    </>
  );
}
