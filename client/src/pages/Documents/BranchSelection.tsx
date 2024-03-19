import { Content, LayoutContainer } from "../PagesStyles";
import Sidebar from "../../components/Sidebar/Sidebar";
import axiosClient from "../../auth/apiClient";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BranchCard from "./BranchCard";
import { BranchCardsContainer } from "./DocumentsStyles";

interface Branch {
  Id: string;
  Name: string;
  Address: string;
  Phone: string;
}

const BranchSelection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [branches, setBranches] = useState<Branch[] | null>(null);
  const navigate = useNavigate();

  const getBranches = async () => {
    try {
      const response = await axiosClient.get("/api/documents/branches");
      setBranches(response.data.branches);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window?.localStorage?.getItem("currentUserRole") !== "0") {
      navigate("/documents");
    } else {
      window?.localStorage?.setItem("chosenCurrentUserRole", "0");
      getBranches();
    }
  }, [navigate]);

  const handleBranchSelection = (branchId: string) => {
    window?.localStorage?.setItem("chosenCurrentUserRole", branchId);
    navigate("/documents");
  };

  return (
    <LayoutContainer>
      <Sidebar />
      <Content>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            <h1 className="mt-3">Odaberite poslovnicu</h1>
            <BranchCardsContainer className="mt-5">
              {branches &&
                branches?.map((branch: Branch) => (
                  <BranchCard
                    key={branch.Id}
                    name={branch.Name}
                    address={branch.Address}
                    phone={branch.Phone}
                    onClick={() => handleBranchSelection(branch.Id)}
                  />
                ))}
            </BranchCardsContainer>
          </div>
        )}
      </Content>
    </LayoutContainer>
  );
};

export default BranchSelection;
