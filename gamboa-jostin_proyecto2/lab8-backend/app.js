require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios").default;

const { PORT = 3000 } = process.env;
//const CACHE = {};
const ERROR = {};
app.use(cors());

/*connection to mongoose */
async function main(){
await mongoose.connect('mongodb://localhost:27017/pokemondb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

/*modelo de collection */
const schema = new mongoose.Schema({ name: 'string', id: 'string', weight: 'string', height: 'string', time: 'number', base_experience:'string', sprites:'object' });//expandir schema y considerar el nuevo campo time
const Pokemon = mongoose.model('Pokemon', schema);

//Pokemon.create({ name:'picaaa' ,id: 'small' });


/*app.get("/cache", function (req, res) {
  res.json({ data: CACHE });
});*/   

app.post("/pokemon/:name", async function (req, res) {
  
  const { name } = req.params;
   
  const resultPokemon = await  Pokemon.findOne({name:name});

  if(resultPokemon){
    if(resultPokemon.time < new Date()){
      resultPokemon.delete();
    }
    return res.json({ name, data:resultPokemon, isCached: true });
  }


  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  let responseData;
  try {
    const { data } = await axios.get(url); 
    responseData = data;
    data.time= new Date(Date.now()+10000);
    Pokemon.create(data);


  } catch {
    responseData = data;
 //   ERROR[name] = JSON.stringify({ name, error: "Invalid pokemon." });
  }
  res.json({ name, data:responseData, isCached: false });
});
app.get("/pokemon/:id", async function(req, res){

  const id = req.params.id;
  const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const urlEncounters = `https://pokeapi.co/api/v2/pokemon/${id}/encounters`;
  let lugarArray = [];
  let lugaresPokemones = await axios(urlEncounters);
  lugaresPokemones.data.forEach(data =>lugarArray.push(data.location_area.name));

  const especies = await axios(urlSpecies);
  const evolucion = await axios(especies.data.evolution_chain.url);
  let evolutions = getEvolutionResponse(evolucion.data.chain);

  const evolutionList= evolutions.map(({species})=>
  `${species.name}`
  );    

  function getEvolutionResponse(evolutions) {
    let evolutionChain = [evolutions];
    while (evolutions.evolves_to.length > 0) { 
        for(let i=0; i<evolutions.evolves_to.length; i++){
            evolutionChain.push(evolutions.evolves_to[i]);
        }
        evolutions = evolutions.evolves_to[0];
    }
    return evolutionChain;
}
res.json({ evol:evolutionList, lug: lugarArray });
})




app.listen(PORT, () => {
  console.log(`Running on port ${PORT}...`);
});

}main();