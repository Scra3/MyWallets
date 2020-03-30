import { AlertManager } from '@/stores/AlertManager'
import { AppManager } from '@/stores/AppManager'
import { fetchCoinsMarket } from '@/Api'
import { Alert } from '@/models/Alert'
import { NotificationMixin } from '@/mixins/NotificationMixin'
import { USD, EUR } from '@/constants'
import store from '@/store'

export const WAITING_TIME = 10000

const getCurrency = app => {
  if (!app) {
    return USD
  }

  return app.currency === USD.acronym ? USD : EUR
}

const createNotification = async (alert, coin, selectedCurrency) => {
  await NotificationMixin.methods.$_createNotification(
    alert.note,
    coin.image,
    `${selectedCurrency.symbol}${alert.targetPrice} is reached on ${coin.name}`
  )
}

export const notificationAlerts = async () => {
  console.log('notificationAlert iteration started')

  const persistedAlertsFromDBOrNull = AlertManager.state.persistedAlerts || null
  const selectedCurrency = getCurrency(AppManager.state.app)
  if (!selectedCurrency || !persistedAlertsFromDBOrNull) {
    return
  }
  const coins = await fetchCoinsMarket(selectedCurrency)

  const alerts = persistedAlertsFromDBOrNull.map(persistedAlert =>
    Alert.buildAlertFromPersistedAlert(persistedAlert)
  )

  alerts.map(async alert => {
    const coin = coins.find(coin => alert.coinId === coin.id)

    if (
      parseFloat(alert.currentValueDuringCreation) <=
      parseFloat(alert.targetPrice)
    ) {
      if (parseFloat(coin.currentPrice) >= parseFloat(alert.targetPrice)) {
        console.log('alert is pushed')

        await createNotification(alert, coin, selectedCurrency)
        await store.dispatch('alertManager/delete', alert.id)
      }
    } else {
      if (parseFloat(coin.currentPrice) <= parseFloat(alert.targetPrice)) {
        console.log('alert is pushed')

        await createNotification(alert, coin, selectedCurrency)
        await store.dispatch('alertManager/delete', alert.id)
      }
    }
  })

  console.log('notificationAlert iteration ended')
}
