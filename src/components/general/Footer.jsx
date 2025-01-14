import React from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box>
      <AppBar
        position="static"
        color="primary"
        component="footer"
        className="mt-6"
        elevation={0}
      >
        <Container>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Typography variant="body2" sx={{ my: isMobile ? 2 : 0 }}>
              © {new Date().getFullYear()} Will Be™ Todos los derechos
              reservados.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link
                href="https://www.facebook.com/profile.php?id=61558049608604"
                color="inherit"
                sx={{ display: "flex", alignItems: "center", mr: 2 }}
              >
                <FacebookIcon fontSize="small" />
                <Box component="span" sx={{ ml: 1 }}>
                  Facebook
                </Box>
              </Link>
              <Link
                href="tel:7751918709"
                color="inherit"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PhoneIcon fontSize="small" />
                <Box component="span" sx={{ ml: 1 }}>
                  775 191 8709
                </Box>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
