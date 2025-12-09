import React, { useState } from "react";
import { Box } from "@mui/material";
import { PageHeader } from "./PageHeader";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { MainContentWrapper } from "./MainContentWrapper";
import { PageFooter } from "./PageFooter";

interface PageLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Note: useTheme and useMediaQuery logic can be kept in PageHeader/MobileNavDrawer 
  // if their state/behavior depends only on the viewport, 
  // which is how they are structured above.

  // In a real application, currentPath would often come from a router like Next.js or React Router
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
      }}
    >
      <PageHeader 
        navLinks={navLinks} 
        toggleMobileMenu={toggleMobileMenu} 
        currentPath={currentPath} 
      />

      <MobileNavDrawer
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        navLinks={navLinks}
        currentPath={currentPath}
      />

      <MainContentWrapper>
        {children}
      </MainContentWrapper>

      <PageFooter />
    </Box>
  );
};

export default PageLayout;