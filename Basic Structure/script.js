function parseResponse(data) {
    document.getElementById("result").innerHTML = "Result: " + data;
    console.log(data)
}

function callback(resp)
{
    resp.json().then(parseResponse);
}

function operation(a, b) {
    return a + b;
}
function onpress()
{
    let a=document.getElementById("input1").value
    let b=document.getElementById("input2").value
    fetch("")
    fetch("http://localhost:3000/addition", {
        method: "POST",
        body: JSON.stringify({
            data: operation(parseInt(a, 10), parseInt(b, 10))
        }),
        headers: { 
            "Content-Type": "application/json"
        } 
    }).then(callback);
}