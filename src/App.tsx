import React from "react";
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
import PagesList from "./resources/pages/PagesList";
import PagesCreate from "./resources/pages/PagesCreate";
import PagesEdit from "./resources/pages/PagesEdit";
import ImagesList from "./resources/images/ImageList";
import MenuList from "./resources/menu/MenuList";
import ProductsDashboard from "./resources/products/ProductsDashboard";
import PagePreview from "./pages/PagePreview";
import MenuPreview from "./pages/MenuPreview";
import { Book as PagesIcon, Collections as ImagesIcon, Menu as MenuIcon, ShoppingCart as ProductsIcon } from "@mui/icons-material";

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
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Admin 
            dataProvider={dataProvider} 
            authProvider={authProvider}
            loginPage={CustomLoginPage}
          >
            <Resource name="pages" list={PagesList} create={PagesCreate} edit={PagesEdit} icon={PagesIcon} />
            <Resource name="images" list={ImagesList} icon={ImagesIcon} />
            <Resource name="menu" list={MenuList} icon={MenuIcon} />
            <Resource name="products" list={ProductsDashboard} icon={ProductsIcon} />

            <CustomRoutes noLayout>
              <Route path="/preview/:id" element={<PagePreview />} />
              <Route path="/menu-preview" element={<MenuPreview />} />
            </CustomRoutes>
          </Admin>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default App;
