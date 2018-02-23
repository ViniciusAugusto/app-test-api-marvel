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
      this.author = 'Vinicius Augusto Cunha'
      this.events = []
      this.series = []
    }
    render () {
      const view = document.createElement('div')
      const template = `
          <h1 class="title"><b>BUSCA MARVEL</b> TESTE FRONT-END</h1>
          <h2 class="subtitle mobile">${this.author}</h2>
          <form>
              <label for="name">Nome do Personagem</label>
              <input type="text" id="nome" placeholder="Filtre por nome do personagem">
              <button id="search" class="btn" type="button">Buscar</button>
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
                <input type="button" id="previous" value="Página Anterior" />
                <ul id="numbers">
                </ul>
                <input type="button" id="next" value="Próxima Pagina" />
                <input type="button" id="last" value="Última Página" />
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
        <tr data-ref="${index}">
          <td>
            <img src="${this.superHeroes[index].image}" alt="${this.superHeroes[index].name.trim()}">
            <span>${this.superHeroes[index].name.trim()}</span>
          </td>
          <td class="mobile">
            ${this.superHeroes[index].series.map(serie => `${serie.name}<br />`).join('')}
          </td>
          <td class="mobile">
          ${this.superHeroes[index].events.map(event => `${event.name}<br />`).join('')}
          <input class="modal-state" id="modal-${index}" type="checkbox" />
          <div class="modal">
            <label class="modal__bg" for="modal-${index}"></label>
            <div class="modal__inner">
              <label class="modal__close" for="modal-${index}"></label>
              <h1>${this.superHeroes[index].name.trim()}</h1>
              <h2 ${(this.superHeroes[index].events.length == 0)? `style="display:none` : ``}>Eventos</h2>
              <section class="cards" id="events-${index}"></section>
              <h2 ${(this.superHeroes[index].series.length == 0)? `style="display:none` : ``}>Séries</h2>
              <section class="cards" id="series-${index}"></section>
            </div>
          </div>
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
        if (index === parseInt((this.superHeroes.length / this.numberPerPage))) break;
        numbers += (index === this.currentPage) ? `<li class="active">${index}</li>` : `<li>${index}</li>`
      }
      document.getElementById('numbers').innerHTML = numbers
    }

    check() {
      document.getElementById("next").disabled = this.currentPage == this.numberOfPages ? true : false
      document.getElementById("previous").disabled = this.currentPage == 1 ? true : false
      document.getElementById("first").disabled = this.currentPage == 1 ? true : false
      document.getElementById("last").disabled = this.currentPage == this.numberOfPages ? true : false
    }

    load() {
      this.makeList()
      this.loadList()
    }

    findHeroes () {
      const name = document.getElementById('nome').value.toString().trim()
      if (name != '') {
        window.App.Api.get('characters', 100, 0, name).then((data) => {
          if (data.code === 200) {
            const arrMap = data.data.results.map((char) => {
                return {
                  image: char.thumbnail.path + '.' + char.thumbnail.extension,
                  name: char.name,
                  events: char.events.items.filter((event) => event.name),
                  series: char.series.items.filter((serie) => serie.name)
                }
            })
            this.resetHeroes(arrMap)
          }
        })
      } else {
        this.resetHeroes(JSON.parse(localStorage.getItem('characters')))
      }
    }

    loadDetails(id) {
      const hero = this.superHeroes[id]
      if(hero.events.length > 0) {
        this.events = []
        this.loadDetailsEvents(hero.events, id)
      }
      if (hero.series.length > 0) {
        this.series = []
        this.loadDetailsSeries(hero.series, id)
      }
    }

    async loadDetailsEvents (events, id) {
      const eventsPromises = events.map(event => {
        return  window.App.Api.get(event.resourceURI.replace('http://gateway.marvel.com/v1/public/', ''), 100, 0,'')
      })
      this.events = await Promise.all(eventsPromises)
      this.loadEvents(id)
    }

    async loadDetailsSeries (series, id) {
      const seriesPromises = series.map(serie => {
        return  window.App.Api.get(serie.resourceURI.replace('http://gateway.marvel.com/v1/public/', ''), 100, 0, '')
      })
      this.series = await Promise.all(seriesPromises)
      this.loadSeries(id)
    }

    loadEvents (id) {
      let template = ''
      for (let index = 0; index < this.events.length; index++) {
        const event = this.events[index].data.results[0]
        template += `
                    <article class="card">
                      <a href="#">
                          <picture class="thumbnail">
                              <img src="${this.checkSecurity(event.thumbnail.path+'.'+event.thumbnail.extension)}" alt="${event.title}">
                          </picture>
                          <div class="card-content">
                              <h2>${event.title}</h2>
                              ${(event.description != null) ? `<p>${event.description}</p><br />` : ''}
                              <ul>${event.urls.map((url) => `<li><a href="${url.url}" target="blank">${(url.type === 'wiki')?'Wiki' : 'Detalhes'}</a></li>`).join('')}</ul>
                          </div>
                      </a>
                    </article>`
      }
      document.getElementById('events-'+id).innerHTML = template
    }

    loadSeries (id) {
      let template = ''
      for (let index = 0; index < this.series.length; index++) {
        const serie = this.series[index].data.results[0]
        template += `
                    <article class="card">
                      <a href="#">
                          <picture class="thumbnail">
                              <img src="${this.checkSecurity(serie.thumbnail.path+'.'+serie.thumbnail.extension)}" alt="${serie.title}">
                          </picture>
                          <div class="card-content">
                              <h2>${serie.title}</h2>
                              ${(serie.description != null) ? `<p>${serie.description}</p><br />` : ''}
                              <ul>${serie.urls.map((url) => `<li><a href="${url.url}" target="blank">${(url.type === 'wiki')?'Wiki' : 'Detalhes'}</a></li>`).join('')}</ul>
                          </div>
                      </a>
                    </article>`
      }
      document.getElementById('series-'+id).innerHTML = template
    }

    checkSecurity (str) {
      if (window.location.protocol === 'https:') {
        str = str.replace('http:', window.location.protocol)
      }
      return str
    }

    resetHeroes (heroes) {
      this.superHeroes = heroes
      this.pageList = []
      this.list = []
      this.currentPage = 1
      this.numberPerPage = 3
      this.numberOfPages = 0
      this.makeList()
      this.loadList()
    }

  }

  window.App.states = {
    SuperHeroes
  };

}(window));
