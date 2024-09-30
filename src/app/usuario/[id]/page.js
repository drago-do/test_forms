"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import useUser from "./../../../hook/useUser";
import useTest from "./../../../hook/useTest";
import FullPageLoader from "./../../../components/general/FullPageLoader";
import { useRouter } from "next/navigation";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
}));

export default function UserProfile() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  const { getLoggedUserInfo, logout } = useUser();
  const { getUserCompletedTest } = useTest();
  const [user, setUser] = useState(null);
  const [completedTests, setCompletedTests] = useState([]);

  useEffect(() => {
    const userInfo = getLoggedUserInfo();
    setUser(userInfo);

    // Fetch completed tests using the hook
    const fetchCompletedTests = async () => {
      try {
        const response = await getUserCompletedTest(userInfo._id);
        if (response.success) {
          setCompletedTests(response.data);
        }
      } catch (error) {
        console.error("Error fetching completed tests:", error);
      }
    };

    fetchCompletedTests();
    setLoading(false);
  }, []);

  const userLogout = () => {
    setLoading(true);
    logout();
    push("/");
  };

  if (!user || loading) {
    return <FullPageLoader open={true} />;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 100, height: 100, fontSize: "3rem" }}>
                {user?.firstName?.[0] ?? "N"}
                {user?.lastName?.[0] ?? "N"}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4">
                {user?.firstName ?? "No hay información"}{" "}
                {user?.lastName ?? "No hay información"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {user?.role ?? "No hay información"}
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={userLogout}>
                Cerrar Sesión
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Información personal
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Correo Electrónico"
              secondary={user?.email ?? "No hay información"}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Teléfono"
              secondary={user?.phone ?? "No hay información"}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Escuela Actual"
              secondary={user?.currentSchool ?? "No hay información"}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Nivel Educativo"
              secondary={user?.educationLevel ?? "No hay información"}
            />
          </ListItem>
        </List>
      </StyledPaper>

      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Información Académica
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Generación"
              secondary={user?.generation ?? "No hay información"}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Grado"
              secondary={user?.grade ?? "No hay información"}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Grupo"
              secondary={user?.group ?? "No hay información"}
            />
          </ListItem>
        </List>
      </StyledPaper>

      <StyledPaper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Pruebas Completadas
        </Typography>
        {completedTests.length > 0 ? (
          <List>
            {completedTests.map((test, index) => (
              <React.Fragment key={test._id}>
                <ListItem
                  style={{
                    borderRadius: "8px",
                    margin: "10px 0",
                    padding: "15px",
                  }}
                  className="dark:bg-slate-800 bg-slate-400"
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        {test.id_prueba.titulo}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Completado el:{" "}
                          {new Date(test.createdAt).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={`Nivel: ${test.id_prueba.escalas.nivel}`}
                          color="primary"
                          size="small"
                          style={{ marginTop: "5px" }}
                        />
                      </>
                    }
                  />
                </ListItem>
                {index < completedTests.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1">
            No hay pruebas completadas aún.
          </Typography>
        )}
      </StyledPaper>
    </Box>
  );
}
