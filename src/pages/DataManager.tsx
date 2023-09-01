import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SeasonsManager from "../components/admin/SeasonsManager";
import TournamentsManager from "../components/admin/TournamentsManager";
import EventsManager from "../components/admin/EventsManager";
import PlayersManager from "../components/admin/PlayersManager";

import * as ROUTES from "../global/routes";

import "../styles/dataManager.css";

const DataManager = () => {
  // IDs for each data tab
  const [SEASONS_KEY, TOURNAMENTS_KEY, EVENTS_KEY, PLAYERS_KEY] = [
    "0",
    "1",
    "2",
    "3",
  ];
  const [seasons, setSeasons] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState([]);

  // Fetch all data (and reload the current tab with its new data)
  const getData = (curTable) => {
    fetch(ROUTES.SERVER_GET_SEASONS)
      .then((res) => res.json())
      .then((data) => {
        setSeasons(data["seasons"]);

        //Reloading component with new data
        if (curTable === SEASONS_KEY) {
          setActiveTable(
            <SeasonsManager
              seasons={data["seasons"]}
              getData={() => getData(SEASONS_KEY)}
            />
          );
        }
      });
    fetch(ROUTES.SERVER_GET_TOURNAMENTS)
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data["tournaments"]);

        //Reloading component with new data
        if (curTable === TOURNAMENTS_KEY) {
          setActiveTable(
            <TournamentsManager
              seasons={seasons}
              tournaments={data["tournaments"]}
              getData={() => getData(TOURNAMENTS_KEY)}
            />
          );
        }
      });
    fetch(ROUTES.SERVER_GET_EVENTS)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data["events"]);

        //Reloading component with new data
        if (curTable === EVENTS_KEY) {
          setActiveTable(
            <EventsManager
              events={data["events"]}
              getData={() => getData(EVENTS_KEY)}
            />
          );
        }
      });
    fetch(ROUTES.SERVER_GET_PLAYERS)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data["players"]);

        //Reloading component with new data
        if (curTable === PLAYERS_KEY) {
          setActiveTable(
            <PlayersManager
              players={data["players"]}
              getData={() => getData(PLAYERS_KEY)}
            />
          );
        }
      });
  };

  const [activeTable, setActiveTable] = useState(
    <SeasonsManager seasons={seasons} getData={() => getData("0")} />
  );

  useEffect(() => {
    getData(SEASONS_KEY);
  }, []);

  const handleSelect = (eventKey) => {
    switch (eventKey) {
      case SEASONS_KEY:
        setActiveTable(
          <SeasonsManager
            seasons={seasons}
            getData={() => getData(SEASONS_KEY)}
          />
        );
        break;
      case TOURNAMENTS_KEY:
        setActiveTable(
          <TournamentsManager
            seasons={seasons}
            tournaments={tournaments}
            getData={() => getData(TOURNAMENTS_KEY)}
          />
        );
        break;
      case EVENTS_KEY:
        setActiveTable(
          <EventsManager events={events} getData={() => getData(EVENTS_KEY)} />
        );
        break;
      case PLAYERS_KEY:
        setActiveTable(
          <PlayersManager
            players={players}
            getData={() => getData(PLAYERS_KEY)}
          />
        );
    }
  };

  return (
    <>
      <Header />
      <Container className="dataTabs">
        <Nav
          variant="tabs"
          defaultActiveKey={SEASONS_KEY}
          onSelect={handleSelect}
        >
          <Nav.Item>
            <Nav.Link eventKey={SEASONS_KEY}>Seasons</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TOURNAMENTS_KEY}>Tournaments</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={EVENTS_KEY}>Events</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={PLAYERS_KEY}>Players</Nav.Link>
          </Nav.Item>
        </Nav>
        {activeTable}
      </Container>
      <Footer />
    </>
  );
};

export default DataManager;
