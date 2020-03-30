import { DB_NAME } from '@/constants'
import {
  removeUndefinedAttributeValues,
  replaceNullValueToBlank
} from '@/stores/utils'

const Sqlite = require('nativescript-sqlite')

const TABLE_NAME = 'alert'

export const AlertManager = {
  namespaced: true,
  state: {
    database: null,
    persistedAlerts: []
  },
  mutations: {
    init(state, data) {
      state.database = data.database
    },
    load(state, persistedAlerts) {
      state.persistedAlerts = persistedAlerts.reduce(
        (persistedAlertsAcc, persistedAlert) => {
          const presentedPersistedAlert = {
            id: persistedAlert[0],
            targetPrice: persistedAlert[1],
            note: persistedAlert[2],
            currentValueDuringCreation: persistedAlert[3],
            coinId: persistedAlert[4]
          }
          persistedAlertsAcc.push(presentedPersistedAlert)
          return persistedAlertsAcc
        },
        []
      )
    },
    save(state, alert) {
      state.persistedAlerts.push({
        id: alert.id,
        targetPrice: alert.targetPrice,
        note: alert.note,
        currentValueDuringCreation: alert.currentValueDuringCreation,
        coinId: alert.coinId
      })
    },
    update(state, updatedAlert) {
      const alert = state.persistedAlerts.find(
        persistedAlert => persistedAlert.id === updatedAlert.id
      )

      Object.assign(alert, updatedAlert)
    },
    delete(state, id) {
      state.persistedAlerts = state.persistedAlerts.filter(
        persistedAlert => persistedAlert.id !== id
      )
    }
  },
  actions: {
    init(context) {
      new Sqlite(DB_NAME).then(
        db => {
          db.execSQL(
            `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (id INTEGER PRIMARY KEY AUTOINCREMENT, ` +
              'note TEXT, ' +
              'currentValueDuringCreation TEXT NOT NULL, ' +
              'coinId TEXT NOT NULL, ' +
              'targetPrice TEXT NOT NULL)'
          ).then(
            () => {
              context.commit('init', { database: db })
            },
            error => {
              console.log('CREATE TABLE ERROR', error)
            }
          )
        },
        error => {
          console.log('OPEN DB ERROR', error)
        }
      )
    },
    insert(context, alert) {
      removeUndefinedAttributeValues(alert)

      context.state.database
        .execSQL(
          `INSERT INTO ${TABLE_NAME} (targetPrice, note, currentValueDuringCreation, coinId) VALUES (?, ?, ?, ?)`,
          [
            alert.targetPrice,
            replaceNullValueToBlank(alert.note),
            alert.currentValueDuringCreation,
            alert.coinId
          ]
        )
        .then(
          id => {
            alert.id = id
            context.commit('save', alert)
          },
          error => {
            console.log('INSERT ERROR', error)
          }
        )
    },
    update(context, alert) {
      removeUndefinedAttributeValues(alert)

      context.state.database
        .execSQL(
          `UPDATE ${TABLE_NAME} SET targetPrice = ${alert.targetPrice}, ` +
            `note = '${replaceNullValueToBlank(alert.note)}', ` +
            `coinId = '${alert.coinId}', ` +
            `currentValueDuringCreation = '${alert.currentValueDuringCreation}' ` +
            `WHERE id = ${alert.id}`
        )
        .then(
          () => {
            context.commit('update', alert)
          },
          error => {
            console.log('UPDATE ERROR', error)
          }
        )
    },
    selectAll(context) {
      context.state.database
        .all(
          `SELECT id, targetPrice, note, currentValueDuringCreation, coinId FROM ${TABLE_NAME}`,
          []
        )
        .then(
          persistedAlerts => {
            context.commit('load', persistedAlerts)
          },
          error => {
            console.log('SELECT ERROR', error)
          }
        )
    },
    delete(context, id) {
      context.state.database
        .execSQL(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id])
        .then(
          () => {
            context.commit('delete', id)
          },
          error => {
            console.log('DELETE ERROR', error)
          }
        )
    }
  }
}
