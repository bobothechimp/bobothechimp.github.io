import { useState, useEffect } from "react";
import { ListGroup, Form } from "react-bootstrap";

import getTournamentWinners from "../querying/TournamentQueries";
import EventCard from "./EventCard";

const TournamentList = () => {
  const [data, setData] = useState([{}]);
  const [season, setSeason] = useState(-1);
  const [week, setWeek] = useState(-1);
  const [weekList, setWeekList] = useState([
    <option key={0} value={-1}>
      Week
    </option>,
  ]);
  const [winners, setWinners] = useState([[]]);

  useEffect(() => {
    fetch("http://localhost:5000/seasons/" + season)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        updateWeekList(data.num_weeks);
        console.log(data);
      });
  }, [season]);

  useEffect(() => {
    getTournamentWinners(season, week, setWinners);
  }, [season, week]);

  const updateSeason = (selectedSeason) => {
    setSeason(selectedSeason.target.value);
  };
  const updateWeek = (selectedWeek) => {
    setWeek(selectedWeek.target.value);
  };
  const updateWeekList = (numWeeks) => {
    let wl = [
      <option key={0} value={-1}>
        Week
      </option>,
    ];
    for (let i = 0; i < numWeeks; i++) {
      wl.push(
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      );
    }
    setWeekList(wl);
  };

  return (
    <>
      <h1>Tournaments</h1>
      <Form.Select size="sm" defaultValue={-1} onChange={updateSeason}>
        <option value={-1}>Season</option>
        <option value={9}>9</option>
        <option value={10}>10</option>
        <option value={11}>11</option>
        <option value={12}>12</option>
      </Form.Select>
      <Form.Select size="sm" defaultValue={-1} onChange={updateWeek}>
        {weekList}
      </Form.Select>
      {winners.map((top3) => (
        <EventCard winners={top3}>
          Season {season} Week {week}
        </EventCard>
      ))}
    </>
  );
};

export default TournamentList;
