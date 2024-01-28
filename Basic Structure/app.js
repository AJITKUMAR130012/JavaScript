express=require("express")
host="localhost"
back_log=20
port=3000
const path=require("path")
const bodyPareser=require("body-parser")

app=express()
app.use(bodyPareser.json());
app.use(express.static(__dirname));

app.post("/addition",(req, res)=>
{
    var x=req.body.data
    res.send(x.toString());
})

app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(port, host, back_log,()=>
{
    console.log(`app is running on the port${port}`)
})