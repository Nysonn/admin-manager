import React, { useState } from 'react';
import { useInput } from 'react-admin';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Box, Paper, IconButton, Divider, Tooltip, Typography, useTheme, useMediaQuery } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatQuote,
  Code,
  Undo,
  Redo,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      field.onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    icon, 
    tooltip 
  }: { 
    onClick: () => void; 
    isActive: boolean; 
    icon: React.ReactNode; 
    tooltip: string;
  }) => (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onMouseDown={(e) => {
          e.preventDefault(); // Prevent editor from losing focus
        }}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        size={isMobile ? "small" : "medium"}
        sx={{
          borderRadius: 1,
          transition: 'all 0.2s ease-in-out',
          backgroundColor: isActive ? 'primary.main' : 'transparent',
          color: isActive ? 'white' : 'text.primary',
          '&:hover': {
            backgroundColor: isActive ? 'primary.dark' : 'action.hover',
            transform: 'translateY(-1px)',
            boxShadow: 1,
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          mx: 0.25,
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  const MenuBar = () => (
    <Box 
      sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        px: { xs: 1, sm: 2 },
        py: 1.5,
        bgcolor: 'background.paper',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
      }}
    >
      {/* Text Formatting Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<FormatBold fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<FormatItalic fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={<FormatUnderlined fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Underline (Ctrl+U)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={<Code fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Inline Code"
        />
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* List Formatting Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<FormatListBulleted fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<FormatListNumbered fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Numbered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<FormatQuote fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Block Quote"
        />
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Alignment Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={<FormatAlignLeft fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={<FormatAlignCenter fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={<FormatAlignRight fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Align Right"
        />
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* History Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          icon={<Undo fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Undo (Ctrl+Z)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          icon={<Redo fontSize={isMobile ? "small" : "medium"} />}
          tooltip="Redo (Ctrl+Y)"
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', mb: 3 }}>
      {label && (
        <Typography
          component="label"
          variant="subtitle2"
          sx={{
            display: 'block',
            mb: 1.5,
            fontWeight: 600,
            color: 'text.primary',
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          }}
        >
          {label}
        </Typography>
      )}
      <Paper
        elevation={isFocused ? 3 : 0}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          border: error 
            ? '2px solid' 
            : isFocused 
            ? '2px solid' 
            : '1px solid',
          borderColor: error 
            ? 'error.main' 
            : isFocused 
            ? 'primary.main' 
            : 'divider',
          boxShadow: isFocused ? `0 0 0 3px ${theme.palette.primary.main}15` : 'none',
          '&:hover': {
            borderColor: error ? 'error.main' : 'primary.light',
            boxShadow: error ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
          },
        }}
      >
        <MenuBar />
        <Box
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            minHeight: { xs: '180px', sm: '220px' },
            maxHeight: { xs: '400px', sm: '600px' },
            overflowY: 'auto',
            padding: { xs: 2, sm: 3 },
            backgroundColor: 'background.default',
            '& .ProseMirror': {
              outline: 'none',
              minHeight: { xs: '140px', sm: '180px' },
              fontSize: { xs: '0.9375rem', sm: '1rem' },
              lineHeight: 1.7,
              color: 'text.primary',
              '& p': {
                marginBottom: '1em',
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                fontWeight: 600,
                marginTop: '1.5em',
                marginBottom: '0.75em',
                lineHeight: 1.3,
              },
              '& ul, & ol': {
                paddingLeft: '1.5em',
                marginBottom: '1em',
              },
              '& li': {
                marginBottom: '0.5em',
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                paddingLeft: '1em',
                marginLeft: 0,
                fontStyle: 'italic',
                color: 'text.secondary',
                backgroundColor: 'action.hover',
                padding: '0.5em 1em',
                borderRadius: '0 4px 4px 0',
              },
              '& code': {
                backgroundColor: 'action.selected',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontSize: '0.9em',
                fontFamily: 'monospace',
              },
              '& pre': {
                backgroundColor: 'action.selected',
                padding: '1em',
                borderRadius: '4px',
                overflowX: 'auto',
                '& code': {
                  backgroundColor: 'transparent',
                  padding: 0,
                },
              },
            },
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'action.hover',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'action.selected',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'action.disabled',
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Paper>
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