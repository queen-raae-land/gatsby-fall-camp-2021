import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "query-string";

const IndexPage = ({ location }) => {
  const [status, setStatus] = useState("initial");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.payment === "cancelled") {
      setStatus("cancelled");
    }
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("pending");
    setMessage("");

    try {
      // Send data to the function,
      // await the result.
      const result = await axios.post("/api/time-travel", {
        year: event.target.elements.year.value,
        city: event.target.elements.city.value,
        cancelUrl: `${location.origin}/?payment=cancelled`,
        successUrl: `${location.origin}/success/?session_id={CHECKOUT_SESSION_ID}`,
      });
      window.location = result.data.url;
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setStatus("failed");
    }
  };

  const isDisabled = status === "pending";

  return (
    <main>
      <header>
        <h1>Ruby's TimeShip</h1>
        <p>Is a serverless Gatsby function fueled by gold.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <p>
          <small>
            It's built so you can find The Pirate Princess Lillian (11) to help
            save Ruby's sister, Princess Lizabeth from prison in the Tower of
            London in 1554.
          </small>
        </p>
        <p>
          <label htmlFor="year">Year: </label>
          <br />
          <input
            required
            type="number"
            id="year"
            name="year"
            disabled={isDisabled}
          />
        </p>

        <p>
          <label htmlFor="city">City: </label>
          <br />
          <input
            required
            type="text"
            id="city"
            name="city"
            disabled={isDisabled}
          />
        </p>

        <p>
          <button disabled={isDisabled}>Let's Travel</button>
        </p>

        <p>
          <small>Each time travel trip will cost you $1000 in gold.</small>
        </p>

        <p>
          {status === "pending" ? <>Hold on...</> : null}
          {status === "failed" ? <>Hold up!</> : null}
          {status === "cancelled" ? <>You cancelled...try again?</> : null}
          {status === "fulfilled" ? <>Success!</> : null}
          {message ? (
            <>
              <br />
              <small>{message}</small>
            </>
          ) : null}
        </p>
      </form>
    </main>
  );
};

export default IndexPage;
