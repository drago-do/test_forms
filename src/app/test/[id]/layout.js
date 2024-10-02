"use client";
import React from "react";
import useUser from "./../../../hook/useUser";
import MenuAppBar from "../../../components/general/MenuAppBar";

export default function Layout({ children }) {
  const { isAuthenticated } = useUser();

  if (typeof window !== "undefined" && !isAuthenticated()) {
    window.location.href = "/iniciar-sesion";
  }

  return (
    <>
      <main>
        <MenuAppBar title="Responder Test" />
        {children}
      </main>
    </>
  );
}
