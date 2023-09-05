import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  route: string;
}

const AdminPageCard = ({ title, description, route }: Props) => {
  return (
    <Card className="adminPageCard">
      <Card.Body>
        <h4>
          <Link to={route}>{title}</Link>
        </h4>
        <p>{description}</p>
      </Card.Body>
    </Card>
  );
};

export default AdminPageCard;
