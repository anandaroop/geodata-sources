import data from '../public/data'
import request from 'request'

describe('resource urls', () => {
  data.sources.forEach(source => {
    test(`${source.url} is reachable`, done => {
      const options = {
        url: source.url,
        headers: {
          'User-Agent':
            'Node.js (https://anandaroop.github.io/geodata-sources/)'
        }
      }

      function validateResponse(error, response) {
        expect(() => {
          if (error) {
            throw new Error(`host ${error.hostname} could not be reached`)
          }
          const code = response && response.statusCode
          if (code !== 200) {
            throw new Error(`url ${source.url} could not be retrieved`)
          }
          done()
        }).not.toThrow()
      }

      request(options, validateResponse)
    })
  })
})
