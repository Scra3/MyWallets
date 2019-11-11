<template>
  <StackLayout class="HomePage">
    <FlexboxLayout :class="{ loading: isLoading }" class="wallets-overview">
      <ActivityIndicator v-if="isLoading" :busy="isLoading" />

      <template v-else>
        <PriceLabel
          :value="walletsValue"
          :currency="currency"
          data-test="wallets-value"
        />
        <PriceLabel
          :value="walletsPriceChange24"
          :currency="currency"
          data-test="wallet-price-change"
        />
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
                :text="`${wallet.balance} ${wallet.coin.symbol.toUpperCase()}`"
                class="balance"
                data-test="balance"
              />
              <FlexboxLayout class="current-price">
                <PriceLabel
                  :value="wallet.coin.currentPrice"
                  :currency="currency"
                  data-test="current-price"
                />
                <ChangePercentageLabel
                  :value="wallet.coin.priceChangePercentage24H"
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

      <Label
        v-if="wallets.length === 0 && !isLoading"
        text="No wallet added"
        class="message"
        data-test="message"
      />
    </StackLayout>
  </StackLayout>
</template>

<script>
import {
  fetchXRPWallet,
  fetchETHWallet,
  fetchEOSWallet,
  fetchNEOWallet,
  fetchWalletsMarket
} from '@/Api'

import { ETH, XRP, EOS, NEO } from '@/constants.js'
import ChangePercentageLabel from '@/components/ChangePercentageLabel'
import PriceLabel from '@/components//PriceLabel'

export default {
  name: 'WalletsPage',
  components: { ChangePercentageLabel, PriceLabel },
  props: {
    currency: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      intervalDelay: 60000,
      wallets: [],
      addresses: [
        {
          coinID: ETH,
          publicKey: '0x70Fe19189628d1050cb0e14aa7A1BBc246A48183'
        },
        { coinID: XRP, publicKey: 'rs7YB1m6EQfNRCmm5VbqFW3GDvA9SoFTAR' },
        { coinID: EOS, accountName: 'gi3tmnzsgqge' },
        { coinID: NEO, publicKey: 'ASfa8eQHaG2ZXt9VZaYA9SkkcCpbi3cacf' }
      ],
      intervalID: null,
      isLoading: true
    }
  },
  computed: {
    sortedWallets() {
      const sortWallets = (walletA, walletB) =>
        walletB.value() - walletA.value()
      return [...this.wallets].sort(sortWallets)
    },
    walletsValue() {
      if (this.wallets.length === 0) {
        return 0
      }
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.value())
      return Number(parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2))
    },
    walletsPriceChange24() {
      if (this.wallets.length === 0) {
        return 0
      }
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.coin.priceChange24H)
      return Number(parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2))
    }
  },
  watch: {
    async currency() {
      await this.fetchWallets()
    }
  },
  async mounted() {
    await this.fetchWallets()
    this.intervalID = setInterval(await this.fetchWallets, this.delay)
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
          }
        })

        const wallets = await Promise.all(pWallets)
        this.wallets = await fetchWalletsMarket(wallets, this.currency)
      } catch (e) {
        console.log(e)
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
    align-items: center;
    padding: 10;
    border-radius: 10;
    height: 120;
    font-size: 25;
    font-weight: bold;
    width: 100%;
    background-color: $grey;

    &.loading {
      color: $blue;
      justify-content: center;
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
