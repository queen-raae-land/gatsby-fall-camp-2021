import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import queryString from "query-string";
import axios from "axios";

const SuccessPage = ({ location }) => {
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const params = queryString.parse(location.search);

    if (params.session_id) {
      setSessionId(params.session_id);
    } else {
      setStatus("failed");
      setMessage("Missing needed information, did you come here after paying?");
    }
  }, [location.search]);

  useEffect(() => {
    if (!sessionId) return;

    const getTravel = async () => {
      try {
        const result = await axios.get("/api/time-travel", {
          params: { session_id: sessionId },
        });
        setStatus("fulfilled");
        setMessage(result.data.message);
      } catch (error) {
        setStatus("failed");
        setMessage(error.response?.data?.message || error.message);
      }
    };

    getTravel();

    // Grab the session
  }, [sessionId]);

  return (
    <main>
      <header>
        <h1>Your time travel</h1>
        <Link to="/">← Travel again</Link>
      </header>
      <p>
        {status === "pending" && <>Fetching your travels...</>}
        {status === "failed" && <>Hold up!</>}
        {status === "fulfilled" && <>Success 🎉</>}
        {message && (
          <>
            <br />
            <small>{message}</small>
          </>
        )}
      </p>
    </main>
  );
};

export default SuccessPage;
