import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: "Raleway", sans-serif;
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: relative;
  }
  p {
    margin: 10px 0;
    font-size: 1.5rem;
  }
`;

export const SidebarLink = styled.a`
  margin: 10px 0;
  text-decoration: none;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
`;

export const Divider = styled.hr`
  margin: 20px 0;
`;
