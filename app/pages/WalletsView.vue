<template>
  <StackLayout class="WalletsView darkMode">
    <FlexboxLayout class="wallets-overview">
      <ActivityIndicator v-if="isLoading" :busy="isLoading" class="spinner" />
      <ErrorMessage
        v-else-if="isFailedToLoad"
        :is-failed-to-load="isFailedToLoad"
        data-test="error-message"
      />
      <FlexboxLayout
        v-else-if="wallets && wallets.length > 0"
        class="main-infos"
      >
        <PriceLabel
          :value="totalValue"
          :currency="currency"
          class="wallets-value"
          data-test="wallets-value"
        />

        <label :text="`Crypto Fear: ${cryptoFear}`" class="crypto-fear" />

        <FlexboxLayout class="sub-infos">
          <PriceLabel
            v-if="totalInvestment !== 0"
            :value="totalInvestment"
            :currency="currency"
            class="price"
            data-test="wallets-price"
          />

          <ChangeLabel
            v-if="totalInvestment !== 0"
            :value="ratio"
            unit="%"
            data-test="wallets-ratio"
            class="price"
          />
          <ChangeLabel
            :value="totalPriceChange24H"
            :unit="`${currency.symbol} (24h)`"
            data-test="wallets-price-change"
            class="price"
          />
        </FlexboxLayout>
      </FlexboxLayout>

      <label v-else text="Please add wallets" data-test="information-message" />
    </FlexboxLayout>

    <grid-layout rows="auto, *">
      <StackLayout row="1" class="wallets">
        <PullToRefresh @refresh="refresh" class="spinner">
          <ListView
            v-for="wallet in sortedWallets"
            @itemTap="navigateToWalletPage"
            automationText="wallet-item"
          >
            <v-template>
              <FlexboxLayout class="wallet">
                <Image
                  :src="wallet.coin.image"
                  class="icon coinIcon"
                  data-test="image"
                />
                <FlexboxLayout class="column">
                  <Label
                    :text="wallet.coin.name"
                    class="name"
                    data-test="name"
                  />
                  <Label
                    :text="wallet | formatBalanceWithSymbol"
                    data-test="balance"
                  />
                </FlexboxLayout>

                <FlexboxLayout class="column">
                  <PriceLabel
                    :value="wallet.coin.currentPrice"
                    :currency="currency"
                    data-test="current-price"
                  />
                  <ChangeLabel
                    :value="wallet.coin.priceChangePercentage24H"
                    unit="%"
                    data-test="change-percentage"
                  />
                </FlexboxLayout>

                <FlexboxLayout class="column">
                  <PriceLabel
                    :value="wallet.value()"
                    :currency="currency"
                    class="value"
                    data-test="value"
                  />
                  <PriceLabel
                    v-if="wallet.investment"
                    :value="wallet.investment"
                    :currency="currency"
                  />
                </FlexboxLayout>
              </FlexboxLayout>
            </v-template>
          </ListView>
        </PullToRefresh>
      </StackLayout>
      <Fab
        @tap="navigateToCoinsPage"
        row="1"
        automationText="add-wallet-button"
        class="fab-button"
      >
        +
      </Fab>
    </grid-layout>
  </StackLayout>
</template>

