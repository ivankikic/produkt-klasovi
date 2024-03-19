import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex-grow: 1;
  padding: 20px; // Adjust padding as needed
  margin-left: 250px; // Equal to the width of the Sidebar to ensure content does not overlap
  @media (max-width: 768px) {
    margin-left: 0; // Sidebar is full width or not fixed on smaller screens
  }
  font-family: "Raleway", sans-serif;
`;
