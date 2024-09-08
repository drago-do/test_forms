"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import FullPageLoader from "./../general/FullPageLoader";

import { useRouter } from "next/navigation";

export default function MenuAppBar({ title = "Cuestionarios" }) {
  const { push } = useRouter();
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loader, setLoader] = React.useState(false);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleLogIn = () => {
    setLoader(true);
    push("/iniciar-sesion");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FullPageLoader open={loader} />
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {auth && (
            <div className="flex  items-center">
              <section className="hidden md:flex md:flex-col">
                <Typography variant="body1">nombre de usuario</Typography>
              </section>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
                <MenuItem onClick={handleClose}>Panel administrador</MenuItem>
              </Menu>
            </div>
          )}
          {!auth && (
            <Button variant="contained" color="primary" onClick={handleLogIn}>
              Iniciar sesión
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
