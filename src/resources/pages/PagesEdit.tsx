import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Toolbar,
  SaveButton,
  useRecordContext,
  useDataProvider,
} from "react-admin";
import { Button } from "@mui/material";
import RichTextInput from "../../components/RichTextInput";

// Edit view for Pages
const statusChoices = [
  { id: "draft", name: "Draft" },
  { id: "published", name: "Published" },
];

const validateRequired = (v: any) => (v ? undefined : "Required");

// Custom toolbar component that uses form state
const CustomToolbar: React.FC<any> = (toolbarProps) => {
  const record = useRecordContext();

  return (
    <Toolbar {...toolbarProps}>
      <SaveButton />
      {/* Preview button */}
      <Button
        color="primary"
        variant="outlined"
        style={{ marginLeft: 8, textTransform: "none" }}
        onClick={() => {
          const slug = record?.slug ?? record?.id;
          const previewUrl = `${window.location.origin}/preview/${slug}`;
          window.open(previewUrl, "_blank");
        }}
      >
        Preview
      </Button>
    </Toolbar>
  );
};

const PagesEdit: React.FC = (props) => {
  const dataProvider = useDataProvider();
  
  // async validator for slug that ignores the current record's own slug
  const makeValidateSlug = (currentId?: number | string) => {
    return async (value: string) => {
      if (!value) return "Required";
      try {
        const { total, data } = await dataProvider.getList("pages", {
          pagination: { page: 1, perPage: 1 },
          sort: { field: "id", order: "ASC" },
          filter: { slug: value },
        });
        if (total && total > 0) {
          // if found and the id is different from current, it's a conflict
          if (data[0] && data[0].id !== currentId) {
            return "This slug is already in use";
          }
        }
        return undefined;
      } catch (err) {
        console.warn("Slug check error", err);
        return undefined;
      }
    };
  };

  return (
    <Edit {...props}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="title" label="Title" validate={validateRequired} fullWidth />
        <TextInput
          source="slug"
          label="Slug"
          validate={(value, allValues) => makeValidateSlug(allValues?.id)(value)}
          helperText="URL-safe characters only."
          fullWidth
        />
        <RichTextInput source="content" label="Content (HTML)" validate={validateRequired} fullWidth />
        <SelectInput source="status" choices={statusChoices} />
      </SimpleForm>
    </Edit>
  );
};

export default PagesEdit;
