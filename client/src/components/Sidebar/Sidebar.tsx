import { useState } from "react";
import { SidebarContainer, SidebarLink, Divider } from "./SidebarStyles";
import AuthService from "../../auth/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [username] = useState(
    window.localStorage.getItem("currentUserUsername") || ""
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.removeTokens();
    navigate("/login");
    toast.success("Logout successful");
  };

  return (
    <SidebarContainer>
      <p>{JSON.parse(username)}</p>
      <SidebarLink onClick={() => navigate("/home")}>Početna</SidebarLink>
      <SidebarLink onClick={() => navigate("/branch_selection")}>
        Knjiga popisa
      </SidebarLink>
      <Divider />
      <SidebarLink className="btn btn-danger" onClick={handleLogout}>
        Logout
      </SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
