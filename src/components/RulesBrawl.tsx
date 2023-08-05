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

import BF from "../assets/stages/brawl/battlefield.png";
import FD from "../assets/stages/brawl/final-destination.png";
import LC from "../assets/stages/brawl/lylat-cruise.png";
import SV from "../assets/stages/brawl/smashville.png";
import YI from "../assets/stages/brawl/yoshis-island.png";
import PS from "../assets/stages/brawl/pokemon-stadium.png";

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
              <td colSpan={2}>Modified DSR</td>
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
                    <Image src={FD} rounded /> Final Destination
                  </li>
                  <li>
                    <Image src={LC} rounded /> Lylat Cruise
                  </li>
                  <li>
                    <Image src={SV} rounded /> Smashville
                  </li>
                  <li>
                    <Image src={YI} rounded /> Yoshi's Island
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
      </Container>
    </>
  );
};

export default Rules;
