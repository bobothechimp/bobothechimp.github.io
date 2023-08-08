import { useState, useEffect } from "react";

const startggURL = "https://api.start.gg/gql/alpha";

import { STARTGG_KEY } from "../global/apikeys";

async function getEventID(tournamentName: string, eventName: string, setter) {
  console.log("Running getEventID");
  const eventSlug = `tournament/${tournamentName}/event/${eventName}`;
  const query = `query EventQuery($slug:String) {event(slug: $slug) {id name}}`;
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(startggURL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + STARTGG_KEY,
        },
        body: JSON.stringify({
          query: query,
          variables: {
            slug: eventSlug,
          },
        }),
      });
      result.json().then((json) => {
        console.log("In getEventID: " + json.data.event.id);
        setter(json.data.event.id);
      });
    };
    fetchData();
    //   .then((r) => r.json())
    //   .then((data) => {
    //     setter(data.data.event.id);
    //   });
  }, []);
}

function getTournamentWinners(season: number, week: number, setter) {
  console.log("Running getTournamentWinners");
  const tournamentName = `bu-smash-season-${season}-week-${week}`;
  const [eventID, setEventID] = useState(0);
  const query = `query TournamentQuery($slug: String, $page: Int!, $perPage: Int!) {
    tournament(slug: $slug) {
      id
      name
      events {
        id
        name
        standings(query: {
            perPage: $perPage,
            page: $page
          }){
            nodes {
              placement
              entrant {
                id
                name
              }
            }
          }
      }
    }
  }
  `;
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(startggURL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + STARTGG_KEY,
        },
        body: JSON.stringify({
          query: query,
          variables: {
            slug: tournamentName,
            page: 1,
            perPage: 3,
          },
        }),
      });
      result.json().then((json) => {
        let allEventWinners: string[][] = [];
        let events = json.data.tournament.events;
        for (let e = 0; e < events.length; e++) {
          let winners: string[] = [];
          for (let p = 0; p < 3; p++) {
            let name = events[e].standings.nodes[p].entrant.name;
            winners.push(name);
          }
          allEventWinners.push(winners);
        }
        setter(allEventWinners);
      });
    };
    fetchData();
  }, []);
}

export default getTournamentWinners;
