((Things)=>{
const App = {

    htmlElements:{
        form: document.querySelector('#form1'),
        input: document.querySelector('#numero'),
        div1: document.querySelector('#div1')
    },
    init: () => {
        App.htmlElements.form.addEventListener('submit', App.handlers.onFormSubmit);
        App.htmlElements.div1.addEventListener('click', App.handlers.onCardClick);
    },
    utils: {
        ...Things.methods,
    },
    templates: {
        card: (n) => {
            return `<div class="cards">${n}</div>`;
        }
    },
    handlers: {
        onCardClick: (e) => {
            if(e.target.className === 'cards') {
                e.target.remove();
            }
        },
        onFormSubmit: (e) => {
            e.preventDefault();

            App.htmlElements.div1.innerHTML = '';

            const n = App.htmlElements.input.value;
            App.utils.fibonacci(n).forEach(value => {
                App.htmlElements.div1.innerHTML += App.templates.card(value);
            });
        }
    }
};
App.init();
})(document.Things);