<script>
import { fetchWalletsCoinMarket, fetchCryptoFear } from '@/Api'
import ChangeLabel from '@/components/ChangeLabel'
import PriceLabel from '@/components/PriceLabel'
import WalletPage from '@/pages/WalletPage'
import ErrorMessage from '@/components/ErrorMessage'
import { WalletMixin } from '@/mixins/WalletMixin.js'
import { Wallet } from '@/models/Wallet'
import CoinsPage from '@/pages/CoinsPage'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'WalletsView',
  components: { ErrorMessage, ChangeLabel, PriceLabel },
  filters: {
    formatBalanceWithSymbol(wallet) {
      return `${wallet.balance} ${wallet.coin.symbol.toUpperCase()}`
    }
  },
  mixins: [WalletMixin],
  props: {
    currency: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      intervalDelay: 60000,
      wallets: null,
      intervalID: null,
      isLoading: false,
      isFailedToLoad: false,
      cryptoFear: null
    }
  },
  computed: {
    ...mapState('walletsDb', ['persistedWallets']),
    persistedWalletsFromDB() {
      return this.persistedWallets || []
    },
    sortedWallets() {
      if (!this.wallets) {
        return []
      }
      const sortWallets = (walletA, walletB) =>
        walletB.value() - walletA.value()
      return [...this.wallets].sort(sortWallets)
    },
    totalValue() {
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.value())
      return Number(parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2))
    },
    totalPriceChange24H() {
      const priceChange = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.coin.priceChange24H) * wallet.balance
      return Number(
        parseFloat(this.wallets.reduce(priceChange, 0.0)).toFixed(2)
      )
    },
    totalInvestment() {
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.investment || 0)
      return Number(parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2))
    },
    ratio() {
      return Number(
        parseFloat(
          (this.totalValue / this.totalInvestment) * 100 - 100
        ).toFixed(2)
      )
    }
  },
  watch: {
    currency() {
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData()

    this.intervalID = setInterval(this.fetchData, this.intervalDelay)
  },
  beforeDestroy() {
    clearInterval(this.intervalID)
  },
  methods: {
    ...mapActions('walletsDb', ['selectAll']),
    navigateToWalletPage(event) {
      // wallet in listview is undefined that why we use event.
      this.$navigateTo(WalletPage, {
        props: {
          wallet: this.sortedWallets[event.index],
          currency: this.currency,
          isUpdating: true
        }
      })
    },
    navigateToCoinsPage() {
      this.$navigateTo(CoinsPage, {
        props: {
          currency: this.currency
        }
      })
    },

    async fetchData() {
      this.isLoading = true
      this.isFailedToLoad = false

      try {
        const results = await Promise.all([
          fetchCryptoFear(),
          this.fetchWallets()
        ])
        this.cryptoFear = results[0]
        this.wallets = results[1]
      } catch (e) {
        console.log('when fetching data in WalletsView', e)
        this.isFailedToLoad = true
      } finally {
        this.isLoading = false
      }
    },
    async refresh(event) {
      const pullRefresh = event.object
      await this.fetchData()
      pullRefresh.refreshing = false
    },
    async fetchWallets() {
      // load all data from the bd into the store
      await this.selectAll()
      let wallets = this.persistedWalletsFromDB.map(persistedWallet =>
        Wallet.buildWalletFromPersistedWallet(persistedWallet)
      )

      const walletsWithRemoteBalance = wallets.filter(
        wallet => !wallet.isUsingLocalBalance
      )
      const pWallets = walletsWithRemoteBalance.map(wallet =>
        this.$_fetchWalletBalance(wallet)
      )

      const balances = await Promise.all(pWallets)
      balances.forEach(
        (balance, index) => (walletsWithRemoteBalance[index].balance = balance)
      )
      wallets = [
        ...walletsWithRemoteBalance,
        ...wallets.filter(wallet => wallet.isUsingLocalBalance)
      ]
      return fetchWalletsCoinMarket(wallets, this.currency)
    }
  }
}
</script>

<style lang="scss" scoped>
.WalletsView {
  .wallets-overview {
    justify-content: center;
    align-items: center;
    padding: $separation-content;
    border-radius: $border-radius;
    height: 120;
    font-size: $large-font-size;
    background-color: $surface;
    margin: $separation-content;

    .main-infos {
      align-items: center;
      flex-direction: column;
      width: 100%;

      .wallets-value {
        font-weight: bold;
        color: $onSurface;
        flex-grow: 1;
        align-items: center;
        font-size: $large-font-size;
      }

      .crypto-fear {
        align-items: flex-end;
        font-size: $normal-font-size;
        color: $onSurfaceMediumEmphasis;
      }

      .sub-infos {
        width: 100%;
        justify-content: space-around;
        align-items: center;
        margin-top: $separation-content;

        .price {
          font-size: $normal-font-size;
        }
      }
    }
  }

  .wallets {
    padding: $separation-content;

    .wallet {
      justify-content: space-between;
      align-items: center;
      background-color: $surface;
      border-radius: $border-radius;
      padding: $separation-content;
      width: auto;

      .icon {
        width: auto;
      }

      .column {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 30%;

        .name {
          font-size: $normal-font-size;
        }
      }

      .value {
        font-weight: bold;
        color: $primary;
        width: auto;
      }
    }
  }

  .fab-button {
    height: 60;
    width: 50;
    margin: 15;
    background-color: $secondary;
    horizontal-align: right;
    vertical-align: bottom;
    color: $onSecondary;
  }
}
</style>
