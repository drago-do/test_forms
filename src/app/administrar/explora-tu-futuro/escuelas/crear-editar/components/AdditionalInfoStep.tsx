import { Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import RichTextEditor from "../../../../../../components/general/RichTextEditor";
import { EmojiObjects, Star, Build } from "@mui/icons-material";

const AdditionalInfoStep = ({ control }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Controller
        name="informacionAdicional.porqueEstudiarConNosotros"
        control={control}
        render={({ field }) => (
          <RichTextEditor
            {...field}
            label="¿Por qué estudiar con nosotros?"
            icon={<EmojiObjects />}
          />
        )}
      />
    </Grid>
    <Grid item xs={12}>
      <Controller
        name="informacionAdicional.experiencias"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <RichTextEditor
            {...field}
            label="Experiencias"
            icon={<Star />}
            value={Array.isArray(field.value) ? field.value.join(" ") : ""}
          />
        )}
      />
    </Grid>
    <Grid item xs={12}>
      <Controller
        name="informacionAdicional.testimonios"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <RichTextEditor
            {...field}
            label="Testimonios"
            icon={<Build />}
            value={Array.isArray(field.value) ? field.value.join(" ") : ""}
          />
        )}
      />
    </Grid>
  </Grid>
);

export default AdditionalInfoStep;
