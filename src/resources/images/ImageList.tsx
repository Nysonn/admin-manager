import React, { useState } from "react";
import { List } from "react-admin";
import ImagesListContent from "../../components/ImageList/ImageListContent";

/**
 * Image Gallery Main Component
 * Manages the top-level List context and the current view mode (grid/list).
 */
const ImagesList: React.FC = (props) => {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <List {...props} perPage={48}>
      <ImagesListContent
        view={view}
        setView={setView}
      />
    </List>
  );
};

export default ImagesList;