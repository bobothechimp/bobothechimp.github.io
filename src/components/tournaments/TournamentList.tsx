import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import EventCard from "./EventCard";
import EventSelect from "./EventSelect";
import PageSelect from "../PageSelect";

import * as ROUTES from "../../global/routes";

const TournamentList = () => {
  // Seasons from which to choose
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState("-1");

  // Tournaments from which to choose
  const [tournaments, setTournaments] = useState([]);
  const [tournament, setTournament] = useState("-1");
  // Whether or not to disable the tournaments selector
  const [disableTournaments, setDisableTournaments] = useState(true);

  // Events to display
  const [events, setEvents] = useState([]);

  // Keeping track of items and pages for pagination
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // Initial fetch for all seasons
  useEffect(() => {
    fetch(ROUTES.SERVER_GET_SEASONS)
      .then((res) => res.json())
      .then((data) => {
        setSeasons(data["seasons"]);
      });
  }, []);

  // Getting new list of events if season or page ever changes
  useEffect(() => {
    if (season === "-1") {
      // If no season is selected, fetch all seasons
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
      // If a season is selected, grab only the tournaments and events from that season
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

  // Get a new list of events if the tournament ever changes
  useEffect(() => {
    if (season != "-1" && tournament === "-1") {
      // If a season is selected but a tournament isn't, fetch all events from that season
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
      // If both a season and tournament are selected, fetch only events from that tournament
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

  // Selecting a new season, tournament, or perPage value resets the list to page 1
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
            <EventSelect
              seasons={seasons}
              tournaments={tournaments}
              disableTournaments={disableTournaments}
              updateSeason={updateSeason}
              updateTournament={updateTournament}
            />
          </div>
          <PageSelect
            current={page}
            perPage={perPage}
            totalPages={Math.ceil((1.0 * totalEvents) / perPage)}
            totalItems={totalEvents}
            onChangePage={(newPage) => setPage(newPage)}
            onChangePerPage={updatePerPage}
          />
        </Col>
        <Col lg={{ span: 8 }} className="eventList">
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
          {events.length == 0 && (
            <div className="eventNotFound">
              <p>No events found</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TournamentList;
