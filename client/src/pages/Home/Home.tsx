import { Container, WelcomeContainer } from "./HomeStyles";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Content, LayoutContainer } from "../PagesStyles";

const Home = () => {
  return (
    <LayoutContainer>
      <Sidebar />
      <Content>
        <Container>
          <WelcomeContainer>
            <h2 className="mt-5">PANINO HVAR d.o.o.</h2>
            <p>Vrisnik 109</p>
            <p>OIB: 20008649741</p>
            <p>IBAN: HR8923400091111216174</p>
          </WelcomeContainer>
        </Container>
      </Content>
    </LayoutContainer>
  );
};

export default Home;
