import { Filter, TextInput, SelectInput } from "react-admin";
import { useTheme, alpha } from "@mui/material";

interface PageFiltersProps {
  [key: string]: unknown;
}

const PageFilters: React.FC<PageFiltersProps> = (props) => {
  const theme = useTheme();
  
  // Define common styles for input fields
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
      transition: 'all 0.2s ease-in-out',
      '& fieldset': {
        borderColor: alpha(theme.palette.primary.main, 0.2),
      },
      '&:hover': {
        backgroundColor: 'background.paper',
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
        '& fieldset': {
          borderColor: alpha(theme.palette.primary.main, 0.4),
        },
      },
      '&.Mui-focused': {
        backgroundColor: 'background.paper',
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
        '& fieldset': {
          borderColor: theme.palette.primary.main,
        },
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 600,
    },
  };

  return (
    <Filter {...props}>
      <TextInput 
        label="Search pages" 
        source="q" 
        alwaysOn
        placeholder="Search by title or content..."
        sx={{
          minWidth: { xs: '100%', sm: 320 },
          ...inputSx,
          '& input::placeholder': {
            color: alpha(theme.palette.text.secondary, 0.6),
            opacity: 1,
          },
        }}
      />
      <SelectInput
        source="status"
        label="Filter by status"
        choices={[
          { id: "published", name: "Published" },
          { id: "draft", name: "Draft" },
        ]}
        alwaysOn={false}
        emptyValue={""}
        sx={{
          minWidth: 150,
          ...inputSx,
        }}
      />
    </Filter>
  );
};

export default PageFilters;