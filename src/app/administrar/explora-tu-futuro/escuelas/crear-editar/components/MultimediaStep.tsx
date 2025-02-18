import { Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import VideoInput from "../../../../../../components/explora-tu-futuro/VideoInput";
import SearchImage from "../../../../../../components/general/SearchImage";

const MultimediaStep = ({ control }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <SearchImage name="multimedia.logo" />
    </Grid>
    <Grid item xs={12}>
      <Controller
        name="multimedia.videos"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <VideoInput
            value={field.value}
            onChange={field.onChange}
            maxVideos={3}
          />
        )}
      />
    </Grid>
  </Grid>
);

export default MultimediaStep;
