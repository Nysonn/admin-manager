import React, { lazy, Suspense } from "react"; 
import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import dataProvider from "./providers/dataProvider";
import authProvider from "./providers/authProvider";
import CustomLoginPage from "./components/LoginPage/CustomLoginPage";
import ErrorBoundary from "./components/ErrorBoundary";
import Loading from "./components/Loading";
import { Book as PagesIcon, Collections as ImagesIcon, Menu as MenuIcon, ShoppingCart as ProductsIcon } from "@mui/icons-material";

// --- Pages Resources being lazy loaded ---
const LazyPagesList = lazy(() => import("./resources/pages/PagesList"));
const LazyPagesCreate = lazy(() => import("./resources/pages/PagesCreate"));
const LazyPagesEdit = lazy(() => import("./resources/pages/PagesEdit"));
const LazyImagesList = lazy(() => import("./resources/images/ImageList"));
const LazyMenuList = lazy(() => import("./resources/menu/MenuList"));
const LazyProductsDashboard = lazy(() => import("./resources/products/ProductsDashboard"));

// --- Custom Routes ---
const LazyPagePreview = lazy(() => import("./pages/PagePreview"));
const LazyMenuPreview = lazy(() => import("./pages/MenuPreview"));

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000, // 30 seconds
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Admin 
            dataProvider={dataProvider} 
            authProvider={authProvider}
            loginPage={CustomLoginPage}
          >
            <Resource 
                name="pages" 
                list={LazyPagesList} 
                create={LazyPagesCreate} 
                edit={LazyPagesEdit} 
                icon={PagesIcon} 
            />
            <Resource name="images" list={LazyImagesList} icon={ImagesIcon} />
            <Resource name="menu" list={LazyMenuList} icon={MenuIcon} />
            <Resource name="products" list={LazyProductsDashboard} icon={ProductsIcon} />

            <CustomRoutes noLayout>
              <Route path="/preview/:id" element={
                <Suspense fallback={<Loading />}>
                  <LazyPagePreview />
                </Suspense>
              } />
              <Route path="/menu-preview" element={
                <Suspense fallback={<Loading />}>
                  <LazyMenuPreview />
                </Suspense>
              } />
            </CustomRoutes>
          </Admin>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
    </ErrorBoundary>
  );
};

export default App;