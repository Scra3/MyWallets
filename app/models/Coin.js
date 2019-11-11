import camelCase from 'lodash.camelcase'

export class Coin {
  constructor(
    id,
    name = null,
    currentPrice = null,
    priceChangePercentage24H = null,
    priceChange24H = null,
    image = null,
    symbol = null
  ) {
    this.id = id
    this.name = name
    this.currentPrice = currentPrice
    this.priceChangePercentage24H = priceChangePercentage24H
    this.priceChange24H = priceChange24H
    this.image = image
    this.symbol = symbol
  }

  deserialize(input) {
    Object.assign(this, this.keysToCamel(input))
    return this
  }

  keysToCamel(o) {
    const isArray = a => {
      return Array.isArray(a)
    }

    const isObject = o => {
      return o === Object(o) && !isArray(o) && typeof o !== 'function'
    }

    if (isObject(o)) {
      const n = {}

      Object.keys(o).forEach(k => {
        if (Object.keys(this).includes(camelCase(k))) {
          n[camelCase(k)] = this.keysToCamel(o[k])
        }
      })

      return n
    } else if (isArray(o)) {
      return o.map(i => {
        return this.keysToCamel(i)
      })
    }

    return o
  }
}
