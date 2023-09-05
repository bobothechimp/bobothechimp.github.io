import { Container, Row, Col } from "react-bootstrap";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminPageCard from "../components/admin/AdminPageCard";

import { useAuth } from "../contexts/AuthContext";

import * as ROUTES from "../global/routes";

import "../styles/dashboard.css";

const Dashboard = () => {
  const { currentUser } = useAuth();

  const cardInfo = [
    {
      id: 1,
      title: "Data Manager",
      description:
        "View, add, and update the information for the database's seasons, tournaments, events, and players.",
      route: ROUTES.ADMIN_DATA_MANAGER,
    },
    {
      id: 2,
      title: "Change Tweets",
      description:
        "View and update the Tweets that appear on the public home page.",
      route: ROUTES.ADMIN_CHANGE_TWEETS,
    },
  ];

  return (
    <>
      <Header />
      <h1 className="sectionTitle">Admin Dashboard</h1>
      <Container id="adminPageCardList">
        <Row>
          <h3 id="currentLogin">
            Currently logged in as <b>{currentUser.email}</b>
          </h3>
        </Row>
        <Row>
          {cardInfo.map((card) => (
            <Col sm={{ span: 4 }} key={card.id}>
              <AdminPageCard
                title={card.title}
                description={card.description}
                route={card.route}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Dashboard;
