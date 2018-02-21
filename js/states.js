(function(window) {
  // namespace our App
  window.App = window.App || {}

  class SuperHeroes {
    constructor () {
      this.superHeroes = JSON.parse(localStorage.getItem('characters'))
      this.pageList = []
      this.list = []
      this.currentPage = 1
      this.numberPerPage = 3
      this.numberOfPages = 0
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
            <tbody id="list">
            </tbody>
          </table>
          <div id="controls">
            <div>
              <input type="button" id="first" value="Primeira Página" />
              <input type="button" id="previous" onclick="previousPage()" value="Página Anterior" />
              <ul id="numbers">
              </ul>
              <input type="button" id="next" value="Próxima Pagina" />
              <input type="button" id="last" onclick="lastPage()" value="Última Página" />
            </div>
          </div>
  `;
      view.innerHTML= template
      return view
    }

    makeHtmlList () {
      const arrayHtml = [];
      for (let index = 0; index < this.superHeroes.length; index++) {
        arrayHtml.push(`
        <tr>
          <td>
            <img src="${this.superHeroes[index].image}" alt="${this.superHeroes[index].name.trim()}">
            <span>${this.superHeroes[index].name.trim()}</span>
          </td>
          <td class="mobile">
            ${this.superHeroes[index].series.map(serie => `${serie.name}<br />`).join('')}
          </td>
          <td class="mobile">
          ${this.superHeroes[index].events.map(event => `${event.name}<br />`).join('')}
          </td>
        </tr>`)
      }
      return arrayHtml
    }

    makeList() {
      const allArrayHtmlList = this.makeHtmlList()
      for (var x = 0; x < this.superHeroes.length; x++){
        this.list.push(allArrayHtmlList[x]);
      }
      this.numberOfPages = this.getNumberOfPages();
    }

    getNumberOfPages() {
        return Math.ceil(this.list.length / this.numberPerPage);
    }

    nextPage() {
        this.currentPage += 1;
        this.loadList();
    }

    previousPage() {
        this.currentPage -= 1;
        this.loadList();
    }

    firstPage() {
        this.currentPage = 1
        this.loadList()
    }

    lastPage() {
        this.currentPage = this.numberOfPages;
        this.loadList();
    }

    loadList() {
        var begin = ((this.currentPage - 1) * this.numberPerPage)
        var end = begin + this.numberPerPage
        this.pageList = this.list.slice(begin, end)
        this.drawList();
        this.check();
    }

    drawList() {
      document.getElementById("list").innerHTML = ''
      setTimeout(() => {
        for (var r = 0; r < this.pageList.length; r++) {
          document.getElementById("list").innerHTML += this.pageList[r]
        }
      }, 100)

      let numbers = ''
      for (let index = this.currentPage; index < (this.currentPage + 5); index++) {
        if (index === (this.superHeroes.length / this.numberPerPage)) break;
        numbers += (index === this.currentPage) ? `<li class="active">${index}</li>` : `<li>${index}</li>`
      }
      document.getElementById('numbers').innerHTML = numbers
    }

    check() {
      document.getElementById("next").disabled = this.currentPage == this.numberOfPages ? true : false;
      document.getElementById("previous").disabled = this.currentPage == 1 ? true : false;
      document.getElementById("first").disabled = this.currentPage == 1 ? true : false;
      document.getElementById("last").disabled = this.currentPage == this.numberOfPages ? true : false;
    }

    load() {
      this.makeList();
      this.loadList();
    }

  }

  window.App.states = {
    SuperHeroes
  };

}(window));
