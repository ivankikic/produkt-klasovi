import React from "react";
import { Card } from "react-bootstrap";
import { BsFillHouseFill } from "react-icons/bs";
import { StyledCard, NameText, InfoText } from "./DocumentsStyles"; // Import styled components

interface BranchCardProps {
  name: string;
  address: string;
  phone: string;
  onClick?: () => void;
}

const BranchCard: React.FC<BranchCardProps> = ({
  name,
  address,
  phone,
  onClick,
}) => {
  return (
    <StyledCard onClick={onClick}>
      <Card.Body>
        <BsFillHouseFill size="4em" /> {/* Larger House icon */}
        <NameText>{name}</NameText>
        <InfoText>{address}</InfoText>
        <InfoText>{phone}</InfoText>
      </Card.Body>
    </StyledCard>
  );
};

export default BranchCard;
