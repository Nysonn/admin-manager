import React, { useCallback, useState } from "react";
import { Box, Paper, Typography, Button, LinearProgress, Grid, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDataProvider, useNotify } from "react-admin";
import { mockUploadToCloudinary } from "../../adapters/cloudinaryMock";

type UploadItem = {
  id?: string;
  file: File;
  previewUrl: string;
  progress: number;
  uploading: boolean;
  error?: string | null;
};

const kb = (n: number) => `${Math.round(n / 1024)} KB`;

// ImageUploadInput: drag/drop + browse uploader
const ImageUploadInput: React.FC = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [items, setItems] = useState<UploadItem[]>([]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const arr = Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        uploading: false,
        error: null,
      })) as UploadItem[];

      // append
      setItems((prev) => [...arr, ...prev]);

      // process each sequentially (you can parallelize if desired)
      for (const it of arr) {
        setItems((prev) => prev.map((p) => (p.previewUrl === it.previewUrl ? { ...p, uploading: true } : p)));
        try {
          // Simulate upload with progress callback
          const result = await mockUploadToCloudinary(it.file, (progress) => {
            setItems((prev) =>
              prev.map((p) => (p.previewUrl === it.previewUrl ? { ...p, progress } : p))
            );
          });

          // persist record to mock dataProvider
          const record = {
            filename: it.file.name,
            url: result.url,
            thumbnailUrl: result.thumbnailUrl,
            size: it.file.size,
            width: result.width,
            height: result.height,
            uploadedAt: new Date().toISOString(),
          };

          await dataProvider.create("images", { data: record });

          setItems((prev) =>
            prev.map((p) =>
              p.previewUrl === it.previewUrl ? { ...p, uploading: false, progress: 100 } : p
            )
          );
          notify(`${it.file.name} uploaded`, { type: "info" });
        } catch (err: any) {
          setItems((prev) =>
            prev.map((p) => (p.previewUrl === it.previewUrl ? { ...p, uploading: false, error: err?.message ?? "Upload failed" } : p))
          );
          notify(`Upload failed: ${it.file.name}`, { type: "warning" });
        }
      }
    },
    [dataProvider, notify]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const onBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // reset input value so same file can be selected again
    e.currentTarget.value = "";
  };

  const removeItem = (previewUrl: string) => {
    setItems((prev) => {
      prev.forEach((p) => {
        if (p.previewUrl === previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
      return prev.filter((p) => p.previewUrl !== previewUrl);
    });
  };

  return (
    <Box>
      <Paper
        elevation={1}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{ p: 2, mb: 2, textAlign: "center", borderStyle: "dashed", borderWidth: 1, borderColor: "divider" }}
      >
        <CloudUploadIcon sx={{ fontSize: 40 }} />
        <Typography variant="body1">Drag & drop images here, or</Typography>
        <Button variant="contained" component="label" sx={{ mt: 1 }}>
          Browse files
          <input hidden type="file" accept="image/*" multiple onChange={onBrowse} />
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          PNG, JPG, GIF, WebP — max 5 MB (client will resize thumbnails)
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        {items.map((it) => (
          <Grid key={it.previewUrl} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Paper sx={{ p: 1, position: "relative" }}>
              <img
                src={it.previewUrl}
                alt={it.file.name}
                style={{ width: "100%", height: 160, objectFit: "cover", display: "block", borderRadius: 4 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2" noWrap>
                  {it.file.name}
                </Typography>
                <IconButton size="small" onClick={() => removeItem(it.previewUrl)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="caption">{kb(it.file.size)}</Typography>
              <Box sx={{ mt: 1 }}>
                <LinearProgress variant="determinate" value={it.progress} />
              </Box>
              {it.error && <Typography color="error" variant="caption">{it.error}</Typography>}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageUploadInput;
