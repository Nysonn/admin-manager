import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";

// react query for fetching data from an external backend
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Material UI theme config with proper dark mode
const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: "#90caf9", // Better contrast for dark mode
    },
    secondary: {
      main: "#ce93d8",
    },
    background: {
      default: "#121212", // Consistent dark background
      paper: "#1e1e1e",   // Slightly lighter for cards/paper
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121212",
        },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // Increased to 2 minutes to reduce API calls
      gcTime: 1000 * 60 * 5, 
      retry: 3, // Increased retries for rate limit resilience
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
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
