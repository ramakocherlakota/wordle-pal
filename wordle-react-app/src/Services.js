const url = "https://awa7vnoqi2k3qsg5frh6yrpjvu0wwakl.lambda-url.us-east-1.on.aws/"

export function callService(operation, data, setLoading) {
    const makeCall = async function() {
        if (setLoading) {
            setLoading(true);
        }
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers : {'Content-type': 'application/json'},
                body: JSON.stringify({...data, 'operation': operation})
            });
            return response.json();
        }  finally {
           if (setLoading) {
               setLoading(false);
           }
       }
    };

    makeCall();
}
