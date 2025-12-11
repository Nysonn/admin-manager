import React from "react";
import {
  Card,
  CardContent,
  Box,
  Skeleton,
  Stack,
} from "@mui/material";

/**
 * Skeleton loader for image card
 */
const ImageCardSkeleton: React.FC = () => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '2px solid',
        borderColor: 'divider',
      }}
    >
      {/* Image skeleton */}
      <Skeleton 
        variant="rectangular" 
        sx={{ 
          width: '100%', 
          paddingTop: '75%', // 4:3 aspect ratio
        }} 
      />

      {/* Content skeleton */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Stack spacing={1.5}>
          {/* Title skeleton */}
          <Skeleton variant="text" width="80%" height={24} />
          
          {/* Metadata row 1 */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
          
          {/* Metadata row 2 */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={120} height={20} />
          </Box>
        </Stack>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={40} height={36} sx={{ borderRadius: 2 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ImageCardSkeleton;
