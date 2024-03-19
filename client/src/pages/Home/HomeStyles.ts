import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  margin-left: 50px;
  width: 100%;
  height: 100%;
  text-align: center;

  h2 {
    font-size: 3rem;
    font-family: "Raleway", sans-serif;
    font-weight: 600;
  }

  p {
    font-size: 1.3rem;
    margin-left: 10px;
  }
`;
