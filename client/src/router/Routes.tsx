import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home/Home";
import Documents from "../pages/Documents/Documents";
import BranchSelection from "../pages/Documents/BranchSelection";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      {/*<Route path="/register" element={<Register />} />*/}
      <Route element={<ProtectedRoute />}>
        {/*<Route path="/edit" element={<Edit />} />*/}
        <Route path="/home" element={<Home />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/branch_selection" element={<BranchSelection />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
