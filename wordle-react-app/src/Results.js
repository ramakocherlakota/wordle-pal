import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Spinner from "react-bootstrap/Spinner";

export default function Results({ headers, headerLabels, request }) {
  const [ loading, setLoading ] = useState(false);
  const [ output, setOutput ] = useState([]);
  const [ requestTime, setRequestTime ] = useState(0);

  const url = "/service";
  
  useEffect(() => {
    async function callService() {
      setRequestTime(0);
      const timer = setInterval(() => setRequestTime((r) => r + 1),
                                1000);
      try {
        setOutput([])
        setLoading(true);
        const response = await fetch(url, {
          method: 'POST',
          headers : {'Content-type': 'application/json'},
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
        clearInterval(timer);
        setLoading(false);
      }
    }

    if (request) {
      callService();
    }
  }, [request]);

  const headerRow = headers.map((x) => <Col>{headerLabels[x]}</Col>)
  function dataRow(row) {
    return headers.map((x) => <Col>{row[x]}</Col>)
  }
  function dataRows(rows) {
    return rows.map((row, idx) => <Row key={idx}>{dataRow(row)}</Row>);
  }

  return (
    <>
      {loading && <Spinner animation='border' />}
      <div>{requestTime} sec</div>
      <Container>
        <Row key={-1}>{headerRow}</Row>
        {dataRows(output)}
      </Container>
    </>
  );
}
