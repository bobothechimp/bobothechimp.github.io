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
import PageSelect from "../PageSelect";

import * as ROUTES from "../../global/routes";

const TournamentList = () => {
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState("-1");
  const [tournaments, setTournaments] = useState([]);
  const [disableTournaments, setDisableTournaments] = useState(true);
  const [tournament, setTournament] = useState("-1");
  const [events, setEvents] = useState([]);

  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const perPageOptions = [5, 10, 15, 20];

  useEffect(() => {
    fetch(ROUTES.SERVER_GET_SEASONS)
      .then((res) => res.json())
      .then((data) => {
        setSeasons(data["seasons"]);
      });
  }, []);

  useEffect(() => {
    if (season === "-1") {
      resetTournaments();
      fetch(ROUTES.SERVER_GET_EVENTS, {
        method: "POST",
        body: JSON.stringify({
          page: page,
          perPage: perPage,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setEvents(data["events"]);
          setTotalEvents(data["total"]);
        });
    } else {
      fetch(ROUTES.SERVER_TOURNAMENTS_FROM_SEASON(season))
        .then((res) => res.json())
        .then((data) => {
          setTournaments(data["tournaments"]);
          setTournament("-1");
          setDisableTournaments(false);
        });
      fetch(ROUTES.SERVER_EVENTS_FROM_SEASON(season), {
        method: "POST",
        body: JSON.stringify({
          page: page,
          perPage: perPage,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setEvents(data["events"]);
          setTotalEvents(data["total"]);
        });
    }
  }, [season, page]);

  useEffect(() => {
    if (season != "-1" && tournament === "-1") {
      fetch(ROUTES.SERVER_EVENTS_FROM_SEASON(season), {
        method: "POST",
        body: JSON.stringify({
          page: page,
          perPage: perPage,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setEvents(data["events"]);
          setTotalEvents(data["total"]);
        });
    } else if (season != "-1") {
      fetch(ROUTES.SERVER_EVENTS_FROM_TOURNAMENT(tournament))
        .then((res) => res.json())
        .then((data) => {
          setEvents(data["events"]);
          setTotalEvents(data["total"]);
        });
    }
  }, [tournament]);

  const updateSeason = (selectedSeason) => {
    setSeason(selectedSeason.target.value);
  };
  const updateTournament = (selectedTournament) => {
    setTournament(selectedTournament.target.value);
  };

  const updatePerPage = (selectedPerPage) => {
    setPerPage(Number(selectedPerPage.target.value));
  };

  useEffect(() => {
    setPage(1);
  }, [season, tournament, perPage]);

  const resetTournaments = () => {
    setTournament("-1");
    setTournaments([]);
    setDisableTournaments(true);
  };

  return (
    <Container>
      <h1 className="sectionTitle">Tournaments</h1>
      <Row>
        <Col lg={{ span: 4 }}>
          <div className="dataSelectForm">
            <Form>
              <FormGroup className="seasonSelect">
                <FormLabel>Select a season</FormLabel>
                <Form.Select
                  size="sm"
                  defaultValue={-1}
                  onChange={updateSeason}
                >
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
          </div>
          <div className="pageSelect">
            <PageSelect
              current={page}
              total={Math.ceil((1.0 * totalEvents) / perPage)}
              onChange={(newPage) => setPage(newPage)}
            >
              <p className="text-muted">
                Displaying {(page - 1) * perPage + 1} to{" "}
                {Math.min(totalEvents, page * perPage)} of {totalEvents} items.
              </p>
              <p className="text-muted">Per page</p>
              <Form>
                <Form.Select size="sm" onChange={updatePerPage}>
                  {perPageOptions.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Form.Select>
              </Form>
            </PageSelect>
          </div>
        </Col>
        <Col lg={{ span: 8 }} className="tournamentList">
          {events.map((event) => (
            <Row key={event["id"]} className="eventCardRow">
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
