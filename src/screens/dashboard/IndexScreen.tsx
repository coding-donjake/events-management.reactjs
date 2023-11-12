import React from "react";
import AdminNavigation from "../../navigations/AdminNavigation";

const IndexScreen = () => {
  document.title = "Dashboard";

  return (
    <div className="flex h-screen">
      <AdminNavigation />
    </div>
  );
};

export default IndexScreen;
