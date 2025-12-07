import React from 'react';
import { useInput } from 'react-admin';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Box, Paper, ButtonGroup, Button } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
} from '@mui/icons-material';

interface RichTextInputProps {
  source: string;
  label?: string;
  validate?: any;
  fullWidth?: boolean;
}

const RichTextInput: React.FC<RichTextInputProps> = ({ source, label, validate, fullWidth }) => {
  const {
    field,
    fieldState: { error },
  } = useInput({ source, validate });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: field.value || '',
    onUpdate: ({ editor }) => {
      field.onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuBar = () => (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1, bgcolor: 'grey.50' }}>
      <ButtonGroup size="small" variant="outlined">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant={editor.isActive('bold') ? 'contained' : 'outlined'}
        >
          <FormatBold />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant={editor.isActive('italic') ? 'contained' : 'outlined'}
        >
          <FormatItalic />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant={editor.isActive('underline') ? 'contained' : 'outlined'}
        >
          <FormatUnderlined />
        </Button>
      </ButtonGroup>

      <ButtonGroup size="small" variant="outlined" sx={{ ml: 1 }}>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
        >
          <FormatListBulleted />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}
        >
          <FormatListNumbered />
        </Button>
      </ButtonGroup>

      <ButtonGroup size="small" variant="outlined" sx={{ ml: 1 }}>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          variant={editor.isActive({ textAlign: 'left' }) ? 'contained' : 'outlined'}
        >
          <FormatAlignLeft />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          variant={editor.isActive({ textAlign: 'center' }) ? 'contained' : 'outlined'}
        >
          <FormatAlignCenter />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          variant={editor.isActive({ textAlign: 'right' }) ? 'contained' : 'outlined'}
        >
          <FormatAlignRight />
        </Button>
      </ButtonGroup>
    </Box>
  );

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', mb: 2 }}>
      {label && (
        <Box component="label" sx={{ display: 'block', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
          {label}
        </Box>
      )}
      <Paper variant="outlined" sx={{ border: error ? '2px solid red' : undefined }}>
        <MenuBar />
        <Box
          sx={{
            minHeight: '200px',
            padding: '16px',
            '& .ProseMirror': {
              outline: 'none',
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Paper>
      {error && (
        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
          {error.message}
        </Box>
      )}
    </Box>
  );
};

export default RichTextInput;