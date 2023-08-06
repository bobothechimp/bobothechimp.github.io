import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Tweet } from "react-twitter-widgets";

import "../styles/home.css";

function Home() {
  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col md={{ span: 3 }}>
            <Tweet tweetId="1676630703344156676" options={{ width: "100%" }} />
            <Tweet tweetId="1654911485586427907" options={{ width: "100%" }} />
          </Col>
          <Col md={{ span: 5 }}>
            <h1 className="sectionTitle">Welcome</h1>
            <p>
              The Boston University Smash Society (BUSS) holds the biggest{" "}
              <i>Super Smash Bros.</i> gatherings at BU. For over six years,
              we've brought people together of all skill levels and backgrounds
              to enjoy playing with other people in Smash. We hold weekly
              tournaments for Ultimate, Melee, and Brawl throughout each school
              semester, and we look forward to seeing you at our next event!
            </p>
            <Button className="stdButton">Read More</Button>
            <h1 className="sectionTitle">Tournaments</h1>
            <p>
              Interested in checking out our history of events? We've archived
              several semesters worth of tournaments with key information and
              links to their bracket pages.
            </p>
            <Button className="stdButton">Tournaments</Button>
            <h1 className="sectionTitle">Players</h1>
            <p>
              We've also compiled detailed statistics for all players that have
              entered one of our events. Check them out below.
            </p>
            <Button className="stdButton">Players</Button>
          </Col>
          <Col md={{ span: 3 }}></Col>
        </Row>
        {/* Last time, next time */}
        {/* Welcome and who are we */}
        {/* Check out our tournament archives */}
        {/* Check out our player stats */}
      </Container>
      <Footer />
    </>
  );
}

export default Home;
