import React, { useEffect, useState } from "react";
import { Paper, Container, Typography, Button, Box } from "@mui/material";
import Carrousel from "../general/Carroussel";
import useTest from "../../hook/useTest";
import MaterialIcon from "./../../components/general/MaterialIcon";
import { useRouter } from "next/navigation";

export default function ContainerPruebasCarrousel({ title, type }) {
  const { getTestByType } = useTest();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      const response = await getTestByType(type);
      if (response.success) {
        setTests(response.data);
      }
      setLoading(false);
    };
    fetchTests();
  }, [type]);

  const createComponents = (tests) => {
    return tests.map((test, i) => (
      <CardInfo
        key={i}
        titulo={test.titulo}
        descripcion={test.descripcion}
        _id={test._id}
      />
    ));
  };

  const arrayToRender = createComponents(tests);

  return (
    <Container maxWidth="lg" className="my-3">
      <Typography variant="h5">Pruebas de {title}</Typography>
      {loading ? (
        <Typography variant="body1">Cargando pruebas...</Typography>
      ) : tests.length > 0 ? (
        <Carrousel renderElements={arrayToRender} />
      ) : (
        <section className="w-full flex flex-col justify-center items-center">
          <MaterialIcon iconName="quiz" className="text-4xl" />
          <Typography variant="body1" className="text-center">
            No hay pruebas disponibles para este tipo.
          </Typography>
        </section>
      )}
    </Container>
  );
}

const CardInfo = ({ titulo, descripcion, _id }) => {
  const { push } = useRouter();
  return (
    <Paper elevation={3} className="p-4 mb-3">
      <Typography variant="h5">{titulo}</Typography>
      <Typography variant="body2" className="mt-2">
        {descripcion}
      </Typography>
      <Box display="flex" justifyContent="end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => push("/test/" + _id)}
        >
          Responder
        </Button>
      </Box>
    </Paper>
  );
};
