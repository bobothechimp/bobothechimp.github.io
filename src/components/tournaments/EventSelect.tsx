import React from "react";
import { Form } from "react-bootstrap";

interface Props {
  seasons: any[];
  tournaments: any[];
  disableTournaments: boolean;
  updateSeason: (Event) => void;
  updateTournament: (Event) => void;
}

const EventSelect = ({
  seasons,
  tournaments,
  disableTournaments,
  updateSeason,
  updateTournament,
}: Props) => {
  return (
    <Form>
      <Form.Group className="seasonSelect">
        <Form.Label>Select a season</Form.Label>
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
      </Form.Group>
      <Form.Group className="tournamentSelect">
        <Form.Label>Select a tournament</Form.Label>
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
        <Form.Text>Some tournaments may be unavailable.</Form.Text>
      </Form.Group>
    </Form>
  );
};

export default EventSelect;