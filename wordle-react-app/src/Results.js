import React, {useState, useEffect} from 'react';
import axios from 'axios';
import PopupDoc from './PopupDoc';
import './results.scss';

export default function Results({ allGuesses, headers, headerLabels, request, headerDocs, loading, setLoading, elapsedTime, setElapsedTime }) {
  const [ dbName, setDbName ] = useState("wordle.sqlite");

  useState(() => {
    setDbName(allGuesses ? "all-wordle.sqlite" : "wordle.sqlite");
  }, [allGuesses]);

  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");

  const url = process.env.REACT_APP_API_URI;
  
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
        clearInterval(timer);
        setLoading(false);
      }
    }

    if (request) {
      callService();
    }
  }, [request, url, setElapsedTime, setLoading, dbName]);

  const headerRow = (headers && headers.map((x) => {
    const doc = headerDocs && (x in headerDocs) && headerDocs[x];
    const label = doc ? <PopupDoc doc={doc}>{headerLabels[x]}</PopupDoc> : headerLabels[x];
    return (
      <div className='cell col'>{label}</div>
    );
  }));

  function formatEntry(x, header) {
    if (typeof x === 'number') {
      if (header === 'compatible') {
        return x > 0 ? "true" : "false";
      } else if (header === 'rank' || header === 'turn') {
        return x;
      } else {
        return x.toFixed(4);
      }
    } else {
      return x;
    }
  }

  function dataRow(row) {
    return headers.map((x) => <div className='col cell'>{formatEntry(row[x], x)}</div>)
  }

  function wordList(list) {
    if (list.length > 0) {
      return (
        list.map((it) => {
          return (
            <>
              {it}<br/>
            </>
          );
        })
      ); 
    } else {
      return <em>No matches</em>
    }
  }

  function formatRemaining(rows) {
    return (
      <div className='row'>
        <div key="guesses" className="col"/>
        {rows.map((lst, idx) => {
          return (
            <div key={idx} className="col" align="left">{wordList(lst)}</div>
          );
        })}
        <div key="buttons" className="col"/>
      </div>
    );
  }

  function dataRows(rows) {
    if (request.operation === "qremaining_answers") {
      return formatRemaining(rows);
    } else {
      return rows.map((row, idx) => <div className='row' key={idx}>{dataRow(row)}</div>);
    }
  }

  return (
    <>
      {error && <div className="error">{error}</div>}
      {!error && headerRow && <div className='row header' key={-1}>{headerRow}</div>}
      {!error && dataRows(output)}
      {!loading && <div className='row footer'><div className='col' align='right'>Elapsed time: {(elapsedTime / 1000).toFixed(0)} sec.</div></div>}
    </>
  );
}
