const axios = require('axios').default;
const urlBase = "https://pokeapi.co/api/v2/pokemon/"
let pokename = "eevee"
const main = async () => {
    const { data } = await axios(`${urlBase}/${pokename}`);
    const species = await axios(data.species.url);
    const evolutions = await axios(species.data.evolution_chain.url)
    allEvolutions = getEvolutionResponse(evolutions.data.chain);
    name({ data }, allEvolutions);
};
function name({ data }, allEvolutions) {
    console.log(`nombre [${data.name}]`);
    console.log(`pokemon ID [${data.id}]`);
    console.log(`alturapeso [${data.height}/${data.weight}]`);
    const abilidadList = data.abilities.map(
        ({ ability }) => `${ability.name}`
    );
    console.log(`habilidades [${abilidadList.join(',')}]`);
    const evoltionList = allEvolutions.map(
        ({ species }) => `${species.name}`
    )
    console.log(`evoluciones [${evoltionList.join(',')}]`)
}
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
main();