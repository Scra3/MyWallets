<template>
  <StackLayout class="HomePage">
    <FlexboxLayout :class="{ loading: isLoading }" class="wallets-overview">
      <ActivityIndicator v-if="isLoading" :busy="isLoading" />

      <template v-else>
        <PriceLabel :value="walletsValue" :currency="currency" />
        <ChangePercentageLabel :value="0" />
      </template>
    </FlexboxLayout>

    <StackLayout class="wallets">
      <PullToRefresh @refresh="refresh" color="#43ab92">
        <ListView v-for="wallet in sortedWallets">
          <v-template>
            <FlexboxLayout class="wallet">
              <Image :src="wallet.coin.image" class="image" />
              <Label :text="wallet.coin.name" class="name" />
              <Label
                :text="`${wallet.balance} ${wallet.coin.symbol.toUpperCase()}`"
                class="balance"
              />
              <FlexboxLayout class="current-price">
                <PriceLabel
                  :value="wallet.value()"
                  :currency="wallet.coin.currentPrice"
                />
                <ChangePercentageLabel
                  :value="wallet.coin.priceChangePercentage24h"
                />
              </FlexboxLayout>

              <PriceLabel
                :value="wallet.value()"
                :currency="currency"
                class="value"
              />
            </FlexboxLayout>
          </v-template>
        </ListView>
      </PullToRefresh>

      <Label
        v-if="wallets.length === 0 && !isLoading"
        text="No wallet added"
        class="message"
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
      wallets: [],
      addresses: [
        {
          coinName: ETH,
          publicKey: '0x70Fe19189628d1050cb0e14aa7A1BBc246A48183'
        },
        { coinName: XRP, publicKey: 'rs7YB1m6EQfNRCmm5VbqFW3GDvA9SoFTAR' },
        { coinName: EOS, accountName: 'gi3tmnzsgqge' },
        { coinName: NEO, publicKey: 'ASfa8eQHaG2ZXt9VZaYA9SkkcCpbi3cacf' }
      ],
      intervalID: null,
      isLoading: true
    }
  },
  computed: {
    sortedWallets() {
      const wallets = this.wallets
      const sortWallets = (walletA, walletB) =>
        walletB.value() - walletA.value()
      return wallets.sort(sortWallets)
    },
    walletsValue() {
      if (this.wallets.length === 0) {
        return 0
      }
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.value())
      return parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2)
    },
    walletsPriceChange24() {
      if (this.wallets.length === 0) {
        return 0
      }
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.coin.priceChange24)
      return parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2)
    }
  },
  watch: {
    async currency() {
      this.isLoading = true
      await this.fetchWallets()
      this.isLoading = false
    }
  },
  async mounted() {
    // Loader must be display only for the first request
    this.isLoading = true
    await this.fetchWallets()
    this.intervalID = setInterval(this.fetchWallets, 60000)
    this.isLoading = false
  },
  beforeDestroy() {
    clearInterval(this.intervalID)
  },
  methods: {
    async refresh(event) {
      const pullRefresh = event.object
      this.isLoading = true

      await this.fetchWallets()

      this.isLoading = false
      pullRefresh.refreshing = false
    },
    async fetchWallets() {
      const pWallets = this.addresses.map(async address => {
        if (address.coinName === XRP) {
          return fetchXRPWallet(address.publicKey)
        } else if (address.coinName === ETH) {
          return fetchETHWallet(address.publicKey)
        } else if (address.coinName === EOS) {
          return fetchEOSWallet(address.accountName)
        } else if (address.coinName === NEO) {
          return fetchNEOWallet(address.publicKey)
        }
      })

      const wallets = await Promise.all(pWallets)
      this.wallets = await fetchWalletsMarket(wallets, this.currency)
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
