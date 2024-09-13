"use client";
import React from "react";
import useUser from "./../../hook/useUser";

export default function Layout({ children }) {
  const { getUserRole } = useUser();

  if (getUserRole() !== "Admin") {
    window.location.href = "/";
  }

  return (
    <>
      <main>{children}</main>
    </>
  );
}
