import {
  Container,
  Row,
  Col,
  Table,
  Image,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

import { renderDSRTooltip } from "../global/tooltips";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

import BF from "../assets/stages/ultimate/battlefield.png";
import SBF from "../assets/stages/ultimate/small-battlefield.png";
import PS2 from "../assets/stages/ultimate/pokemon-stadium-2.png";
import SV from "../assets/stages/ultimate/smashville.png";
import TAC from "../assets/stages/ultimate/town-and-city.png";
import FD from "../assets/stages/ultimate/final-destination.png";
import KPL from "../assets/stages/ultimate/kalos-pokemon-league.png";
import HB from "../assets/stages/ultimate/hollow-bastion.png";

import "../styles/about.css";

const Rules = () => {
  return (
    <>
      <Container>
        <Table borderless striped size="md">
          <tbody>
            <tr>
              <th>Stocks</th>
              <td colSpan={2}>3</td>
            </tr>
            <tr>
              <th>Time Limit</th>
              <td colSpan={2}>7:00</td>
            </tr>
            <tr>
              <th>Items</th>
              <td colSpan={2}>None</td>
            </tr>
            <tr>
              <th>Stage Hazards</th>
              <td colSpan={2}>Off</td>
            </tr>
            <tr>
              <th>Pausing</th>
              <td colSpan={2}>Off</td>
            </tr>
            <tr>
              <th>Strikes</th>
              <td colSpan={2}>Winner strikes 3 stages</td>
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
              <td colSpan={2}>No DSR</td>
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
                    <Image src={SBF} rounded /> Small Battlefield
                  </li>
                  <li>
                    <Image src={PS2} rounded /> Pokemon Stadium 2
                  </li>
                  <li>
                    <Image src={SV} rounded /> Smashville
                  </li>
                  <li>
                    <Image src={TAC} rounded /> Town and City
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li>
                    <Image src={FD} rounded /> Final Destination
                  </li>
                  <li>
                    <Image src={KPL} rounded /> Kalos Pokemon League
                  </li>
                  <li>
                    <Image src={HB} rounded /> Hollow Bastion
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Rules;
