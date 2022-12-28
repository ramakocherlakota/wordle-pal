import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Spinner from "react-bootstrap/Spinner";

export default function Results({ headers, headerLabels, request }) {
  const [ loading, setLoading ] = useState(false);
  const [ output, setOutput ] = useState([]);

  const url = process.env.REACT_APP_API_URI;
  
  useEffect(() => {
    async function callService() {
      try {
        setOutput([])
        setLoading(true);
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(request)
        })
        if (response.ok) {
          const json = await response.json();
          setOutput(json);
        } else {
          console.log(`Response failed with status code ${response.status}`);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (request) {
      callService();
    }
  }, [request, url]);

  const headerRow = headers.map((x) => <Col>{headerLabels[x]}</Col>)

  function formatEntry(x) {
    if (typeof x === 'number' && x !== 0) {
      return x.toFixed(4);
    } else {
      return x;
    }
  }

  function dataRow(row) {
    return headers.map((x) => <Col>{formatEntry(row[x])}</Col>)
  }
  function dataRows(rows) {
    return rows.map((row, idx) => <Row key={idx}>{dataRow(row)}</Row>);
  }

  return (
    <>
      {loading && <Spinner animation='border' />}
      <Container>
        <Row key={-1}>{headerRow}</Row>
        {dataRows(output)}
      </Container>
    </>
  );
}
