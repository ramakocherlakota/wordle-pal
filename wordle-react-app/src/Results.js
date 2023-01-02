import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import './results.scss';

export default function Results({ headers, headerLabels, request }) {
  const [ loading, setLoading ] = useState(false);
  const [ output, setOutput ] = useState([]);
  const [ elapsedTime, setElapsedTime ] = useState(0);

  const url = process.env.REACT_APP_API_URI;
  
  useEffect(() => {
    async function callService() {
      const startingTime = Date.now();
      const timer = setInterval(() => setElapsedTime(Date.now() - startingTime), 1000); 
      try {
        setOutput([]);
        setLoading(true);
        const response = await axios.post(url, request, {
          timeout: 300*1000, // really, five minutes
        })
        if (response.status === 200) {
          setOutput(response.data);
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
  }, [request, url]);

  const headerRow = (headers && headers.map((x) => <div className='col'>{headerLabels[x]}</div>));

  function formatEntry(x, header) {
    if (typeof x === 'number') {
      if (header === 'compatible') {
        return x > 0 ? "true" : "false";
      } else {
        return x.toFixed(4);
      }
    } else {
      return x;
    }
  }

  function dataRow(row) {
    return headers.map((x) => <div className='col'>{formatEntry(row[x], x)}</div>)
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
      {loading && (
        <div className="loading">
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{(elapsedTime / 1000).toFixed(0)} sec.
          </Button>
        </div>
      )}
      {headerRow && <div className='row header' key={-1}>{headerRow}</div>}
      {dataRows(output)}
    </>
  );
}
