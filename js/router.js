// instantiate states when user requests the state

(function(window) {
  // namespacing App
  window.App = window.App || {};

  // map "routes" to "states"
  class Router {
    constructor(containerId){
      this.container = document.getElementById(containerId);
    }
    // takes in a "route" and renders to the container
    navigate(route){
      let state = null;

      switch(route){
        case 'superheroes':
          state = new App.states.SuperHeroes();
          break;
      }

      this.container.innerHTML = '';
      this.container.appendChild( state.render() );
    }
  }

  window.App.Router = new Router('container');

}(window));
