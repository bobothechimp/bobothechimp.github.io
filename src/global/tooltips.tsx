import { Tooltip } from "react-bootstrap";

export const renderDSRTooltip = (props: any) => (
  <Tooltip id="button-tooltip" {...props}>
    Dave's Stupid Rule (DSR) is a rule where players cannot counterpick to all
    stages on which they previously won (Full DSR) or just the most recent one
    (Modified DSR).
  </Tooltip>
);
