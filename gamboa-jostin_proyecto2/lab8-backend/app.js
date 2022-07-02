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
async function main() {
  await mongoose.connect("mongodb://localhost:27017/pokemondb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  /*modelo de collection */
  const schema = new mongoose.Schema({
    name: "string",
    id: "string",
    weight: "string",
    height: "string",
    time: "number",
    base_experience: "string",
    sprites: "object",
    evolutions: "array",
    location_area: "array",
  }); //expandir schema y considerar el nuevo campo time
  const Pokemon = mongoose.model("Pokemon", schema);

  app.post("/pokemon/:name", async function (req, res) {
    const { name } = req.params;
    const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${name}`;
    const urlEncounters = `https://pokeapi.co/api/v2/pokemon/${name}/encounters`;
    let lugarArray = [];
    let lugaresPokemones = await axios(urlEncounters);

    const especies = await axios(urlSpecies);
    const evolucion = await axios(especies.data.evolution_chain.url);
    let evolutions = getEvolutionResponse(evolucion.data.chain);

    lugaresPokemones.data.forEach((data) =>
      lugarArray.push(data.location_area.name)
    );

    function getEvolutionResponse(evolutions) {
      let evolutionChain = [evolutions];
      while (evolutions.evolves_to.length > 0) {
        for (let i = 0; i < evolutions.evolves_to.length; i++) {
          evolutionChain.push(evolutions.evolves_to[i]);
        }
        evolutions = evolutions.evolves_to[0];
      }
      return evolutionChain;
    }
    const evolutionList = evolutions.map(({ species }) => `${species.name}`);

    const resultPokemon = await Pokemon.findOne({ name: name });

    if (resultPokemon) {
      if (resultPokemon.time < new Date()) {
        resultPokemon.delete();
      }
      return res.json({ name, data: resultPokemon, isCached: true });
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let responseData;
    try {
      const { data } = await axios.get(url);
      responseData = data;
      data.time = new Date(Date.now() + 10000);
      data.evolutions = evolutionList;
      data.location_area = lugarArray;
      Pokemon.create(data);
    } catch {
      responseData = data;
    }
    res.json({ name, data: responseData, isCached: false });
  });

  app.listen(PORT, () => {
    console.log(`Running on port ${PORT}...`);
  });
}
main();
