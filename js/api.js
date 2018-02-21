// instantiate api when user requests
(function(window) {
    window.App = window.App || {}
  
    class Api {

        constructor () {
            this.apiPublicKey = '8f6e216f4ee45763e7f01353e0bc8d29'
            this.apiPrivateKey = 'af23f1ceb3e540c4915008375a5427e79e1dcd4d'
            this.url = 'http://gateway.marvel.com/v1/public/'
        }

        generateHashKey () {
            let ts = new Date().getTime()
            return {ts, hash: md5(ts+this.apiPrivateKey+this.apiPublicKey)}
        }

        generateUrl (path, limit, offset) {
            let hashKey = this.generateHashKey();
            return this.url + path + '?apikey=' + this.apiPublicKey + '&ts=' + hashKey.ts + '&hash=' + hashKey.hash+'&limit=' + limit + '&offset=' + offset;
        }

        get(path, limit, offset) {
            const URL = this.generateUrl(path, limit, offset)
            var headers = {
              'Content-Type': 'application/json'
            }
            const promise = new Promise((resolve, reject) => {
              try {
                fetch(URL, {
                  method: 'GET',
                  headers: headers,
                })
                  .then((response) => {
                    if (response.status === 200) {
                      response.json().then((data) => {
                        resolve(data)
                      })
                    } else {
                      response.json().then((error) => {
                        reject(error)
                      })
                    }
                  })
              } catch (e) {
                reject(error)
              }
            })
            return promise
          }
    }
  
    window.App.Api = new Api()
  
  }(window))
  