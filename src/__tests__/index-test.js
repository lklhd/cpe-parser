const fs = require('fs')
const peg = require('pegjs')

describe('index', () => {
  describe('parser', () => {
    beforeEach(function (done) {
      fs.readFile('src/index.pegjs', 'utf8', (err, data) => {
        if (err) {
          throw new Error(err)
        }
        this.parser = peg.generate(data)
        done()
      })
    })

    it('parses the letter "a"', function () {
      expect(this.parser.parse('a')).toBe('a')
    })
  })
})
