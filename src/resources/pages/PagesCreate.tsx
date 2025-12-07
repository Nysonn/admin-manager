import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  Toolbar,
  SaveButton,
  useDataProvider,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import RichTextInput from "../../components/RichTextInput";
import slugify from "../../utils/slugify";

const statusChoices = [
  { id: "draft", name: "Draft" },
  { id: "published", name: "Published" },
];

const validateRequired = (v: any) => (v ? undefined : "Required");

// Custom toolbar component
const CustomToolbar = (toolbarProps: any) => (
  <Toolbar {...toolbarProps}>
    <SaveButton />
  </Toolbar>
);

const PagesCreate: React.FC = (props) => {
  const dataProvider = useDataProvider();

  // async validator factory for slug uniqueness
  const makeValidateSlug = () => async (value: string) => {
    if (!value) return "Required";
    try {
      const { total } = await dataProvider.getList("pages", {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "id", order: "ASC" },
        filter: { slug: value },
      });
      if (total && total > 0) {
        return "This slug is already in use";
      }
      return undefined;
    } catch (err) {
      console.warn("Slug uniqueness check failed", err);
      return undefined;
    }
  };

  // Component to auto-generate slug from title
  const SlugInput: React.FC = () => {
    const { setValue } = useFormContext();
    const title = useWatch({ name: "title" });
    const slug = useWatch({ name: "slug" });

    React.useEffect(() => {
      // Only auto-generate if slug is empty (not manually edited)
      if (title && !slug) {
        setValue("slug", slugify(title));
      }
    }, [title, slug, setValue]);

    return (
      <TextInput
        source="slug"
        label="Slug"
        helperText="Auto-generated from title, or enter manually."
        validate={makeValidateSlug()}
        fullWidth
      />
    );
  };

  return (
    <Create {...props}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="title" label="Title" validate={validateRequired} fullWidth />
        <SlugInput />
        <RichTextInput source="content" label="Content (HTML)" validate={validateRequired} fullWidth />
        <SelectInput source="status" choices={statusChoices} defaultValue="draft" />
      </SimpleForm>
    </Create>
  );
};

export default PagesCreate;
