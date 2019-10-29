export class Coin {
  constructor(
    id,
    name = null,
    currentPrice = null,
    priceChangePercentage24h = null,
    priceChange24 = null,
    image = null
  ) {
    this._id = id
    this._name = name
    this._currentPrice = currentPrice
    this._priceChangePercentage24h = priceChangePercentage24h
    this._priceChange24 = priceChange24
    this._image = image
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
}
