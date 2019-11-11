export class Coin {
  constructor(
    id,
    name = null,
    currentPrice = null,
    priceChangePercentage24h = null,
    priceChange24 = null,
    image = null,
    symbol = null
  ) {
    this._id = id
    this._name = name
    this._currentPrice = currentPrice
    this._priceChangePercentage24h = priceChangePercentage24h
    this._priceChange24 = priceChange24
    this._image = image
    this.symbol = symbol
  }

  deserialize(input) {
    Object.assign(this, input)
    return this
  }

  get id() {
    return this._id
  }

  set id(value) {
    this._id = value
  }

  get name() {
    return this._name
  }

  set name(value) {
    this._name = value
  }

  get currentPrice() {
    return this._currentPrice
  }

  set currentPrice(value) {
    this._currentPrice = value
  }

  get priceChangePercentage24h() {
    return this._priceChangePercentage24h
  }

  set priceChangePercentage24h(value) {
    this._priceChangePercentage24h = value
  }

  get priceChange24() {
    return this._priceChange24
  }

  set priceChange24(value) {
    this._priceChange24 = value
  }

  get image() {
    return this._image
  }

  set image(value) {
    this._image = value
  }

  get symbol() {
    return this._symbol
  }

  set symbol(value) {
    this._symbol = value
  }
}
