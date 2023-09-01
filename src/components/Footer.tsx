import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faGithub,
  faYoutube,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";

import * as ROUTES from "../global/routes";

import "../styles/footer.css";

function Footer() {
  return (
    <div className="footer">
      <Container>
        <Row className="footer">
          <Col sm={{ span: 6, offset: 0 }} className="footerLinks">
            <Container>
              <Row>
                <Col xl={{ span: 2, offset: 6 }}>
                  <small className="footerIconLabel">Ultimate/Brawl</small>
                </Col>
                <Col xl={{ span: 4 }}>
                  <a target="_blank" href={ROUTES.ULTBRAWL_TWITTER}>
                    <FontAwesomeIcon icon={faTwitter} className="footerIcon" />
                  </a>
                  <a target="_blank" href={ROUTES.ULTBRAWL_YOUTUBE}>
                    <FontAwesomeIcon icon={faYoutube} className="footerIcon" />
                  </a>
                  <a target="_blank" href={ROUTES.ULTBRAWL_TWITCH}>
                    <FontAwesomeIcon icon={faTwitch} className="footerIcon" />
                  </a>
                </Col>
              </Row>
              <Row>
                <Col xl={{ span: 2, offset: 6 }}>
                  <small className="footerIconLabel">Melee</small>
                </Col>
                <Col xl={{ span: 4 }}>
                  <a target="_blank" href={ROUTES.MELEE_TWITTER}>
                    <FontAwesomeIcon icon={faTwitter} className="footerIcon" />
                  </a>
                  <a target="_blank" href={ROUTES.MELEE_YOUTUBE}>
                    <FontAwesomeIcon icon={faYoutube} className="footerIcon" />
                  </a>
                  <a target="_blank" href={ROUTES.MELEE_TWITCH}>
                    <FontAwesomeIcon icon={faTwitch} className="footerIcon" />
                  </a>
                </Col>
              </Row>
              <Row>
                <Col xl={{ span: 2, offset: 6 }}>
                  <small className="footerIconLabel">Shared</small>
                </Col>
                <Col xl={{ span: 4 }}>
                  <a target="_blank" href={ROUTES.DISCORD}>
                    <FontAwesomeIcon icon={faDiscord} className="footerIcon" />
                  </a>

                  <a target="_blank" href={ROUTES.GITHUB}>
                    <FontAwesomeIcon icon={faGithub} className="footerIcon" />
                  </a>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col sm={{ span: 6, offset: 0 }} className="footerText">
            <small>
              Room 426 & 227<br></br>College of Arts and Sciences<br></br>725
              Commonwealth Ave<br></br>Boston, MA
            </small>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={{ span: 12, offset: 0 }} className="footerCopyright">
            <small>Copyright &copy; 2023 Noah Barnes</small>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
