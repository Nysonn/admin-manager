import React from "react";
import {
  Create,
  useRedirect,
  useNotify,
} from "react-admin";
import PageCreateFormLayout from "../../components/PagesCreate/PageCreateFormLayout";

const PagesCreate: React.FC = (props) => {
  const redirect = useRedirect();
  const notify = useNotify();

  // Handle successful submission
  const onSuccess = () => {
    notify('Page created successfully', { type: 'success' });
    redirect('list', 'pages');
  };

  return (
    <Create 
      {...props} 
      resource="pages" 
      redirect="list"
      mutationOptions={{ onSuccess }}
    >
      <PageCreateFormLayout />
    </Create>
  );
};

export default PagesCreate;