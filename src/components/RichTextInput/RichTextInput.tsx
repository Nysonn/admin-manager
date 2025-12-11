import React, { useState } from 'react';
import { useInput } from 'react-admin';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Box } from '@mui/material';

// Import the new decomposed components
import { RichTextEditorToolbar } from './RichTextEditorToolbar';
import { RichTextEditorView } from './RichTextEditorView';

interface RichTextInputProps {
  source: string;
  label?: string;
  validate?: (value: string) => string | undefined;
  fullWidth?: boolean;
}

const RichTextInput: React.FC<RichTextInputProps> = ({ source, label, validate, fullWidth }) => {
  const {
    field,
    fieldState: { error },
  } = useInput({ source, validate });

  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: field.value || '',
    editable: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      // Key: This links Tiptap back to the react-admin form state
      field.onChange(editor.getHTML()); 
    },
  }, [field.value]);

  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', mb: 3 }}>
      <RichTextEditorView
        editor={editor}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        error={error}
        label={label}
      >
        {/* The toolbar is passed as children to be placed inside the Paper element of RichTextEditorView */}
        <RichTextEditorToolbar editor={editor} /> 
      </RichTextEditorView>

      {error && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'error.main',
            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
            mt: 1,
            fontWeight: 500,
            animation: 'shake 0.3s ease-in-out',
            '@keyframes shake': {
              '0%, 100%': { transform: 'translateX(0)' },
              '25%': { transform: 'translateX(-5px)' },
              '75%': { transform: 'translateX(5px)' },
            },
          }}
        >
          {error.message}
        </Box>
      )}
    </Box>
  );
};

export default RichTextInput;