import { TextField, InputAdornment } from "@mui/material";
import type { ReactNode } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  icon: ReactNode;
}

export default function RichTextEditor({
  value,
  onChange,
  label,
  icon,
}: RichTextEditorProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      multiline
      rows={4}
      fullWidth
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{icon}</InputAdornment>
        ),
      }}
    />
  );
}
