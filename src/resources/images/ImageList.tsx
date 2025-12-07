import React, { useState, useRef } from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  useListContext,
  TopToolbar,
  CreateButton,
  ExportButton,
  Filter,
  TextInput,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  LinearProgress,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ImageUploadInput from "./ImageUploadInput";
import { mockUploadToCloudinary } from "../../adapters/cloudinaryMock";
import { resizeImage } from "../../utils/imageUtils";

const ImageFilters = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search by filename" source="q" alwaysOn />
  </Filter>
);

const ListActions: React.FC = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

/**
 * GridBody renders the images as responsive cards and provides Replace/Delete actions.
 * Uses dataProvider.update and dataProvider.delete to persist changes in the mock store.
 */
const GridBody: React.FC = () => {
  const { data } = useListContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  // map of imageId -> progress (0-100) for replace uploads
  const [progressMap, setProgressMap] = useState<Record<number | string, number>>({});

  // file input refs per record (we'll create refs on the fly)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const startReplace = (recordId: number | string) => {
    // trigger hidden file input click
    const input = inputRefs.current[String(recordId)];
    if (input) {
      input.click();
    }
  };

  const handleReplaceFile = async (record: any, file?: File | null) => {
    if (!file) return;
    // Client-side resize for thumbnail selection (optional)
    try {
      setProgressMap((p) => ({ ...p, [record.id]: 5 }));
      await resizeImage(file, 400, 400);
      // optional: create File for thumb if needed
      // upload original file via adapter
      const result = await mockUploadToCloudinary(file, (progress: number) => {
        setProgressMap((p) => ({ ...p, [record.id]: progress }));
      });

      // prepare updated record payload
      const updated = {
        ...record,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        size: file.size,
        width: result.width,
        height: result.height,
        uploadedAt: new Date().toISOString(),
      };

      await dataProvider.update("images", { id: record.id, data: updated, previousData: record });
      notify(`Replaced ${record.filename}`, { type: "info" });
      setProgressMap((p) => ({ ...p, [record.id]: 100 }));

      // refresh list to show updated thumbnails / metadata
      refresh();
    } catch (err: any) {
      console.error("Replace failed", err);
      notify(`Replace failed: ${err?.message ?? "Unknown error"}`, { type: "warning" });
      setProgressMap((p) => ({ ...p, [record.id]: 0 }));
    }
  };

  const handleDelete = async (record: any) => {
    const ok = window.confirm(`Delete "${record.filename}"? This action cannot be undone.`);
    if (!ok) return;
    try {
      await dataProvider.delete("images", { id: record.id, previousData: record });
      notify(`Deleted ${record.filename}`, { type: "info" });
      refresh();
    } catch (err: any) {
      console.error("Delete failed", err);
      notify(`Delete failed: ${err?.message ?? "Unknown error"}`, { type: "warning" });
    }
  };

  return (
    <Grid container spacing={2}>
      {data?.map((record: any) => {
        if (!record) return null;
        const progress = progressMap[record.id] ?? 0;

        return (
          <Grid key={record.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card sx={{ position: "relative" }}>
              {/* Thumbnail */}
              <CardMedia
                component="img"
                height="180"
                image={record.thumbnailUrl || record.url}
                alt={record.filename}
                sx={{ objectFit: "cover" }}
              />

              {/* Overlay actions (top-right) */}
              <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  aria-label={`replace-${record.id}`}
                  onClick={() => startReplace(record.id)}
                  sx={{ backgroundColor: "rgba(255,255,255,0.85)" }}
                >
                  <SwapHorizIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label={`delete-${record.id}`}
                  onClick={() => handleDelete(record)}
                  sx={{ backgroundColor: "rgba(255,255,255,0.85)" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Hidden file input for replace */}
              <input
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                ref={(el) => {
                  inputRefs.current[String(record.id)] = el;
                }}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  // clear value so same file can be selected later
                  e.currentTarget.value = "";
                  handleReplaceFile(record, f);
                }}
              />

              <CardContent sx={{ pt: 1 }}>
                <Typography variant="body2" noWrap>
                  {record.filename}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {record.size ? `${Math.round(record.size / 1024)} KB` : ""}
                </Typography>
              </CardContent>

              <CardActions sx={{ px: 1, pb: 1 }}>
                <Typography variant="caption" color="textSecondary" sx={{ flex: 1 }}>
                  {record.uploadedAt ? new Date(record.uploadedAt).toLocaleString("en-GB") : ""}
                </Typography>
              </CardActions>

              {/* Progress bar for replace */}
              {progress > 0 && progress < 100 && (
                <Box sx={{ px: 1, pb: 1 }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              )}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

const ImagesList: React.FC = (props) => {
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <List {...props} filters={<ImageFilters />} perPage={24} actions={<ListActions />}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <ImageUploadInput />
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => {
            if (v) setView(v);
          }}
          aria-label="view toggle"
        >
          <ToggleButton value="grid" aria-label="grid">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {view === "grid" ? (
        <GridBody />
      ) : (
        <Datagrid rowClick="edit">
          <TextField source="filename" />
          <TextField source="url" />
          <TextField source="size" />
          <DateField source="uploadedAt" showTime />
        </Datagrid>
      )}
    </List>
  );
};

export default ImagesList;
