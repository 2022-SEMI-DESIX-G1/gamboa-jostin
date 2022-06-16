(() => {
  const App = {
    config: {
      apiBaseUrl: "http://localhost:3000/pokemon",
    },
    htmlElements: {
      form: document.querySelector("#pokemon-form"),
      input: document.querySelector("#pokemon-input"),
      pokemonFinderOutput: document.querySelector("#pokemon-finder-response"),
    },
    init: () => {
      App.htmlElements.form.addEventListener(
        "submit",
        App.handlers.handleFormSubmit
      );
    },
    handlers: {
      handleFormSubmit: async (e) => {
        e.preventDefault();
        const pokemon = App.htmlElements.input.value;
        const url = App.utils.getUrl({ pokemon });
        const { data } = await axios.post(url);

        const evoluto =await axios.get(url);
        console.log(evoluto.data);

        console.log(data);
        const renderedTemplate = App.templates.pokemonCard({data},evoluto.data);
        App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplate;
        App.htmlElements.pokemonFinderOutput.style.visibility = "visible";
      },
    },
    templates: {
      pokemonCard: ({data},evoluto)=>{
        
        var evolutionList = evoluto.evol.map(
          (element) =>
            `<li>${element}</li> `
        );
        return `
        <div class="container3">
        <h1 class="tituloPokemon">${data.data.name}</h1> 
        
        <div class="generales">
        <h4>id : ${data.data.id}</h4>  <h4>order : ${data.data.order}</h4>
        <h4>peso : ${data.data.weight}</h4><h4>Altura: ${data.data.height}</h4>
        </div>
        
        <h6>sprites</h6> 
        <div class="sprites">  
             <img  class="imsprites"src="${
               data.data.sprites.front_default}"><img class="imgsolapada imsprites" src="${data.data.sprites.back_default}">
        </div>
        
        <div class="generales">
        <ul>
        ${evolutionList.join("")}
        </ul>
        
        </div>
        
        
        `
      }


    },
    utils: {
      getUrl: ({ pokemon }) => {
        return `${App.config.apiBaseUrl}/${pokemon}`;
      },
    },
  };
  App.init();
})();
