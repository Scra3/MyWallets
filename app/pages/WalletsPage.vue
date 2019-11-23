<template>
  <StackLayout class="HomePage">
    <FlexboxLayout :class="{ loading: isLoading }" class="wallets-overview">
      <ActivityIndicator v-if="isLoading" :busy="isLoading" />
      <Label
        v-if="isFailedToLoad"
        text="Unable to connect to the server"
        class="message"
        data-test="error-message"
      />
      <template v-else-if="wallets.length > 0">
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
        <StackLayout orientation="horizontal">
          <ChangeLabel
            :value="walletsPriceChange24H"
            :unit="`${currency.symbol} (24h)`"
            data-test="wallets-price-change"
            class="price"
          />
        </StackLayout>
      </template>

      <template v-else>
        <label text="Please add wallets" data-test="information-message" />
      </template>
    </FlexboxLayout>

    <StackLayout class="wallets">
      <PullToRefresh @refresh="refresh" color="#43ab92">
        <ListView v-for="wallet in sortedWallets">
          <v-template>
            <FlexboxLayout class="wallet">
              <Image :src="wallet.coin.image" class="image" data-test="image" />
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
  </StackLayout>
</template>

<script>
import {
  fetchXRPWallet,
  fetchETHWallet,
  fetchEOSWallet,
  fetchNEOWallet,
  fetchBTCWallet,
  fetchWalletsMarket
} from '@/Api'

import { ETH, XRP, EOS, NEO, EUR, BTC } from '@/constants.js'
import ChangeLabel from '@/components/ChangeLabel'
import PriceLabel from '@/components//PriceLabel'

export default {
  name: 'WalletsPage',
  components: { ChangeLabel, PriceLabel },
  props: {
    currency: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      intervalDelay: 60000,
      wallets: [],
      investmentCurrency: EUR,
      investment: 1050,
      addresses: [
        {
          coinID: ETH,
          publicKey: '0x70Fe19189628d1050cb0e14aa7A1BBc246A48183'
        },
        { coinID: XRP, publicKey: 'rs7YB1m6EQfNRCmm5VbqFW3GDvA9SoFTAR' },
        { coinID: EOS, accountName: 'gi3tmnzsgqge' },
        { coinID: NEO, publicKey: 'ASfa8eQHaG2ZXt9VZaYA9SkkcCpbi3cacf' },
        { coinID: BTC, publicKey: 'ASfa8eQHaG2ZXt9VZaYA9SkkcCpbi3cacf' }
      ],
      intervalID: null,
      isLoading: true,
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
    async currency() {
      await this.fetchWallets()
    }
  },
  async mounted() {
    await this.fetchWallets()
    this.intervalID = setInterval(await this.fetchWallets, this.intervalDelay)
  },
  beforeDestroy() {
    clearInterval(this.intervalID)
  },
  methods: {
    async refresh(event) {
      const pullRefresh = event.object
      await this.fetchWallets()
      pullRefresh.refreshing = false
    },
    async fetchWallets() {
      this.isLoading = true

      try {
        const pWallets = this.addresses.map(async address => {
          if (address.coinID === XRP) {
            return fetchXRPWallet(address.publicKey)
          } else if (address.coinID === ETH) {
            return fetchETHWallet(address.publicKey)
          } else if (address.coinID === EOS) {
            return fetchEOSWallet(address.accountName)
          } else if (address.coinID === NEO) {
            return fetchNEOWallet(address.publicKey)
          } else if (address.coinID === BTC) {
            return fetchBTCWallet(address.publicKey)
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
@import '../styles.scss';

.HomePage {
  .wallets-overview {
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    padding: 10;
    border-radius: 10;
    height: 120;
    font-size: 25;
    font-weight: normal;
    width: 100%;
    background-color: $grey;

    &.loading {
      color: $blue;
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
      color: $white;

      .image {
        height: 25;
        width: 10%;
      }

      .name {
        font-size: 15;
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

    .message {
      text-align: center;
      width: 100%;
      font-weight: bold;
    }
  }
}
</style>
