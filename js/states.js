(function(window) {
  // namespace our App
  window.App = window.App || {}

  class SuperHeroes {
    constructor () {
      this.superHeroes = JSON.parse(localStorage.getItem('characters'))
    }

    render () {
      const view = document.createElement('div');
      const content = this.superHeroes.map( hero => {
        return `<tr>
                  <td><img src="${hero.image}" width="200px" /> ${hero.name}</td>
                  <td>${hero.series.map(serie => `<p>${serie.name}</p>`).join('')}</td>
                  <td>${hero.events.map(event => `<p>${event.name}</p>`).join('')}</td>
                </tr>`
      })
      const template = `<table>
                          <thead>
                            <tr>
                              <td>Personagem</td>
                              <td>Séries</td>
                              <td>Eventos</td>
                            </tr>
                          </thead>
                          <tbody>
                            ${content}
                          </tbody>
                        </table>`

      view.innerHTML= template;
      return view;
    }
  }

  window.App.states = {
    SuperHeroes
  };

}(window));
