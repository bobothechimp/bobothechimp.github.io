import fetch from "node-fetch";
const startggURL = "https://api.start.gg/gql/alpha";

import { STARTGG_KEY } from "../global/apikeys";

const TournamentList = () => {
  const eventSlug = "bu-smash-society-bimonthly-16";
  const testQuery = `query TournamentQuery($slug: String) {
        tournament(slug: $slug) {
          id
          name
          events {
            id
            name
          }
        }
      }
      `;
  let tournamentData;
  fetch(startggURL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authentication: "Bearer " + { STARTGG_KEY },
    },
    body: JSON.stringify({
      query: testQuery,
      variables: {
        slug: eventSlug,
      },
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      tournamentData = data;
    });

  return (
    <>
      <h1>Tournaments</h1>
      <p>Test</p>
    </>
  );
};

export default TournamentList;
