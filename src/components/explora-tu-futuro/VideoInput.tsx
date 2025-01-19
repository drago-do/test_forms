import { useState } from "react";
import { TextField, Button, Box, Typography, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

interface VideoInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxVideos: number;
}

export default function VideoInput({
  value,
  onChange,
  maxVideos,
}: VideoInputProps) {
  const [newVideo, setNewVideo] = useState("");

  const addVideo = () => {
    if (newVideo && value.length < maxVideos) {
      onChange([...value, newVideo]);
      setNewVideo("");
    }
  };

  const removeVideo = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Box >
      <Typography variant="subtitle1" gutterBottom>
        Videos de Experiencia (Máximo {maxVideos})
      </Typography>
      {value.map((video, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <TextField value={video} disabled fullWidth size="small" />
          <IconButton onClick={() => removeVideo(index)} color="error">
            <Delete />
          </IconButton>
        </Box>
      ))}
      {value.length < maxVideos && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            value={newVideo}
            onChange={(e) => setNewVideo(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            fullWidth
            size="small"
          />
          <Button
            startIcon={<Add />}
            onClick={addVideo}
            variant="contained"
            sx={{ ml: 1 }}
          >
            Agregar
          </Button>
        </Box>
      )}
    </Box>
  );
}
