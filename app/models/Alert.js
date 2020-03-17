export class Alert {
  constructor(
    targetPrice,
    note = null,
    currentValueDuringCreation,
    coinId,
    id = null
  ) {
    this.note = note
    this.targetPrice = targetPrice
    this.currentValueDuringCreation = currentValueDuringCreation
    this.coinId = coinId
    this.id = id
  }

  static buildAlertFromPersistedAlert(persistedAlert) {
    return new Alert(
      persistedAlert.targetPrice,
      persistedAlert.note,
      persistedAlert.currentValueDuringCreation,
      persistedAlert.coinId,
      persistedAlert.id
    )
  }
}
