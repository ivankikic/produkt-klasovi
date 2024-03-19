import styled from "styled-components";
import { Card } from "react-bootstrap";

export const DocumentsContainer = styled.div`
  .print svg {
    font-size: 24px;
    cursor: pointer;
  }
`;

export const Table = styled.table`
  width: 100%;
  background-color: #fff;
  border-collapse: collapse;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;

  th,
  td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #f4f4f4;
  }

  /* Custom column widths */
  th:nth-child(1) {
    width: calc(100% * 1.5 / 18);
  }
  th:nth-child(2) {
    width: calc(100% * 3 / 18);
  }
  th:nth-child(3) {
    width: calc(100% * 5 / 18);
  }
  th:nth-child(4),
  th:nth-child(5) {
    width: calc(100% * 3 / 18);
  }
  th:nth-child(6),
  th:nth-child(7) {
    width: calc(100% * 1 / 18);
  }
`;

export const FastFilterSection = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; // Adds some space before the table
  font-size: 1.2em;

  > div {
    display: flex;
    align-items: center;

    // Prevents date pickers and button from wrapping on smaller screens
    @media (min-width: 768px) {
      &:first-child {
        flex-grow: 1;
      }

      &:last-child {
        flex-shrink: 0;
      }
    }
  }

  .form-control,
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    margin-right: 10px; // Adds spacing between the date pickers and the filter button

    // Apply a minimum width to the date picker input to prevent it from shrinking too much
    input {
      min-width: 140px;
    }
  }

  button {
    white-space: nowrap; // Prevents the button text from wrapping
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; // Adjust as needed
`;

export const SubHeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; // Adjust as needed
  gap: 25px;
`;

export const SumSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; // Adjust as needed
  gap: 5px;
  div {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: 5px;
    padding-right: 30px;
  }
  .total {
    font-size: 1.5em;
  }
  .otherTotal {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.3em;
    gap: 10px;
  }
`;

export const BranchCardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const StyledCard = styled(Card)`
  width: 13rem;
  height: 13rem; // Adjust the height as needed
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: transform 0.2s; // Smooth transition for hover effect
  cursor: pointer;
  &:hover {
    transform: scale(1.05); // Slightly increase size on hover
  }

  .card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const NameText = styled.div`
  font-size: 1.5em; // Larger text for the name
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const InfoText = styled.div`
  font-size: 1em;
`;

export const PrintContent = styled.div`
  padding: 20px;
  .header {
    p {
      padding: 0;
      margin: 0;
    }
  }
  .branch {
    margin: 10px 0;
  }
  .printInfo {
    margin: 20px 0;
    p {
      margin: 0;
    }
  }
  table {
    width: 100%;
    border-collapse: collapse; // Ensures borders are neat
    margin-top: 20px;
    font-size: 0.9em; // Adjust font size for better readability
    margin: 20px 0;
    padding: 20px 0;
    th,
    td {
      padding: 8px;
      border: 1px solid #ddd; // Light grey border for less visual weight
      text-align: left; // Ensures content is aligned to the left
      vertical-align: top; // Aligns content to the top of the cell
    }

    th {
      background-color: #f4f4f4; // Light background color for headers
      font-weight: bold; // Makes header text bold
    }

    td {
      // Custom styling for date cells to ensure dates are easily readable
      &:nth-child(2) {
        white-space: nowrap; // Prevents dates from wrapping
      }
    }
  }
`;
