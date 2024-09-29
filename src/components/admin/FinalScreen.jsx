import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";
import LoaderPencil from "./../general/LoaderPencil";
import Image from "next/image";
import MaterialIcon from "../general/MaterialIcon";
import { useRouter } from "next/navigation";

export default function Page({ state = "loading", info = "Error " }) {
  const renderContent = () => {
    switch (state) {
      case "success":
        return (
          <>
            <Typography variant="h5">El Test fue creado</Typography>
            <section className="w-full flex justify-center my-12">
              <Image
                src="/test_creado.png"
                width={200}
                height={200}
                alt="Test creado"
              />
            </section>
            <ReturnButonsGroup />
          </>
        );
      case "error":
        return (
          <>
            <Typography variant="h5">El Test no pudo crearse</Typography>
            <section className="w-full flex justify-center my-12">
              <Image
                src="/error.png"
                width={200}
                height={200}
                alt="Test error"
              />
            </section>
            {info && (
              <Alert severity="error" className="my-6">
                {info}
              </Alert>
            )}
            <ReturnButonsGroup />
          </>
        );
      case "loading":
      default:
        return (
          <Container maxWidth="lg">
            <Typography variant="h5">Subiendo test</Typography>
            <section className="w-full flex justify-center">
              <LoaderPencil />
            </section>
          </Container>
        );
    }
  };

  return <Container maxWidth="sm">{renderContent()}</Container>;
}

const ReturnButonsGroup = () => {
  const { push } = useRouter();

  return (
    <section className="w-full flex justify-between">
      <Button variant="text" color="secondary" onClick={() => push("/")}>
        <MaterialIcon iconName="home" className="mr-3" /> Regresar a la pagina
        principal
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.reload()}
      >
        <MaterialIcon iconName="frame_reload" className="mr-3" />
        Realizar otro Test
      </Button>
    </section>
  );
};
