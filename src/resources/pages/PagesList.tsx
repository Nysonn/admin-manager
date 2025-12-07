// Pages list view using react-admin.
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  Filter,
  TextInput,
  SelectInput,
  useRecordContext,
  FunctionField,
} from "react-admin";
import { Chip, Link } from "@mui/material";

const PageFilters = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search by title" source="q" alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: "published", name: "Published" },
        { id: "draft", name: "Draft" },
      ]}
      alwaysOn={false}
      emptyValue={""}
    />
  </Filter>
);

const ListActions: React.FC = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// Status chip for datagrid
const StatusField: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;
  const color = record.status === "published" ? "success" : "default";
  const label = record.status === "published" ? "Published" : "Draft";
  return <Chip label={label} size="small" color={color as any} />;
};

// Clickable title field that navigates to preview
const TitleLinkField: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const slug = record.slug ?? record.id;
    window.open(`/preview/${slug}`, '_blank');
  };

  return (
    <Link
      href="#"
      onClick={handleClick}
      sx={{ 
        color: "inherit", 
        textDecoration: "none",
        "&:hover": { textDecoration: "underline" },
        cursor: "pointer"
      }}
    >
      {record.title}
    </Link>
  );
};

const PagesList: React.FC = (props) => {
  return (
    <List {...props} filters={<PageFilters />} actions={<ListActions />}>
      <Datagrid bulkActionButtons={false} rowClick={false}>
        <FunctionField label="Title" render={() => <TitleLinkField />} />
        <TextField source="slug" />
        <StatusField />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export default PagesList;
