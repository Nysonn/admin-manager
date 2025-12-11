import React from "react";
import {
  Edit,
} from "react-admin";
import PageEditFormLayout from "../../components/PagesEdit/PageEditFormLayout";

const PagesEdit: React.FC = (props) => {
  return (
    <Edit {...props}>
      <PageEditFormLayout />
    </Edit>
  );
};

export default PagesEdit;