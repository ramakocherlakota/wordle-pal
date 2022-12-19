import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Spinner from "react-bootstrap/Spinner";

export default function Results({ headers, headerLabels, request }) {
    const [ loading, setLoading ] = useState(false);
    const [ output, setOutput ] = useState([]);

    const url = "/";
    
    useEffect(() => {
        async function callService() {
            try {
                console.log("callilng service");
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
                    console.log(`Response failed with status code {resoonse.status}`);
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
    }, [request]);

    const headerRow = headers.map((x) => <Col>{headerLabels[x]}</Col>)
    function dataRow(row) {
        return headers.map((x) => <Col>{row[x]}</Col>)
    }
    function dataRows(rows) {
        console.log("rows=")
        console.log(rows)
        return rows.map((row) => <Row>{dataRow(row)}</Row>);
    }

    return (
        <>
            {loading && <Spinner animation='border' />}
            <Container>
                <Row>{headerRow}</Row>
                {dataRows(output)}
            </Container>
        </>
    );
}
