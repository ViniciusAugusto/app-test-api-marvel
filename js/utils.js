(function(window) {
    window.App = window.App || {}

    class LoaderHeroes {
        constructor () {
            this.path = 'characters'
            this.limit = 0
            this.count = 0
            this.offset = 0
            this.total = 0
        }

        preLoad () {
            if (!localStorage.getItem('characters')) {
                this.load([], 0, (characters) => {
                    localStorage.setItem('characters', JSON.stringify(characters))
                })
            }else {
                console.log(JSON.parse(localStorage.getItem('characters')))
            }
        }

        load (characters, count, cb) {
            window.App.Api.get(this.path, 100, count, {}).then((data) => {
                if (data.code === 200) {
                    this.total = data.data.total
                    this.count = count + 100
                    const arrMap = data.data.results.map((char) => {
                        return {
                            image: char.thumbnail.path + '.' + char.thumbnail.extension,
                            name: char.name,
                            events: char.events.items.filter((event) => event.name),
                            series: char.series.items.filter((serie) => serie.name)
                        }
                    })

                    characters = characters.concat(arrMap)
                    if(characters.length === this.total) {
                        cb(characters)
                    } else {
                        this.load(characters, this.count, cb)
                    }
                }

            })
        }
    }

    window.App.LoaderHeroes = new LoaderHeroes().preLoad();

}(window));