<template>
  <StackLayout class="WalletsView darkMode">
    <FlexboxLayout v-if="sortedWallets.length > 0" class="overview">
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
        <Button
          @tap="navigateToAnalysesPage"
          class="analysis-button"
          data-test="analysis-button"
          automationText="analysis-button"
        >
          <FormattedString>
            <Span text="Analyses" class="label" />
          </FormattedString>
        </Button>
        <PriceLabel
          :value="totalValue"
          :currency="currency"
          class="wallets-value"
          data-test="wallets-value"
        />
        <label :text="`Crypto Fear: ${cryptoFear}`" class="crypto-fear" />

        <FlexboxLayout class="sub-infos">
          <FlexboxLayout v-if="totalInvestment !== 0" class="sub-info">
            <Label class="label" text="Total Investment" />
            <PriceLabel
              :value="totalInvestment"
              :currency="currency"
              class="price"
              data-test="wallets-price"
            />
          </FlexboxLayout>

          <FlexboxLayout v-if="totalInvestment !== 0" class="sub-info">
            <Label class="label" text="Total % Profit" />
            <ChangeLabel
              v-if="totalInvestment !== 0"
              :value="ratio"
              unit="%"
              data-test="wallets-ratio"
              class="price"
            />
          </FlexboxLayout>

          <FlexboxLayout class="sub-info">
            <Label class="label" text="24h Profit" />
            <ChangeLabel
              :value="totalPriceChange24H"
              :unit="currency.symbol"
              data-test="wallets-price-change"
              class="price"
            />
          </FlexboxLayout>
        </FlexboxLayout>
      </FlexboxLayout>
    </FlexboxLayout>

    <grid-layout rows="auto, *">
      <StackLayout v-if="sortedWallets.length > 0" row="1" class="wallets">
        <FlexboxLayout class="header">
          <Label text="Name / Balance" />
          <Label text="Price / 24h" />
          <Label text="Value / Investment" />
        </FlexboxLayout>

        <PullToRefresh @refresh="refresh" class="spinner">
          <ListView
            v-for="wallet in sortedWallets"
            @itemTap="navigateToWalletFormPage"
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
      <LoadingMessage
        v-else-if="isLoading"
        row="1"
        sub-title="Please wait, we are fetching Wallets."
        title="Processing"
      />
      <EmptyListMessage
        v-else
        row="1"
        title="Empty wallet list"
        sub-title="Save a wallet and it will show up here."
        data-test="information-message"
      />
      <Fab
        @tap="navigateToCoinsPage"
        row="2"
        automationText="add-wallet-button"
        class="fab-button"
      >
        +
      </Fab>
    </grid-layout>
  </StackLayout>
</template>

<script>
import { fetchCryptoFear, fetchWalletsCoinMarket } from '@/Api'
import ChangeLabel from '@/components/ChangeLabel'
import PriceLabel from '@/components/PriceLabel'
import WalletFormPage from '@/pages/WalletFormPage'
import ErrorMessage from '@/components/ErrorMessage'
import { WalletMixin } from '@/mixins/WalletMixin'
import { Wallet } from '@/models/Wallet'
import CoinsPage from '@/pages/CoinsPage'
import { mapActions, mapState } from 'vuex'
import EmptyListMessage from '@/components/EmptyListMessage'
import LoadingMessage from '@/components/LoadingMessage'
import { NavigationMixin } from '@/mixins/NavigationMixin'
import AnalysesPage from '@/pages/AnalysesPage'

export default {
  name: 'WalletsView',
  components: {
    LoadingMessage,
    EmptyListMessage,
    ErrorMessage,
    ChangeLabel,
    PriceLabel
  },
  filters: {
    formatBalanceWithSymbol(wallet) {
      return `${wallet.balance} ${wallet.coin.symbol.toUpperCase()}`
    }
  },
  mixins: [WalletMixin, NavigationMixin],
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
    ...mapState('walletManager', ['persistedWallets']),
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
      return this.$_totalValue(this.wallets)
    },
    totalPriceChange24H() {
      const priceChange = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.coin.priceChange24H) * wallet.balance
      return Number(
        parseFloat(this.wallets.reduce(priceChange, 0.0)).toFixed(2)
      )
    },
    totalInvestment() {
      return this.$_totalInvestment(this.wallets)
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
  },
  beforeDestroy() {
    clearInterval(this.intervalID)
  },
  methods: {
    ...mapActions('walletManager', ['selectAll']),
    fetchDataLoop() {
      return setInterval(this.fetchData, this.intervalDelay)
    },
    navigateToWalletFormPage(event) {
      // wallet in listview is undefined that why we use event.
      this.$_navigateTo(WalletFormPage, {
        props: {
          wallet: this.sortedWallets[event.index],
          currency: this.currency,
          isUpdating: true
        }
      })
    },
    navigateToCoinsPage() {
      this.$_navigateTo(CoinsPage, {
        props: {
          currency: this.currency
        }
      })
    },
    navigateToAnalysesPage() {
      this.$_navigateTo(AnalysesPage, {
        props: {
          wallets: this.wallets,
          currency: this.currency
        }
      })
    },
    async fetchData() {
      console.log('fetching data')

      this.isLoading = true
      this.isFailedToLoad = false

      try {
        const [cryptoFear, wallets] = await Promise.all([
          fetchCryptoFear(),
          this.fetchWallets()
        ])
        this.cryptoFear = cryptoFear
        this.wallets = wallets
      } catch (e) {
        console.log('when fetching data in WalletsView', e)
        this.isFailedToLoad = true
      } finally {
        this.isLoading = false
      }

      // fetch data every X seconds
      if (!this.intervalID) {
        this.intervalID = this.fetchDataLoop()
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
  .overview {
    justify-content: center;
    align-items: center;
    padding: $separation-content;
    border-radius: $border-radius;
    height: 130;
    font-size: $large-font-size;
    background-color: $surface;
    margin: $separation-content;

    .main-infos {
      align-items: center;
      flex-direction: column;
      width: 100%;

      .analysis-button {
        align-self: flex-end;
        width: 100;
        padding: 0;
        margin: 0;
        height: 20;
        color: $onSurface;
        background-image: url('res://pie_chart');
        background-repeat: no-repeat;
        background-position: right center;
        background-size: contain;
        background-color: $surface;

        .label {
          font-size: $small-font-size;
        }
      }

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
        margin-top: $separation-content;
        width: 100%;
        justify-content: space-around;
        align-items: center;

        .sub-info {
          flex-direction: column;
          align-items: center;

          .price {
            font-size: $normal-font-size;
          }

          .label {
            font-size: $small-font-size;
          }
        }
      }
    }
  }

  .wallets {
    padding: $separation-content;

    .header {
      justify-content: space-around;
      padding-bottom: $separation-content;
      font-weight: bold;
      font-size: $normal-font-size;
    }

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
