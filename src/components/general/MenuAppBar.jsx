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
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useRouter, usePathname } from "next/navigation";

import useUser from "@/hook/useUser";

export default function MenuAppBar({ title = "Cuestionarios" }) {
  const { getUserRole, getLoggedUserInfo, logout } = useUser();
  const pathname = usePathname();
  const { push } = useRouter();
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const [loader, setLoader] = React.useState(true);
  const [mainPage, setMainPage] = React.useState(true);

  React.useEffect(() => {
    pathname === "/" ? setMainPage(false) : setMainPage(true);
  }, [pathname]);

  React.useEffect(() => {
    if (getUserRole()) {
      setAuth(true);
      const user = getLoggedUserInfo();
      console.log(user);
      setUserInfo(user);
    } else {
      setAuth(false);
    }
    setLoader(false);
  }, []);

  const handleRedirect = (url) => {
    setLoader(true);
    push(url);
  };

  const handleLogOut = () => {
    setLoader(true);
    logout();
    setUserInfo(null);
    window.location.href = "/";
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
        <Toolbar className="flex justify-between w-full">
          <div className="flex flex-nowrap items-center">
            <IconButton
              aria-label="delete"
              className={`mr-3 ${mainPage ? "" : "hidden"}`}
              onClick={() => window.history.back()}
            >
              <ArrowBackIcon />
            </IconButton>
            <Link href={"/"} component="div" sx={{ flexGrow: 1 }}>
              {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            >
            <MenuIcon />
            </IconButton> */}
              <Typography variant="h6">{title}</Typography>
            </Link>
          </div>
          {auth && (
            <div className="flex  items-center">
              <section className="hidden md:flex md:flex-col">
                <Typography variant="body1">
                  {userInfo
                    ? `${userInfo?.firstName} ${userInfo?.lastName}`
                    : null}
                </Typography>
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
                <MenuItem onClick={() => handleRedirect("/perfil")}>
                  Mi perfil
                </MenuItem>
                {userInfo && userInfo.role === "Admin" && (
                  <MenuItem onClick={() => handleRedirect("/administrar")}>
                    Adminstrar
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogOut}>Cerrar sesión</MenuItem>
              </Menu>
            </div>
          )}
          {!auth && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRedirect("/iniciar-sesion")}
            >
              {" "}
              Iniciar sesión
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
