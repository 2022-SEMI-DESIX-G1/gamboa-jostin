const axios = require('axios').default;
const urlBase = "https://pokeapi.co/api/v2/pokemon/"
let pokename ="ditto"
const main = async() => {
  const {data} = await axios (`${urlBase}/${pokename}`);
  name({data});
};
function name({data}){
  console.log(`nombre [${data.name}]`);
  console.log(`pokemon ID [${data.id}]`);
  console.log(`alturapeso [${data.height}/${data.weight}]`);
  const abilidadList = data.abilities.map(
    ({ability})=>`${ability.name}`
  );
  console.log(`habilidades [${abilidadList.join(',')}]`);
}
main();