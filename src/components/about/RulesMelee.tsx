import { Container, Table, Image, OverlayTrigger } from "react-bootstrap";

import { renderDSRTooltip } from "../../global/tooltips";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

import BF from "../../assets/stages/melee/battlefield.png";
import YS from "../../assets/stages/melee/yoshis-story.png";
import FOD from "../../assets/stages/melee/fountain-of-dreams.png";
import DL from "../../assets/stages/melee/dream-land.png";
import FD from "../../assets/stages/melee/final-destination.png";
import PS from "../../assets/stages/melee/pokemon-stadium.png";

import "../../styles/about.css";

const Rules = () => {
  return (
    <>
      <Container>
        <Table borderless striped size="md">
          <tbody>
            <tr>
              <th>Stocks</th>
              <td colSpan={2}>4</td>
            </tr>
            <tr>
              <th>Time Limit</th>
              <td colSpan={2}>8:00</td>
            </tr>
            <tr>
              <th>Items</th>
              <td colSpan={2}>None</td>
            </tr>
            <tr>
              <th>Pausing</th>
              <td colSpan={2}>Off</td>
            </tr>
            <tr>
              <th>Strikes</th>
              <td colSpan={2}>
                Winner strikes 1 stage for best-of-3 matches, 0 for best-of-5
                matches
              </td>
            </tr>
            <tr>
              <th>
                DSR{" "}
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderDSRTooltip}
                >
                  <FontAwesomeIcon icon={faCircleQuestion} />
                </OverlayTrigger>
              </th>
              <td colSpan={2}>Full DSR</td>
            </tr>
            <tr>
              <th>Other</th>
              <td colSpan={2}>60 ledge grab limit; wobbling is banned</td>
            </tr>
            <tr>
              <th rowSpan={2}>Stages</th>
              <td>Starters</td>
              <td>Counterpicks</td>
            </tr>
            <tr className="stages">
              <td>
                <ul>
                  <li>
                    <Image src={BF} rounded /> Battlefield
                  </li>
                  <li>
                    <Image src={YS} rounded /> Yoshi's Story
                  </li>
                  <li>
                    <Image src={FOD} rounded /> Fountain of Dreams
                  </li>
                  <li>
                    <Image src={DL} rounded /> Dream Land 64
                  </li>
                  <li>
                    <Image src={FD} rounded /> Final Destination
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li>
                    <Image src={PS} rounded /> Pokemon Stadium
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </Table>
        A more comprehensive ruleset can be found{" "}
        <a
          target="_blank"
          href="https://docs.google.com/document/u/2/d/e/2PACX-1vSrZTgM6woxibHCH1Iu6zEuwTgEOZmARngTGd2W3Mu12sQWmdVDkOCEPJ2w889CrGk8Y7JYz_G42n8g/pub?fbclid=IwAR2SkzT7NoYu2_eQppSyqdwUFSQZxJcWmmMF4gLjQLqSZ3EWpbmOStiRJts"
        >
          here
        </a>
        .
      </Container>
    </>
  );
};

export default Rules;
