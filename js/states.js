(function(window) {
  // namespace our App
  window.App = window.App || {}

  class SuperHeroes {
    constructor () {
      this.superHeroes = JSON.parse(localStorage.getItem('characters'))
    }

    render () {
      const view = document.createElement('div')
      const template = `
      <h1><b>BUSCA MARVEL</b> TESTE FRONT-END</h1>
          <h2 class="mobile">Vinicius Augusto Cunha</h2>

          <form>
            <label for="name">Nome do Personagem</label>
            <input type="text" id="nome" placeholder="Filtre por nome do personagem">
          </form>

          <table>
            <thead>
              <tr>
                <th>Personagem</th>
                <th class="mobile">Séries</th>
                <th class="mobile">Eventos</th>
              </tr>
            </thead>
            <tbody>
              ${
                this.superHeroes.map(hero => {
                  return `
                  <tr>
                    <td>
                      <img src="${hero.image}" alt="${hero.name.trim()}">
                      <span>${hero.name.trim()}</span>
                    </td>
                    <td class="mobile">
                      ${hero.series.map(serie => `${serie.name}<br />`).join('')}
                    </td>
                    <td class="mobile">
                    ${hero.events.map(event => `${event.name}<br />`).join('')}
                    </td>
                  </tr>`
                }).join('')
              }
            </tbody>
          </table>
  `;
      view.innerHTML= template
      return view
    }
  }

  window.App.states = {
    SuperHeroes
  };

}(window));
