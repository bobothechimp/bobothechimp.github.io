import React, { ReactNode, useEffect, useState } from "react";
import { Pagination, Container, Row } from "react-bootstrap";

interface Props {
  children?: ReactNode;
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const PageSelect = ({ children, current, total, onChange }: Props) => {
  let pageButtons: JSX.Element[] = [];
  //No need for any ellipses
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pageButtons.push(
        <Pagination.Item
          key={i}
          active={i === current}
          onClick={() => onChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
  } else {
    //Always need first page button
    pageButtons.push(
      <Pagination.Item
        key={1}
        active={1 === current}
        onClick={() => onChange(1)}
      >
        {1}
      </Pagination.Item>
    );
    //No need for left ellipsis
    if (current <= 4) {
      for (let i = 2; i <= 5; i++) {
        pageButtons.push(
          <Pagination.Item
            key={i}
            active={i === current}
            onClick={() => onChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      //Need left ellipsis
      pageButtons.push(<Pagination.Ellipsis key={"lell"} />);
    }
    //Somewhere in the middle of the page numbers, both ellipses needed
    if (current > 4 && current < total - 3) {
      for (let i = current - 1; i <= current + 1; i++) {
        pageButtons.push(
          <Pagination.Item
            key={i}
            active={i === current}
            onClick={() => onChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }
    //No need for right ellipsis
    if (current >= total - 3) {
      for (let i = total - 4; i <= total - 1; i++) {
        pageButtons.push(
          <Pagination.Item
            key={i}
            active={i === current}
            onClick={() => onChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      //Need right ellipsis
      pageButtons.push(<Pagination.Ellipsis key={"rell"} />);
    }
    //Always need last page button
    pageButtons.push(
      <Pagination.Item
        key={total}
        active={total === current}
        onClick={() => onChange(total)}
      >
        {total}
      </Pagination.Item>
    );
  }

  const [buttonSize, setButtonSize] = useState<any>(undefined);
  const handleResizeWindow = () => {
    if (window.innerWidth >= 992 && window.innerWidth < 1400) {
      setButtonSize("sm");
    } else {
      setButtonSize(undefined);
    }
  };

  useEffect(() => {
    handleResizeWindow();
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  return (
    <Container>
      <Row>
        <Pagination size={buttonSize} style={{ justifyContent: "center" }}>
          <Pagination.First
            key={"toFirst"}
            disabled={current === 1}
            onClick={() => onChange(1)}
          />
          <Pagination.Prev
            key={"toPrev"}
            disabled={current === 1}
            onClick={() => onChange(current - 1)}
          />
          {pageButtons}
          <Pagination.Next
            key={"toNext"}
            disabled={current === total}
            onClick={() => onChange(current + 1)}
          />
          <Pagination.Last
            key={"toLast"}
            disabled={current === total}
            onClick={() => onChange(total)}
          />
        </Pagination>
      </Row>
      <Row>{children}</Row>
    </Container>
  );
};

export default PageSelect;
