(() => {
  const App = {
    config: {
      apiBaseUrl: "http://localhost:3000/pokemon",
    },
    htmlElements: {
      form: document.querySelector("#pokemon-form"),
      input: document.querySelector("#pokemon-input"),
      pokemonFinderOutput: document.querySelector("#pokemon-finder-response"),
      spritesCard: document.querySelector("#sprites-Card"),
      evolutionCard: document.querySelector("#evolution-Card"),
      locationCard: document.querySelector("#location-Card"),
      checkSprites: document.querySelector("#check-sprites"),
      checkEvolution: document.querySelector("#check-evolution"),
      checkLocation: document.querySelector("#check-location"),
    },
    init: () => {
      App.htmlElements.form.addEventListener(
        "submit",
        App.handlers.handleFormSubmit
      );
      App.htmlElements.checkSprites.addEventListener(
        "change", 
        App.handlers.handleSpriteChecked
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
      handleSpriteChecked: (e) => {
        e.preventDefault();
        let element = document.getElementById('sprites-Card');
        if(App.htmlElements.checkSprites.checked)
        {  element.style.display="block";}
        else{
          element.style.display="none";
        }
        
      
      },
    },
    templates: {
      pokemonCard: ({data},evoluto)=>{
        
        var evolutionList = evoluto.evol.map(
          (element) =>
            `<li>${element}</li> `
        );

        var locationList = evoluto.lug.map(
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
        
        
        <div id="sprites-Card" > 
        <h6>sprites</h6>  
             <img  class="imsprites"src="${
               data.data.sprites.front_default}"><img class="imgsolapada imsprites" src="${data.data.sprites.back_default}">
        </div>
        
        <div id="evolution-Card" >
        <ul>
        ${evolutionList.join("")}
        </ul>
        
        </div>
        <div id="location-Card" >
        <ul>
        ${locationList.join("")}
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
