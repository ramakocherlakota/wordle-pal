import React, {useState, useEffect} from 'react';

import Spinner from "react-bootstrap/Spinner";

export default function Results({ request }) {
    const [ loading, setLoading ] = useState(false);
    const [ output, setOutput ] = useState([]);

//    const url = "https://awa7vnoqi2k3qsg5frh6yrpjvu0wwakl.lambda-url.us-east-1.on.aws/";
    const url = "/";
    
    useEffect(() => {
        async function callService() {
            console.log("calling service");
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

    return <div>{JSON.stringify(output)}</div>;
}
