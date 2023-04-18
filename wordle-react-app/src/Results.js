import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './results.scss';

export default function Results({ allGuesses, headers, headerLabels, request, headerDocs, loading, setLoading, elapsedTime, setElapsedTime, output, setOutput, error, setError, handleOutput }) {
  const [ dbName, setDbName ] = useState("wordle.sqlite");
  const [ finalElapsedTime, setFinalElapsedTime ] = useState(0);

  useState(() => {
    setDbName(allGuesses ? "all-wordle.sqlite" : "wordle.sqlite");
  }, [allGuesses]);

  const url = process.env.REACT_APP_API_URI || '/service';
  
  useEffect(() => {
    async function callService() {
      const startingTime = Date.now();
      const timer = setInterval(() => setElapsedTime(Date.now() - startingTime), 1000); 
      try {
        setError("");
        setOutput([]);
        setLoading(true);
        const response = await axios.post(
          url, 
          {
            ...request, 
            sqlite_dbname: dbName
          }, 
          {
            timeout: 900*1000 // really, fifteen minutes :-)
          } 
        );                                
        if (response.status === 200) {
          if ("error" in response.data) {
            setError(response.data.error);
          } else {
            setOutput(response.data);
          }
        } else {
          console.log(`Response failed with status code ${response.status}`);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setFinalElapsedTime(Date.now() - startingTime);
        clearInterval(timer);
        setLoading(false);
      }
    }

    if (request) {
      callService();
    }
  }, [request, url, setElapsedTime, setLoading, setOutput, setError, dbName]);

  return (
    <>
      {error && <div className="error">{error}</div>}
      {!error && output && handleOutput({output, headers, headerLabels, headerDocs}) }
      {!loading && <div className='footer'><div align='right'>Elapsed time: {(finalElapsedTime / 1000).toFixed(2)} sec.</div></div>}
    </>
  );
}
