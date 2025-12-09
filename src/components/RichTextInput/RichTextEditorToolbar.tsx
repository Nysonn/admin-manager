import React from 'react';
import { Editor } from '@tiptap/react';
import { Box, IconButton, Divider, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import {
  FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted,
  FormatListNumbered, FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
  FormatQuote, Code, Undo, Redo,
} from '@mui/icons-material';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  tooltip: string;
  isMobile: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  isActive, 
  icon, 
  tooltip,
  isMobile
}) => (
  <Tooltip title={tooltip} arrow>
    <IconButton
      // Key: Prevent editor from losing focus when clicking a button
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      size={isMobile ? "small" : "medium"}
      sx={(theme) => ({
        borderRadius: 1,
        transition: 'all 0.2s ease-in-out',
        backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
        color: isActive ? 'white' : theme.palette.text.primary,
        '&:hover': {
          backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.action.hover,
          transform: 'translateY(-1px)',
          boxShadow: 1,
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        mx: 0.25,
      })}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

interface RichTextEditorToolbarProps {
  editor: Editor;
}

export const RichTextEditorToolbar: React.FC<RichTextEditorToolbarProps> = ({ editor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const iconSize = isMobile ? "small" : "medium";

  return (
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
          icon={<FormatBold fontSize={iconSize} />}
          tooltip="Bold (Ctrl+B)"
          isMobile={isMobile}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<FormatItalic fontSize={iconSize} />}
          tooltip="Italic (Ctrl+I)"
          isMobile={isMobile}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={<FormatUnderlined fontSize={iconSize} />}
          tooltip="Underline (Ctrl+U)"
          isMobile={isMobile}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={<Code fontSize={iconSize} />}
          tooltip="Inline Code"
          isMobile={isMobile}
        />
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* List Formatting Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<FormatListBulleted fontSize={iconSize} />}
          tooltip="Bullet List"
          isMobile={isMobile}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<FormatListNumbered fontSize={iconSize} />}
          tooltip="Numbered List"
          isMobile={isMobile}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<FormatQuote fontSize={iconSize} />}
          tooltip="Block Quote"
          isMobile={isMobile}
        />
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Alignment Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={<FormatAlignLeft fontSize={iconSize} />}
          tooltip="Align Left"
          isMobile={isMobile}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={<FormatAlignCenter fontSize={iconSize} />}
          tooltip="Align Center"
          isMobile={isMobile}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={<FormatAlignRight fontSize={iconSize} />}
          tooltip="Align Right"
          isMobile={isMobile}
        />
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* History Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          icon={<Undo fontSize={iconSize} />}
          tooltip="Undo (Ctrl+Z)"
          isMobile={isMobile}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          icon={<Redo fontSize={iconSize} />}
          tooltip="Redo (Ctrl+Y)"
          isMobile={isMobile}
        />
      </Box>
    </Box>
  );
};