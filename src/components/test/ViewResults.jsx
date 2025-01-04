import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import useTest from "./../../hook/useTest";
import FinalScreenTest from "./../test/FinalScreenTest";
import { Collapse, Paper } from "@mui/material";
import Image from "next/image";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewResults({ testId, userId, simpleButton = true }) {
  const [open, setOpen] = React.useState(false);
  const [testCompleted, setTestCompleted] = React.useState(false);
  const [testType, setTestType] = React.useState(0);
  const [testID, setTestID] = React.useState(0);
  const { getUserCompletedTest } = useTest();

  React.useEffect(() => {
    const checkTestCompletion = async () => {
      try {
        const response = await getUserCompletedTest(userId);

        if (response.success) {
          const completedTest = response.data.find(
            (test) => test.id_prueba._id === testId
          );
          console.log(completedTest);
          setTestID(completedTest?._id);
          setTestType(completedTest?.id_prueba?.tipo);
          setTestCompleted(completedTest ? true : false);
        }
      } catch (error) {
        console.error("Error checking test completion:", error);
      }
    };

    checkTestCompletion();
  }, [testId, userId, getUserCompletedTest]);

  const handleClickOpen = () => {
    if (testCompleted) {
      setOpen(true);
    } else {
      alert("El usuario no ha completado este test.");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {simpleButton ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClickOpen}
          className="mx-3"
        >
          Ver Resultados
        </Button>
      ) : (
        <Collapse in={testCompleted}>
          <section className="m-5">
            <Paper elevation={0} className="p-3">
              <Typography variant="h6">
                Parece que este test ya fue respondido...
              </Typography>
              <section className="w-full flex flex-col items-center justify-center">
                <Image
                  src="/test_creado.png"
                  width={100}
                  height={100}
                  alt="Test creado"
                />
                <Typography variant="subtitle1" textAlign="center">
                  Quieres ver los resultados?
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClickOpen}
                >
                  Ver Resultados
                </Button>
              </section>
            </Paper>
          </section>
        </Collapse>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Resultados del Test
            </Typography>
          </Toolbar>
        </AppBar>
        <FinalScreenTest state="success" idResults={testID} tipo={testType} />
      </Dialog>
    </React.Fragment>
  );
}
