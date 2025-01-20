"use client";
import React from "react";
import UserListAdmin from "../../../components/admin/UsersListAdmin";
import { Container } from "@mui/material";
import MenuAppBar from "../../../components/general/MenuAppBar";

export default function page() {
  return (
    <>
      <MenuAppBar title="Usuarios" />
      <Container maxWidth="lg">
        <UserListAdmin />
      </Container>
    </>
  );
}
