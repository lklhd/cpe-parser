const cpe = require('..')

describe('index', () => {
  describe('parse', () => {
    it('should be defined', () => {
      expect(cpe.parse).toBeDefined()
    })
  })

  describe('evaluate', () => {
    it('should be defined', () => {
      expect(cpe.evaluate).toBeDefined()
    })
  })
})
