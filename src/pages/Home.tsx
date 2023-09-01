import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Tweet } from "react-twitter-widgets";

import Header from "../components/Header";
import Footer from "../components/Footer";
import TournamentCard from "../components/tournaments/TournamentCard";

import * as ROUTES from "../global/routes";

import UltimateBanner from "../assets/home-banner/ultimate_banner.png";
import MeleeBanner from "../assets/home-banner/melee_banner.jpg";
import BrawlBanner from "../assets/home-banner/brawl_banner.jpg";

import "../styles/home.css";

function Home() {
  const [latestTournament, setLatestTournament] = useState({});
  const [latestEvents, setLatestEvents] = useState([]);

  // Get most recent tournament
  useEffect(() => {
    fetch(ROUTES.SERVER_GET_LATEST_TOURNAMENT)
      .then((res) => res.json())
      .then((data) => setLatestTournament(data));
  }, []);

  // Get events of most recent tournament once it's loaded
  useEffect(() => {
    if (latestTournament["id"] != null) {
      fetch(ROUTES.SERVER_EVENTS_FROM_TOURNAMENT(latestTournament["id"]))
        .then((res) => res.json())
        .then((data) => {
          setLatestEvents(data["events"]);
        });
    }
  }, [latestTournament]);

  return (
    <>
      <Header />
      <Container>
        <Row className="banner">
          <div id="ultBanner" className="oddBanner">
            <img src={UltimateBanner} />
            <img src={UltimateBanner} />
          </div>
          <div id="melBanner" className="evenBanner">
            <img src={MeleeBanner} />
            <img src={MeleeBanner} />
          </div>
          <div id="brlBanner" className="oddBanner">
            <img src={BrawlBanner} />
            <img src={BrawlBanner} />
          </div>
          <div id="fade" />
          <div id="titleOverlay">
            <p>BU SMASH</p>
          </div>
        </Row>
        <Row>
          <Col md={{ span: 3 }}>
            <Tweet tweetId="1676630703344156676" options={{ width: "100%" }} />
            <Tweet tweetId="1654911485586427907" options={{ width: "100%" }} />
          </Col>
          <Col md={{ span: 6 }} className="middleColumn">
            <h1 className="sectionTitle">Welcome</h1>
            <p>
              The Boston University Smash Society (BUSS) holds the biggest{" "}
              <i>Super Smash Bros.</i> gatherings at BU. For over six years,
              we've brought people together of all skill levels and backgrounds
              to enjoy playing with other people in Smash. We hold weekly
              tournaments for Ultimate, Melee, and Brawl throughout each school
              semester, and we look forward to seeing you at our next event!
            </p>
            <div className="btn-container">
              <Button>Read More</Button>
            </div>
            <h1 className="sectionTitle">Tournaments</h1>
            <p>
              Interested in checking out our history of events? We've archived
              several semesters worth of tournaments with key information and
              links to their bracket pages.
            </p>
            <div className="btn-container">
              <Button>Tournaments</Button>
            </div>
            <h1 className="sectionTitle">Players</h1>
            <p>
              We've also compiled detailed statistics for all players that have
              entered one of our events. Check them out below.
            </p>
            <div className="btn-container">
              <Button>Players</Button>
            </div>
          </Col>
          <Col md={{ span: 3 }}>
            <h1 className="sectionTitle">Latest Tournaments</h1>
            {latestEvents.length > 0 && (
              <TournamentCard
                title={latestEvents["0"]["tournamentName"]}
                date={latestTournament["date"]}
                events={latestEvents}
              />
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Home;
