import Header from "../components/Header";
import Footer from "../components/Footer";
import PlayerList from "../components/players/PlayerList";

import "../styles/players.css";

const Players = () => {
  return (
    <>
      <Header />
      <PlayerList />
      <Footer />
    </>
  );
};

export default Players;
