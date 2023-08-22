import { useState, useEffect } from "react";
import {
  ListGroup,
  Form,
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
} from "react-bootstrap";

import EventCard from "./EventCard";

import * as ROUTES from "../../global/routes";

const TournamentList = () => {
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState("-1");
  const [tournaments, setTournaments] = useState([]);
  const [disableTournaments, setDisableTournaments] = useState(true);
  const [tournament, setTournament] = useState("-1");
  const [events, setEvents] = useState([]);
  const [winners, setWinners] = useState([[]]);

  useEffect(() => {
    fetch(ROUTES.SERVER_GET_SEASONS)
      .then((res) => res.json())
      .then((data) => {
        setSeasons(data);
      });
  }, []);

  useEffect(() => {
    if (season === "-1") {
      resetTournaments();
      fetch(ROUTES.SERVER_GET_EVENTS)
        .then((res) => res.json())
        .then((data) => {
          setEvents(data);
        });
    } else {
      fetch(ROUTES.SERVER_TOURNAMENTS_FROM_SEASON(season))
        .then((res) => res.json())
        .then((data) => {
          setTournaments(data);
          setTournament("-1");
          setDisableTournaments(false);
        });
      fetch(ROUTES.SERVER_EVENTS_FROM_SEASON(season))
        .then((res) => res.json())
        .then((data) => {
          setEvents(data);
        });
    }
  }, [season]);

  useEffect(() => {
    if (tournament === "-1") {
      // setEvents([]);
      return;
    }
    fetch(ROUTES.SERVER_EVENTS_FROM_TOURNAMENT(tournament))
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      });
  }, [tournament]);

  const updateSeason = (selectedSeason) => {
    setSeason(selectedSeason.target.value);
  };
  const updateTournament = (selectedTournament) => {
    setTournament(selectedTournament.target.value);
  };

  const resetTournaments = () => {
    setTournament("-1");
    setTournaments([]);
    setDisableTournaments(true);
  };

  return (
    <Container>
      <h1 className="sectionTitle">Tournaments</h1>
      <Row>
        <Col lg={{ span: 4 }} className="dataSelectForm">
          <Form>
            <FormGroup className="seasonSelect">
              <FormLabel>Select a season</FormLabel>
              <Form.Select size="sm" defaultValue={-1} onChange={updateSeason}>
                <option key={-1} value={-1}>
                  Season
                </option>
                {seasons.map((season) => (
                  <option key={season["id"]} value={season["id"]}>
                    {season["game"]} Season {season["season"]}
                  </option>
                ))}
              </Form.Select>
            </FormGroup>
            <FormGroup className="tournamentSelect">
              <FormLabel>Select a tournament</FormLabel>
              <Form.Select
                disabled={disableTournaments}
                size="sm"
                defaultValue={-1}
                onChange={updateTournament}
              >
                <option key={-1} value={-1}>
                  Tournament
                </option>
                {tournaments.map((tournament) => {
                  let tournamentName;
                  let twString = "" + tournament["week"];
                  if (twString.substring(0, 2) === "BM") {
                    tournamentName = "Bimonthly " + twString.substring(2);
                  } else {
                    tournamentName = "Week " + twString;
                  }
                  return (
                    <option key={tournament["id"]} value={tournament["id"]}>
                      {tournamentName}
                    </option>
                  );
                })}
              </Form.Select>
            </FormGroup>
          </Form>
        </Col>
        <Col lg={{ span: 8 }}>
          {events.map((event) => (
            <Row key={event["id"]}>
              <EventCard
                title={event["title"]}
                date={event["date"]}
                tournamentName={event["tournamentName"]}
                entrants={event["entrants"]}
                link={event["link"]}
                winners={event["top3"]}
                upset={event["topUpset"]}
                spr={event["topSPR"]}
              />
            </Row>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default TournamentList;
