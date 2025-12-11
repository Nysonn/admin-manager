import React from "react";
import {
  Datagrid,
  TextField,
  FunctionField,
  DateField,
  useListContext,
} from "react-admin";
import { 
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import { StatusField, TitleLinkField, ActionButtons } from "./DataGridFields";

/**
 * Skeleton row for pages table
 */
const PagesTableSkeletonRow: React.FC<{ isMobile: boolean }> = ({ isMobile }) => (
  <TableRow>
    <TableCell sx={{ py: 2.5, px: 2 }}>
      <Skeleton variant="text" width="70%" height={24} />
    </TableCell>
    {!isMobile && (
      <TableCell sx={{ py: 2.5, px: 2 }}>
        <Skeleton variant="rounded" width={120} height={28} sx={{ borderRadius: 1 }} />
      </TableCell>
    )}
    <TableCell sx={{ py: 2.5, px: 2 }}>
      <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: 12 }} />
    </TableCell>
    {!isMobile && (
      <TableCell sx={{ py: 2.5, px: 2 }}>
        <Skeleton variant="text" width={100} height={20} />
      </TableCell>
    )}
    <TableCell sx={{ py: 2.5, px: 2 }} align="right">
      <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: 2, ml: 'auto' }} />
    </TableCell>
  </TableRow>
);

/**
 * Pages table with loading skeleton support
 */
const PagesTableWithSkeleton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoading } = useListContext();

  if (isLoading) {
    return (
      <Paper 
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.15),
          boxShadow: `0 1px 3px ${alpha('#000', 0.08)}`,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  py: 2.5,
                  px: 2,
                }}>
                  Title
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'primary.main',
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    py: 2.5,
                    px: 2,
                  }}>
                    Slug
                  </TableCell>
                )}
                <TableCell sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  py: 2.5,
                  px: 2,
                }}>
                  Status
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'primary.main',
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    py: 2.5,
                    px: 2,
                  }}>
                    Created
                  </TableCell>
                )}
                <TableCell align="right" sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  py: 2.5,
                  px: 2,
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <PagesTableSkeletonRow key={`skeleton-${index}`} isMobile={isMobile} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  return (
    <Datagrid 
      bulkActionButtons={false} 
      rowClick={false}
      sx={{
        '& .RaDatagrid-headerCell': {
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
          fontWeight: 700,
          fontSize: '0.8125rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'primary.main',
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          py: 2.5,
        },
        '& .RaDatagrid-row': {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            transform: 'scale(1.001)',
          },
        },
        '& .RaDatagrid-rowCell': {
          borderBottom: '1px solid',
          borderColor: alpha('#000', 0.06),
          py: 2.5,
          px: 2,
        },
      }}
    >
      <FunctionField 
        label="Title" 
        render={() => <TitleLinkField />}
        sx={{ minWidth: isMobile ? 150 : 250 }}
      />
      {!isMobile && (
        <TextField 
          source="slug" 
          sx={{ 
            color: 'text.secondary',
            fontFamily: 'monospace',
            fontSize: '0.8125rem',
            fontWeight: 500,
            backgroundColor: alpha('#000', 0.02),
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            display: 'inline-block',
          }} 
        />
      )}
      <FunctionField 
        label="Status" 
        render={() => <StatusField />}
      />
      {!isMobile && (
        <DateField 
          source="createdAt" 
          label="Created"
          showTime={false}
          sx={{ 
            color: 'text.secondary', 
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}
        />
      )}
      <FunctionField 
        label="Actions" 
        render={() => <ActionButtons />}
        textAlign="right"
      />
    </Datagrid>
  );
};

export default PagesTableWithSkeleton;
