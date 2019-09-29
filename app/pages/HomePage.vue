<template>
  <StackLayout class="HomePage">
    <ActivityIndicator
      v-if="isLoading"
      :busy="isLoading"
      class="activity-indicator"
    />
    <FlexboxLayout v-else class="wallets-overview">
      <template>
        <Label :text="`${currencySymbol}${walletsValue}`" />
        <Label
          :text="`${walletsPriceChange24}${currencySymbol}`"
          :class="[
            walletsPriceChange24[0] === '-'
              ? 'negative-change'
              : 'positive-change'
          ]"
        />
      </template>
    </FlexboxLayout>

    <StackLayout class="wallets">
      <PullToRefresh @refresh="refresh" color="#43ab92">
        <ListView for="wallet in sortedWallets">
          <v-template>
            <FlexboxLayout class="wallet">
              <FlexboxLayout class="title">
                <Image :src="logoPath(wallet)" class="logo" />
                <Label :text="wallet.coin" class="coin" />
              </FlexboxLayout>
              <template v-if="wallet.errored">
                <Label text="Error" class="error" />
              </template>
              <template v-else>
                <Label :text="`${wallet.balance} ${wallet.coin}`" />
                <FlexboxLayout class="current-price">
                  <Label :text="`${currencySymbol}${wallet.currentPrice}`" />
                  <Label
                    :text="`${wallet.priceChangePercentage24h}%`"
                    :class="[
                      wallet.priceChangePercentage24h[0] === '-'
                        ? 'negative-change'
                        : 'positive-change'
                    ]"
                  />
                </FlexboxLayout>
                <Label
                  :text="`${currencySymbol}${wallet.value()}`"
                  class="value"
                />
              </template>
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
} from "@/http.js";

import { ETH, XRP, EOS, NEO } from "@/constants.js";

export default {
  name: "HomePage",
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
          currency: ETH,
          public_key: "0x70Fe19189628d1050cb0e14aa7A1BBc246A48183"
        },
        { currency: XRP, public_key: "rs7YB1m6EQfNRCmm5VbqFW3GDvA9SoFTAR" },
        { currency: EOS, account_name: "gi3tmnzsgqge" },
        { currency: NEO, public_key: "ASfa8eQHaG2ZXt9VZaYA9SkkcCpbi3cacf" }
      ],
      intervalID: null,
      isLoading: true,
      errored: false,
      message: null
    };
  },
  computed: {
    currencySymbol() {
      return this.currency === "usd" ? "$" : "€";
    },
    sortedWallets() {
      const wallets = this.wallets;
      const sortWallets = (walletA, walletB) =>
        walletB.value() - walletA.value();
      return wallets.sort(sortWallets);
    },
    walletsValue() {
      if (this.wallets.length === 0) {
        return 0;
      }
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.value());
      return parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2);
    },
    walletsPriceChange24() {
      if (this.wallets.length === 0) {
        return 0;
      }
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.priceChange24);
      return parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2);
    }
  },
  watch: {
    async currency() {
      this.isLoading = true;
      await this.fetchWallets();
      this.isLoading = false;
    }
  },
  async mounted() {
    // Loader must be display only for the first request
    this.isLoading = true;
    await this.fetchWallets();
    this.intervalID = setInterval(this.fetchWallets, 60000);
    this.isLoading = false;
  },
  beforeDestroy() {
    clearInterval(this.intervalID);
  },
  methods: {
    logoPath(wallet) {
      return `~/assets/images/${wallet.coin}.png`;
    },
    async refresh(event) {
      const pullRefresh = event.object;
      this.isLoading = true;

      await this.fetchWallets();

      this.isLoading = false;
      pullRefresh.refreshing = false;
    },
    async fetchWallets() {
      const pWallets = this.addresses.map(async address => {
        if (address.currency === XRP) {
          return fetchXRPWallet(address.public_key, this.currency);
        } else if (address.currency === ETH) {
          return fetchETHWallet(address.public_key, this.currency);
        } else if (address.currency === EOS) {
          return fetchEOSWallet(address.account_name, this.currency);
        } else if (address.currency === NEO) {
          return fetchNEOWallet(address.public_key, this.currency);
        }
      });

      const wallets = await Promise.all(pWallets);
      this.wallets = await fetchWalletsMarket(wallets, this.currency);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles.scss";

.HomePage {
  background-color: $dark-grey;
  color: $white;

  .activity-indicator {
    height: 60;
    margin: 10;
  }

  .wallets-overview {
    justify-content: space-between;
    align-items: center;
    margin: 10;
    border-radius: 10;
    height: 60;
    font-size: 25;
    font-weight: bold;
    width: 100%;
  }

  .wallets {
    .wallet {
      height: 60;
      padding: 10;
      justify-content: space-between;
      align-items: center;
      background-image: linear-gradient(
        to right,
        #393e46,
        #333841,
        #2d333b,
        #282d36,
        #222831
      );

      .title {
        justify-content: center;
        align-items: center;

        .coin {
          font-size: 15;
          margin-left: 20;
        }

        .logo {
          height: 20;
          width: 20;
        }
      }

      .current-price {
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .value {
        font-weight: bold;
      }

      .error {
        color: $error-color;
      }
    }

    .message {
      text-align: center;
      width: 100%;
      font-weight: bold;
    }
  }

  .positive-change {
    color: $success-color;
  }

  .negative-change {
    color: $error-color;
  }
}
</style>
