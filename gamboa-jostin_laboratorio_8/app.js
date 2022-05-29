const express = require("express");
const app = express();

app.get("/:number", function (req, res) {
    const cantidad  = req.params.number;
    let fArray = [0,1];
    let data ={
      sequence:[]
    };
    for(let i =2;i<cantidad;i++){
      fArray[i]= fArray[i-1]+fArray[i-2];
    }
    data.sequence =data.sequence.concat(fArray);
    res.json(data);
  });
app.listen(3000);