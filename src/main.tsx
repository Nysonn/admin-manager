import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";

// react query for fetching data from an external backend
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Material UI theme config
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", 
    },
    secondary: {
      main: "#0288d1",
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, 
      gcTime: 1000 * 60 * 5, 
      retry: 2, 
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <QueryClientProvider client={queryClient}>
       <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
     </QueryClientProvider>
  </StrictMode>,
)
