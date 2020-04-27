import { DB_NAME } from '@/constants'

const Sqlite = require('nativescript-sqlite')

export const AppManager = {
  namespaced: true,
  state: {
    database: null,
    app: null
  },
  mutations: {
    init(state, data) {
      state.database = data.database
    },
    load(state, app) {
      state.app = {
        id: app[0],
        currency: app[1]
      }
    },
    save(state, app) {
      state.app = app
    },
    update(state, updatedApp) {
      Object.assign(state.app, updatedApp)
    }
  },
  actions: {
    init(context) {
      return new Promise((resolve, reject) => {
        new Sqlite(DB_NAME).then(
          db => {
            db.execSQL(
              'CREATE TABLE IF NOT EXISTS app (id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'currency TEXT)'
            ).then(
              () => {
                context.commit('init', { database: db })
                resolve()
              },
              error => {
                console.log('CREATE TABLE ERROR', error)
                reject()
              }
            )
          },
          error => {
            console.log('OPEN DB ERROR', error)
          }
        )
      })
    },
    insert(context, app) {
      return new Promise((resolve, reject) => {
        context.state.database
          .execSQL('INSERT INTO app (currency) VALUES (?)', [app.currency])
          .then(
            id => {
              app.id = id
              context.commit('save', app)
              resolve()
            },
            error => {
              console.log('INSERT ERROR', error)
              reject()
            }
          )
      })
    },
    update(context, app) {
      return new Promise((resolve, reject) => {
        context.state.database
          .execSQL(
            `UPDATE app SET currency = '${app.currency}' WHERE id = ${app.id}`
          )
          .then(
            () => {
              context.commit('update', app)
              resolve()
            },
            error => {
              console.log('UPDATE ERROR', error)
              reject()
            }
          )
      })
    },
    select(context) {
      return new Promise((resolve, reject) => {
        context.state.database.all('SELECT id, currency FROM app', []).then(
          app => {
            context.commit('load', app[0])
            resolve()
          },
          error => {
            console.log('SELECT ERROR', error)
            reject()
          }
        )
      })
    }
  }
}
