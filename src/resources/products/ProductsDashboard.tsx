import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types";

import HeaderSection from "../../components/ProductsDashboard/HeaderSection";
import FiltersSection from "../../components/ProductsDashboard/FiltersSection";
import ProductsTable from "../../components/ProductsDashboard/ProductsTable";

export default function ProductsDashboard() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Compose params for data fetching
  const params = useMemo(
    () => ({ 
      page, 
      perPage, 
      search: search.trim() || undefined, 
      category: category || undefined 
    }),
    [page, perPage, search, category]
  );

  // Fetch product data
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useProducts(params);

  const total = data?.total ?? 0;
  const products: Product[] = data?.data ?? [];

  return (
    <Box sx={{ pt: { xs: 2, sm: 3 } }}>
      
      {/* 1. Header and Refresh Action */}
      <HeaderSection 
        isFetching={isFetching}
        dataUpdatedAt={dataUpdatedAt}
      />
      
      {/* 2. Filters and Search */}
      <FiltersSection
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        isLoading={isLoading}
        productsLength={products.length}
        total={total}
      />

      {/* 3. Product Table and Pagination */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        perPage={perPage}
        total={total}
        page={page}
        setPage={setPage}
      />
    </Box>
  );
}