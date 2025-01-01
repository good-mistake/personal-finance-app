import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  return <Outlet context={{ isAuthenticated }} />;
};

export default ProtectedRoutes;
