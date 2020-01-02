<template>
  <StackLayout class="WalletsView darkMode">
    <FlexboxLayout :class="{ loading: isLoading }" class="wallets-overview">
      <ActivityIndicator v-if="isLoading" :busy="isLoading" class="spinner" />
      <ErrorMessage
        v-else-if="isFailedToLoad"
        :is-failed-to-load="isFailedToLoad"
        data-test="error-message"
      />
      <template v-else-if="wallets && wallets.length > 0">
        <FlexboxLayout class="main-infos">
          <PriceLabel
            :value="investment"
            :currency="investmentCurrency"
            class="price"
          />
          <PriceLabel
            :value="walletsValue"
            :currency="currency"
            class="wallets-value"
            data-test="wallets-value"
          />
          <ChangeLabel
            :value="ratio"
            unit="%"
            data-test="wallets-ratio"
            class="price"
          />
        </FlexboxLayout>
        <ChangeLabel
          :value="walletsPriceChange24H"
          :unit="`${currency.symbol} (24h)`"
          data-test="wallets-price-change"
          class="price"
        />
      </template>

      <template v-else>
        <label text="Please add wallets" data-test="information-message" />
      </template>
    </FlexboxLayout>

    <grid-layout rows="auto, *">
      <StackLayout row="1" class="wallets">
        <PullToRefresh v-if="wallets" @refresh="refresh" class="spinner">
          <ListView
            v-for="wallet in sortedWallets"
            @itemTap="navigateToWalletPage"
          >
            <v-template>
              <FlexboxLayout class="wallet">
                <Image
                  :src="wallet.coin.image"
                  class="icon coinIcon"
                  data-test="image"
                />
                <Label :text="wallet.coin.name" class="name" data-test="name" />
                <Label
                  :text="
                    `${parseFloat(wallet.balance).toFixed(
                      2
                    )} ${wallet.coin.symbol.toUpperCase()}`
                  "
                  class="balance"
                  data-test="balance"
                />
                <FlexboxLayout class="current-price">
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

                <PriceLabel
                  :value="wallet.value()"
                  :currency="currency"
                  class="value"
                  data-test="value"
                />
              </FlexboxLayout>
            </v-template>
          </ListView>
        </PullToRefresh>
      </StackLayout>
      <Fab @tap="navigateToCoinsPage" row="1" class="fab-button">
        +
      </Fab>
    </grid-layout>
  </StackLayout>
</template>

<script>
import { fetchWalletsMarket } from '@/Api'

import { BTC, EOS, ETH, EUR, NEO, XRP } from '@/constants.js'
import ChangeLabel from '@/components/ChangeLabel'
import PriceLabel from '@/components/PriceLabel'
import WalletPage from '@/pages/WalletPage'
import CoinsPage from '@/pages/CoinsPage'
import ErrorMessage from '@/components/ErrorMessage'
import { WalletMixin } from '@/mixins/WalletMixin.js'
import { Wallet } from '@/models/Wallet'

export default {
  name: 'WalletsView',
  components: { ErrorMessage, ChangeLabel, PriceLabel },
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
      investmentCurrency: EUR,
      investment: 1050,
      persistedWallets: [
        {
          id: ETH,
          address: '0x70Fe19189628d1050cb0e14aa7A1BBc246A48183',
          isUsingBalanceSetting: false
        },
        {
          id: XRP,
          address: 'rs7YB1m6EQfNRCmm5VbqFW3GDvA9SoFTAR',
          isUsingBalanceSetting: false
        },
        {
          id: EOS,
          address: 'gi3tmnzsgqge',
          isUsingBalanceSetting: false
        },
        {
          id: NEO,
          address: 'ASfa8eQHaG2ZXt9VZaYA9SkkcCpbi3cacf',
          isUsingBalanceSetting: false
        },
        {
          id: BTC,
          balance: 0.041,
          address: 'ASfa8eQHaG2ZXt9VZaYA9SkkcCpbi3cacf',
          isUsingBalanceSetting: true
        }
      ],
      intervalID: null,
      isLoading: false,
      isFailedToLoad: false
    }
  },
  computed: {
    sortedWallets() {
      const sortWallets = (walletA, walletB) =>
        walletB.value() - walletA.value()
      return [...this.wallets].sort(sortWallets)
    },
    walletsValue() {
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.value())
      return Number(parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2))
    },
    walletsPriceChange24H() {
      const priceChange = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.coin.priceChange24H) * wallet.balance
      return Number(
        parseFloat(this.wallets.reduce(priceChange, 0.0)).toFixed(2)
      )
    },
    ratio() {
      return Number(
        parseFloat((this.walletsValue / this.investment) * 100 - 100).toFixed(2)
      )
    }
  },
  watch: {
    currency() {
      this.fetchWallets()
    }
  },
  mounted() {
    this.fetchWallets()
    this.intervalID = setInterval(this.fetchWallets, this.intervalDelay)
  },
  beforeDestroy() {
    clearInterval(this.intervalID)
  },
  methods: {
    navigateToWalletPage(event) {
      // wallet in listview is undefined that why we use event.
      this.$navigateTo(WalletPage, {
        props: {
          wallet: this.sortedWallets[event.index],
          currency: this.currency
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
    async refresh(event) {
      const pullRefresh = event.object
      await this.fetchWallets()
      pullRefresh.refreshing = false
    },
    async fetchWallets() {
      this.isLoading = true
      this.isFailedToLoad = false

      try {
        const pWallets = this.persistedWallets.map(wallet => {
          if (wallet.isUsingBalanceSetting) {
            return Wallet.buildWalletFromPersistedWallet(wallet)
          } else {
            return this.$_fetchWallet(wallet.address, wallet.id)
          }
        })
        const wallets = await Promise.all(pWallets)
        this.wallets = await fetchWalletsMarket(wallets, this.currency)
      } catch (e) {
        this.isFailedToLoad = true
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.WalletsView {
  .wallets-overview {
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: $separation-content;
    border-radius: 10;
    height: 120;
    font-size: $large-font-size;
    background-color: $grey;
    margin: $separation-content;

    &.loading {
      justify-content: center;
    }

    .price {
      font-weight: normal;
    }

    .main-infos {
      justify-content: space-around;
      align-items: center;
      width: 100%;

      .wallets-value {
        font-weight: bold;
        color: $blue;
      }
    }
  }

  .wallets {
    .wallet {
      height: 60;
      padding: 10;
      justify-content: space-between;
      align-items: center;

      .icon {
        width: 10%;
      }

      .name {
        font-size: $normal-font-size;
        margin-left: 20;
        width: 20%;
      }

      .balance {
        width: 25%;
      }

      .current-price {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 20%;
      }

      .value {
        font-weight: bold;
        width: 20%;
      }
    }
  }

  .fab-button {
    height: 60;
    width: 50;
    margin: 15;
    background-color: $white;
    horizontal-align: right;
    vertical-align: bottom;
    color: $blue;
  }
}
</style>
