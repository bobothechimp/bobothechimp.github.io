import Header from "../components/Header";
import Footer from "../components/Footer";
import TournamentList from "../components/tournaments/TournamentList";

import "../styles/tournaments.css";

const Tournaments = () => {
  return (
    <>
      <Header />
      <TournamentList />
      <Footer />
    </>
  );
};

export default Tournaments;
