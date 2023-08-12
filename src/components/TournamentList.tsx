import { useState, useEffect } from "react";
import { ListGroup, Form } from "react-bootstrap";

import Button from "./Button";
import getTournamentWinners from "../querying/TournamentQueries";

const TournamentList = () => {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch("http://localhost:5000/seasons")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, []);

  const [season, setSeason] = useState(12);
  const [week, setWeek] = useState(1);
  const [winners, setWinners] = useState([[]]);

  // getTournamentWinners(season, week, setWinners);

  const updateSeason = (selectedSeason) => {
    setSeason(selectedSeason.target.value);
  };
  const updateWeek = (selectedWeek) => {
    setWeek(selectedWeek.target.value);
  };

  useEffect(() => {
    getTournamentWinners(season, week, setWinners);
  }, [season, week]);

  return (
    <>
      <h1>Tournaments</h1>
      <Form.Select size="sm" defaultValue={"none"} onChange={updateSeason}>
        <option value="none">Season</option>
        <option value={9}>9</option>
        <option value={10}>10</option>
        <option value={11}>11</option>
        <option value={12}>12</option>
      </Form.Select>
      <Form.Select size="sm" defaultValue={"none"} onChange={updateWeek}>
        <option value="none">Week</option>
        <option value={9}>9</option>
        <option value={10}>10</option>
        <option value={11}>11</option>
        <option value={12}>12</option>
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
