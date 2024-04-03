import { useState } from 'react'
import { Typography } from '@mui/material';
import { Card, Button } from '@mui/material';

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  function Inc(){
    setCount(count+1);
  }
  function Dec(){
    setCount(count-1);
  }

  return (
   <div style={{
    display: "flex",
    justifyContent: "center",
    backgroundColor:"#eee",
    width:"100vw",
    height:"100vh"

}}>
   <Card variant="outlined" style={{width:500, height:300, marginTop:20 }}>
      <Typography style={{marginLeft:10}} variant="h4" component="h2">Welcome to the Counter game</Typography>
      <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop:25
            }}>
          <Button style={{marginLeft:10}} onClick={Inc} variant="contained">Increase</Button>
          <Button style={{marginRight:10}} onClick={Dec} variant="contained">Decrease</Button>
          

      </div>
      <Typography style={{marginLeft:200, marginTop:70}} variant="h4" component="h2">{count}</Typography>

      </Card>

  
   </div>
  )
}

export default App
