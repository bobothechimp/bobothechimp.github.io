import { useState, useEffect } from "react";
import { ListGroup, Form, Container, FormGroup } from "react-bootstrap";

import EventCard from "./EventCard";

const TournamentList = () => {
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState("-1");
  const [tournaments, setTournaments] = useState([]);
  const [disableTournaments, setDisableTournaments] = useState(true);
  const [tournament, setTournament] = useState("-1");
  const [events, setEvents] = useState([]);
  const [winners, setWinners] = useState([[]]);

  useEffect(() => {
    fetch("http://localhost:5000/seasons")
      .then((res) => res.json())
      .then((data) => {
        setSeasons(data);
      });
  }, []);

  useEffect(() => {
    if (season === "-1") {
      resetTournaments();
      return;
    }
    fetch("http://localhost:5000/seasons/" + season + "/tournaments")
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data);
        setTournament("-1");
        setDisableTournaments(false);
      });
  }, [season]);

  useEffect(() => {
    if (tournament === "-1") {
      setEvents([]);
      return;
    }
    fetch("http://localhost:5000/tournaments/" + tournament + "/events")
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
      <h1>Tournaments</h1>
      <FormGroup className="seasonSelect">
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

      {events.map((event) => (
        <EventCard
          key={event["id"]}
          winners={event["top3"]}
          upset={event["topUpset"]}
          spr={event["topSPR"]}
        >
          {event["title"]}
        </EventCard>
      ))}
    </Container>
  );
};

export default TournamentList;
