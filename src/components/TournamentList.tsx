import { useState, useEffect } from "react";
import { ListGroup, Form } from "react-bootstrap";
// require("sqlite3");
import * as SQLITE3 from "sqlite3";

import Button from "./Button";
import getTournamentWinners from "../querying/TournamentQueries";

const db = new SQLITE3.Database(
  "../databases/tournaments.db",
  SQLITE3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

/*
function createSeasonsTable() {
  let sql = `CREATE TABLE seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game TEXT NOT NULL,
    season INTEGER NOT NULL,
    num_weeks INTEGER NOT NULL,
    bimonthly1 INTEGER,
    bimonthly2 INTEGER,
    semester TEXT NOT NULL
  );`;
  db.run(sql);
}

function insertSeason(
  game: string,
  season: number,
  num_weeks: number,
  bimonthlies: number[],
  semester: string
) {
  let bmData = ["", ""];
  for (let i = 0; i < bimonthlies.length; i++) {
    bmData[0] += `bimonthly${i + 1}, `;
    bmData[1] += `${bimonthlies[i]}, `;
  }
  let sql = `INSERT INTO seasons
  (game, season, num_weeks, ${bmData[0]}semester)
  VALUES
  (\"${game}\", ${season}, ${num_weeks}, ${bmData[1]}\"${semester}\");`;
  console.log(sql);
  db.run(sql, [], (err) => {
    if (err) return console.error(err.message);
  });
}

function getSeasons(game: string) {
  let sql = `SELECT season FROM seasons WHERE game = \"${game}\;"`;
  db.all(sql, [], (err, seasons) => {
    if (err) return console.error(err.message);
    seasons.forEach((season) => {
      console.log(season);
    });
  });
}
*/

const TournamentList = () => {
  const [winners, setWinners] = useState([[]]);
  getTournamentWinners(12, 9, setWinners);

  return (
    <>
      {/* <Button
        onClick={() => insertSeason("Ultimate", 12, 9, [15, 16], "Spring 2023")}
      >
        Add season
      </Button>
      <Button onClick={() => getSeasons("Ultimate")}>Log seasons</Button> */}
      <h1>Tournaments</h1>
      <Form.Select size="sm">
        <option value="none">Season</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </Form.Select>
      <Form.Select size="sm">
        <option value="none">Week</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </Form.Select>
      {winners.map((top3) => (
        <ListGroup key={top3.toString()}>
          {top3.map((player) => (
            <ListGroup.Item key={player}>{player}</ListGroup.Item>
          ))}
        </ListGroup>
      ))}
    </>
  );
};

export default TournamentList;
