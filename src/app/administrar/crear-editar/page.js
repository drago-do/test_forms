"use client";
import React, { useState } from "react";
import StepForm from "./../../../components/general/StepForm";
import FullPageLoader from "./../../../components/general/FullPageLoader";

import { FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import MetadataTest from "./../../../components/admin/MetadataTest";
import TestCreatorContainer from "./../../../components/admin/TestCreatorContainer";
import MenuAppBar from "./../../../components/general/MenuAppBar";

const SectionsForStepForm = [
  { form: MetadataTest, name: "Informacion General" },
  { form: TestCreatorContainer, name: "Laboral" },
];

export default function Page() {
  const [loading, setLoading] = useState(false);
  const methods = useForm({ mode: "all" });
  const { control } = methods;
  const stepDebug = 1;

  return loading ? (
    <FullPageLoader open={loading} />
  ) : (
    <>
      <MenuAppBar />
      <FormProvider {...methods}>
        <StepForm
          formTitle={"Crear nuevo Test"}
          stepComponents={SectionsForStepForm}
          edit={false}
          debug={true}
          step={1}
        />
        {parseInt(stepDebug) >= 0 && <DevTool control={control} />}
      </FormProvider>
    </>
  );
}
