import { DB_NAME } from '@/constants'
import { removeUndefinedAttributeValues } from '@/stores/utils'

const Sqlite = require('nativescript-sqlite')

const TABLE_NAME = 'wallet'

export const WalletManager = {
  namespaced: true,
  state: {
    database: null,
    persistedWallets: null
  },
  mutations: {
    init(state, data) {
      state.database = data.database
    },
    load(state, persistedWallets) {
      state.persistedWallets = persistedWallets.reduce(
        (persistedWalletAcc, persistedWallet) => {
          const presentedPersistedWallet = {
            id: persistedWallet[0],
            investment: persistedWallet[1],
            coinId: persistedWallet[2],
            address: persistedWallet[3],
            isUsingLocalBalance: persistedWallet[4] === 1,
            balance: persistedWallet[5]
          }
          persistedWalletAcc.push(presentedPersistedWallet)
          return persistedWalletAcc
        },
        []
      )
    },
    save(state, wallet) {
      state.persistedWallets.push({
        id: wallet.id,
        investment: wallet.investment,
        coinId: wallet.coin.id,
        address: wallet.address,
        isUsingLocalBalance: wallet.isUsingLocalBalance,
        balance: wallet.balance
      })
    },
    update(state, updatedWallet) {
      const wallet = state.persistedWallets.find(
        persistedWallet => persistedWallet.id === updatedWallet.id
      )

      Object.assign(wallet, updatedWallet)
    },
    delete(state, id) {
      state.persistedWallets.filter(
        persistedWallet => persistedWallet.id !== id
      )
    }
  },
  actions: {
    init(context) {
      new Sqlite(DB_NAME).then(
        db => {
          db.execSQL(
            `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (id INTEGER PRIMARY KEY AUTOINCREMENT, ` +
              'investment REAL, ' +
              'coinId TEXT NOT NULL, ' +
              'address TEXT, ' +
              'isUsingLocalBalance INTEGER NOT NULL, ' +
              'balance TEXT)'
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
    insert(context, wallet) {
      removeUndefinedAttributeValues(wallet)

      context.state.database
        .execSQL(
          `INSERT INTO ${TABLE_NAME} (investment, coinId, address, isUsingLocalBalance, balance) VALUES (?, ?, ?, ?, ?)`,
          [
            wallet.investment,
            wallet.coin.id,
            wallet.address,
            wallet.isUsingLocalBalance ? 1 : 0,
            wallet.balance
          ]
        )
        .then(
          id => {
            wallet.id = id
            context.commit('save', wallet)
          },
          error => {
            console.log('INSERT ERROR', error)
          }
        )
    },
    update(context, wallet) {
      removeUndefinedAttributeValues(wallet)

      context.state.database
        .execSQL(
          `UPDATE ${TABLE_NAME} SET investment = ${wallet.investment}, ` +
            `address = '${wallet.address}', ` +
            `isUsingLocalBalance = ${wallet.isUsingLocalBalance ? 1 : 0}, ` +
            `balance = ${wallet.balance} ` +
            `WHERE id = ${wallet.id}`
        )
        .then(
          () => {
            context.commit('update', wallet)
          },
          error => {
            console.log('UPDATE ERROR', error)
          }
        )
    },
    selectAll(context) {
      context.state.database
        .all(
          `SELECT id, investment, coinId, address, isUsingLocalBalance, balance FROM ${TABLE_NAME}`,
          []
        )
        .then(
          persistedWallets => {
            context.commit('load', persistedWallets)
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
