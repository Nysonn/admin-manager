import React from 'react';
import { useInput } from 'react-admin';
import { TextField } from '@mui/material';

interface RichTextInputProps {
  source: string;
  label?: string;
  validate?: (value: string) => string | undefined;
  fullWidth?: boolean;
}

const RichTextInput: React.FC<RichTextInputProps> = ({ source, label, validate, fullWidth = true }) => {
  const {
    field,
    fieldState: { error },
  } = useInput({ source, validate });

  return (
    <TextField
      {...field}
      label={label || 'Content'}
      multiline
      rows={12}
      fullWidth={fullWidth}
      error={!!error}
      helperText={error?.message}
      variant="outlined"
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          fontFamily: 'monospace',
          fontSize: '0.95rem',
        },
      }}
    />
  );
};

export default RichTextInput;