"use client";
import React, { useState, useEffect, Suspense } from "react";
import StepForm from "./../../../components/general/StepForm";
import FullPageLoader from "./../../../components/general/FullPageLoader";

import { FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import MetadataTest from "./../../../components/admin/MetadataTest";
import TestCreatorContainer from "./../../../components/admin/TestCreatorContainer";
import MenuAppBar from "./../../../components/general/MenuAppBar";
import useTest from "./../../../hook/useTest";
import { useSearchParams } from "next/navigation";
import { Toaster } from "sonner";

const SectionsForStepForm = [
  { form: MetadataTest, name: "Informacion General" },
  { form: TestCreatorContainer, name: "Secciones y preguntas" },
];

function PageContent() {
  const methods = useForm({ mode: "all" });
  const { control } = methods;
  const stepDebug = 0;
  const { createTest, updateTest, getTestById } = useTest();
  const params = useSearchParams();
  const idDocument = params.get("id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idDocument) {
      setLoading(true);
      getTestById(idDocument)
        .then((testDocument) => {
          const test = testDocument.documento;
          methods.setValue("escalas", test.escalas);
          methods.setValue("_id", test._id);
          methods.setValue("titulo", test.titulo);
          methods.setValue("descripcion", test.descripcion);
          methods.setValue("instrucciones", test.instrucciones);
          methods.setValue("tipo", test.tipo);

          // Flatten the nested sections and questions arrays
          const flattenedSections = test.sections.flat().map((section) => ({
            ...section,
            questions: section.questions.flat(),
          }));
          methods.setValue("sections", flattenedSections);

          methods.setValue("creado_por", test.creado_por);
          methods.setValue("categorias", test.categorias);
          methods.setValue("fecha_creacion", test.fecha_creacion);
          methods.setValue("createdAt", test.createdAt);
          methods.setValue("updatedAt", test.updatedAt);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .catch((error) => {
          console.error("Error getting test:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [idDocument]);

  const handleFormSubmit = (data) => {
    return new Promise((resolve, reject) => {
      if (data?._id) {
        updateTest(data?._id, data)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.error("Error updating test:", error);
            reject(error);
          });
      } else {
        createTest(data)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.error("Error creating test:", error);
            reject(error);
          });
      }
    });
  };

  if (loading) {
    return <FullPageLoader open={true} />;
  }

  return (
    <>
      <MenuAppBar />
      <FormProvider {...methods}>
        <StepForm
          formTitle={"Crear nuevo Test"}
          stepComponents={SectionsForStepForm}
          edit={false}
          debug={stepDebug !== false ? true : false}
          step={stepDebug ? stepDebug : 0}
          uploadToDataBase={handleFormSubmit}
        />
        {parseInt(stepDebug) >= 0 && <DevTool control={control} />}
      </FormProvider>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<FullPageLoader open={true} />}>
      <PageContent />
    </Suspense>
  );
}
