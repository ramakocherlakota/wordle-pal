<<<<<<< HEAD
const url = "/";

export function callService(operation, setLoading, postData, handler) {
    const makeCall = async function() {
        if (setLoading) {
            setLoading(true);
        }
        try {
            const data = JSON.stringify({...postData, 'operation': operation})
            const response = await fetch(url, {
                method: 'POST',
                headers : {'Content-type': 'application/json'},
                body: data
            })
            const json = await response.json();
            if (handler) {
                handler(json);
            }
        } catch(err) {
            console.log(`Error calling API. URL=${url}, operation=${operation}, error=${err}`);
        } finally {
            if (setLoading) {
                setLoading(false);
            }
        }
    };

    makeCall();
}
