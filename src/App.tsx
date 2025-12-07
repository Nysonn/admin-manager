import React from "react";
import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import dataProvider from "./providers/dataProvider";
import authProvider from "./providers/authProvider";
import PagesList from "./resources/pages/PagesList";
import PagesCreate from "./resources/pages/PagesCreate";
import PagesEdit from "./resources/pages/PagesEdit";
import ImagesList from "./resources/images/ImageList";
import MenuBuilder from "./resources/menu/MenuBuilder";
import ProductsDashboard from "./resources/products/ProductsDashboard";
import PagePreview from "./pages/PagePreview";
// import NotFound from "./pages/NotFound";
import { Book as PagesIcon, Collections as ImagesIcon, Menu as MenuIcon,  ShoppingCart as ProductsIcon } from "@mui/icons-material";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="pages" list={PagesList} create={PagesCreate} edit={PagesEdit} icon={PagesIcon} />
        <Resource name="images" list={ImagesList} icon={ImagesIcon} />
        <Resource name="menu" list={MenuBuilder} icon={MenuIcon} />
        <Resource name="products" list={ProductsDashboard} icon={ProductsIcon} />
        
        <CustomRoutes noLayout>
          <Route path="/preview/:id" element={<PagePreview />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </CustomRoutes>
      </Admin>
    </BrowserRouter>
  );
};

export default App;
