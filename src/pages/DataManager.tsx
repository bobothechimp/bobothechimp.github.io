import React, { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SeasonsManager from "../components/admin/SeasonsManager";
import TournamentsManager from "../components/admin/TournamentsManager";
import EventsManager from "../components/admin/EventsManager";

import "../styles/dataManager.css";

const DataManager = () => {
  const [SEASONS_KEY, TOURNAMENTS_KEY, EVENTS_KEY] = ["0", "1", "2"];
  const [seasons, setSeasons] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [events, setEvents] = useState([]);

  const getData = (curTable) => {
    fetch("http://localhost:5000/seasons")
      .then((res) => res.json())
      .then((data) => {
        setSeasons(data);

        //Reloading component with new data
        if (curTable === SEASONS_KEY) {
          setActiveTable(
            <SeasonsManager
              seasons={data}
              getData={() => getData(SEASONS_KEY)}
            />
          );
        }
      });
    fetch("http://localhost:5000/tournaments")
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data);

        //Reloading component with new data
        if (curTable === TOURNAMENTS_KEY) {
          setActiveTable(
            <TournamentsManager
              seasons={seasons}
              tournaments={data}
              getData={() => getData(TOURNAMENTS_KEY)}
            />
          );
        }
      });
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);

        //Reloading component with new data
        if (curTable === EVENTS_KEY) {
          setActiveTable(
            <EventsManager
              tournaments={tournaments}
              events={data}
              getData={() => getData(EVENTS_KEY)}
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
          <EventsManager
            tournaments={tournaments}
            events={events}
            getData={() => getData(EVENTS_KEY)}
          />
        );
        break;
    }
  };

  return (
    <>
      <Header />
      <Container>
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
        </Nav>
        {activeTable}
      </Container>
      <Footer />
    </>
  );
};

export default DataManager;
