(() => {
  const App = {
    config: {
      apiBaseUrl: "http://localhost:3000/pokemon",
    },
    htmlElements: {
      form: document.querySelector("#pokemon-form"),
      input: document.querySelector("#pokemon-input"),
      pokemonFinderOutput: document.querySelector("#pokemonFinderOutput"),
      sprites: "",
      evolucion:"",
      lugares:"",
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
        const {data}= await axios.post(url);
        const evoluto =await axios.get(url);
        console.log(data);
        const renderedTemplate = App.templates.pokemonCard({data},evoluto.data);
        App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplate;
        let eventocheck = document.getElementById("switch-label");
        App.htmlElements.sprites = eventocheck;
        eventocheck.addEventListener("change",App.handlers.handleSpriteChecked);
        let eventocheck2 = document.getElementById("switch-label2");
        App.htmlElements.evolucion = eventocheck2;
        eventocheck2.addEventListener("change",App.handlers.handleEvolucionChecked);
        let eventocheck3 = document.getElementById("switch-label3");
        App.htmlElements.lugares = eventocheck3;
        eventocheck3.addEventListener("change",App.handlers.handleLugaresChecked);
        App.htmlElements.pokemonFinderOutput.style.display = "block";
      },
      handleSpriteChecked: (e) => {
        e.preventDefault();
        let element = document.getElementById('sprites-Card');
        if(App.htmlElements.sprites.checked)
        {  element.style.display="block";}
        else{
          element.style.display="none";
        }   
      },
      handleEvolucionChecked: (e) => {
        e.preventDefault();
        let element = document.getElementById('evolucion-Card');
        if(App.htmlElements.evolucion.checked)
        {  element.style.display="block";}
        else{
          element.style.display="none";
        }
      },
      handleLugaresChecked: (e) => {
        e.preventDefault();
        let element = document.getElementById('location-Card');
        if(App.htmlElements.lugares.checked)
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
        <!--ESTA ES LA NUEVA UI-->
        <div class="contenedor1-card2">
        <div class="conetenerdorItems-left">
               <div class="tittlePokemon"><h2>${data.data.name}</h2></div> 
               <div class="checkSwitch"><div class="switch-button">
                <!-- Checkbox -->
                <input type="checkbox" name="switch-button" id="switch-label" class="switch-button__checkbox">
                <!-- Botón -->
                <label for="switch-label" class="switch-button__label"></label>
                </div><h3>Sprites</h3></div>
                <!-- botón 2 -->
               <div class="checkSwitch">
                    <div class="switch-button2">
                    <!-- Checkbox -->
                    <input type="checkbox" name="switch-button2" id="switch-label2" class="switch-button__checkbox2">
                    <!-- Botón -->
                    <label for="switch-label2" class="switch-button__label2"></label>
                    </div><h3>Evoluciones</h3>
                </div>
                  <!-- botón 3 -->
               <div class="checkSwitch">
                    <div class="switch-button3">
                    <!-- Checkbox -->
                    <input type="checkbox" name="switch-button3" id="switch-label3" class="switch-button__checkbox3">
                    <!-- Botón -->
                    <label for="switch-label3" class="switch-button__label3"></label>
                    </div><h3>Lugares</h3>
                </div>   
        </div>
        <div class="conetenerdorItems-rigth">
            <div class="generalesPokemon">
                <div><img src="${data.data.sprites.other.home.front_default
                }" alt="Pokemon_Fantasy"></div>
                <div class="idpokemon"><h3>${data.data.id}</h3></div>
                <div class="alturaypeso"><h3>altura:  ${data.data.height}</h3><h3>peso: ${data.data.weight}</h3></h3><h3>  experiencia: ${data.data.base_experience}</h3></div>   
            </div>     
        </div>
    </div>
    <div id="sprites-Card" class="otrasOpciones">
       <div class="itemsImageSprite">
             <img  class="imsprites"src="${
               data.data.sprites.front_default}"><img class="imgsolapada imsprites" src="${data.data.sprites.back_default}">
               <img class="imgsolapada imsprites" src="${data.data.sprites.back_shiny}" alt="">
               <img class="imgsolapada imsprites" src="${data.data.sprites.front_shiny}" >
               <img class="imgsolapada imsprites ${data.data.sprites.back_female != null ? "d-visible" : "d-none" } " src="${data.data.sprites.front_female}">
               <img class="imgsolapada imsprites  ${data.data.sprites.back_female != null ? "d-visible" : "d-none" }" src="${data.data.sprites.front_shiny_female}">
      </div>
     </div>
    <div id="evolucion-Card" class="otrasOpciones">
        <ul>
        ${evolutionList.join("")}
        </ul>
    </div>
    <div id="location-Card" class="otrasOpciones">
      <ul>
      ${locationList.join("")}
      </ul>
    </div>`
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
