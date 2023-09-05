import { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Card, Form, Button } from "react-bootstrap";
import { ref, set, get } from "firebase/database";
import { Tweet } from "react-twitter-widgets";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { database } from "../firebase";

import "../styles/changeTweets.css";

const ChangeTweets = () => {
  const [ultBrawlTweetId, setUltBrawlTweetId] = useState<string>("");
  const [meleeTweetId, setMeleeTweetId] = useState<string>("");
  const ultBrawlTweetRef = useRef<HTMLInputElement>(null);
  const meleeTweetRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let reference = ref(database, "tweets/ultbrawl");
    get(reference)
      .then((res) => res.toJSON())
      .then((data) => {
        setUltBrawlTweetId(data ? data["tweetId"] : "");
      });
    reference = ref(database, "tweets/melee");
    get(reference)
      .then((res) => res.toJSON())
      .then((data) => setMeleeTweetId(data ? data["tweetId"] : ""));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ultBrawlTweetRef.current?.value != "") {
      const reference = ref(database, "tweets/ultbrawl");
      set(reference, {
        tweetId: ultBrawlTweetRef.current?.value,
      });
      setUltBrawlTweetId(
        ultBrawlTweetRef.current ? ultBrawlTweetRef.current.value : ""
      );
    }
    if (meleeTweetRef.current?.value != "") {
      const reference = ref(database, "tweets/melee");
      set(reference, {
        tweetId: meleeTweetRef.current?.value,
      });
      setMeleeTweetId(meleeTweetRef.current ? meleeTweetRef.current.value : "");
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Row id="tweetRow">
          <Col lg={{ span: 4 }} id="changeTweetsForm">
            <Card>
              <Card.Body>
                <h4>Change Tweets</h4>
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="text">
                    <Form.Label>Ultimate/Brawl Tweet</Form.Label>
                    <Form.Control type="text" ref={ultBrawlTweetRef} />
                    <Form.Text>Leave blank for no change</Form.Text>
                  </Form.Group>
                  <Form.Group id="text">
                    <Form.Label>Melee Tweet</Form.Label>
                    <Form.Control type="text" ref={meleeTweetRef} />
                    <Form.Text>Leave blank for no change</Form.Text>
                  </Form.Group>
                  <Button className="w-100" type="submit">
                    Update Tweets
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={{ span: 6 }} lg={{ span: 4 }} id="ultBrawlTweet">
            <h2 className="sectionTitle">Ultimate/Brawl</h2>
            <div className="tweetPreview">
              <Tweet
                tweetId={ultBrawlTweetId}
                options={{ width: "auto" }}
                renderError={(e) => (
                  <div className="invalidTweet">
                    <h2 className="text-muted">Tweet does not exist</h2>
                  </div>
                )}
              />
            </div>
          </Col>
          <Col sm={{ span: 6 }} lg={{ span: 4 }} id="meleeTweet">
            <h2 className="sectionTitle">Melee</h2>
            <div className="tweetPreview">
              <Tweet
                tweetId={meleeTweetId}
                options={{ width: "auto" }}
                renderError={(e) => (
                  <div className="invalidTweet">
                    <h2 className="text-muted">Tweet does not exist</h2>
                  </div>
                )}
              />
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default ChangeTweets;
