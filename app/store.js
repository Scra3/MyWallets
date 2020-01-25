import Vue from 'nativescript-vue'
import Vuex from 'vuex'

const Sqlite = require('nativescript-sqlite')

Vue.use(Vuex)

export const store = new Vuex.Store({
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
      new Sqlite('myWallets.db').then(
        db => {
          db.execSQL(
            'CREATE TABLE IF NOT EXISTS wallets (id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
              'investment REAL, ' +
              'coinId TEXT NOT NULL, ' +
              'address TEXT, ' +
              'isUsingLocalBalance INTEGER NOT NULL, ' +
              'balance REAL)'
          ).then(
            id => {
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
      context.state.database
        .execSQL(
          'INSERT INTO wallets (investment, coinId, address, isUsingLocalBalance, balance) VALUES (?, ?, ?, ?, ?)',
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
      context.state.database
        .execSQL(
          `UPDATE wallets SET investment = ${wallet.investment}, ` +
            `address = '${wallet.address}', ` +
            `isUsingLocalBalance = ${wallet.isUsingLocalBalance ? 1 : 0}, ` +
            `balance = ${wallet.balance} ` +
            `where id = ${wallet.id}`
        )
        .then(
          id => {
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
          'SELECT id, investment, coinId, address, isUsingLocalBalance, balance FROM wallets',
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
        .execSQL('DELETE FROM wallets WHERE id = ?', [id])
        .then(
          _ => {
            context.commit('delete', id)
          },
          error => {
            console.log('SELECT ERROR', error)
          }
        )
    }
  }
})

store.dispatch('init')

Vue.prototype.$store = store
