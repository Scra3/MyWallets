<template>
  <PullToRefresh @refresh="refresh">
    <FlexboxLayout class="HomePage">
      <FlexboxLayout class="wallets-value">
        <ActivityIndicator v-if="isLoading" :busy="isLoading" />
        <template v-else>
          <Label :text="walletsValue" />
        </template>
      </FlexboxLayout>

      <FlexboxLayout class="button-container">
        <Button text="+" class="add-button" />
      </FlexboxLayout>

      <FlexboxLayout class="wallets">
        <ListView for="wallet in sortedWallets">
          <v-template>
            <FlexboxLayout class="wallet">
              <FlexboxLayout class="title">
                <Image :src="logoPath(wallet)" class="logo" />
                <Label :text="wallet.currency" class="currency" />
              </FlexboxLayout>
              <template v-if="wallet.errored">
                <Label text="Error" class="error" />
              </template>
              <template v-else>
                <Label :text="`${wallet.balance} ${wallet.currency}`" />
                <Label :text="`$${wallet.price}`" />
                <Label :text="`$${wallet.value()}`" class="value" />
              </template>
            </FlexboxLayout>
          </v-template>
        </ListView>

        <Label
          v-if="wallets.length === 0 && isLoading"
          text="No wallet added"
          class="message"
        />
      </FlexboxLayout>
    </FlexboxLayout>
  </PullToRefresh>
</template>

<script>
import {
  fetchXRPWallet,
  fetchETHWallet,
  fetchEOSWallet,
  fetchNEOWallet
} from "@/http.js";

import { ETH, XRP, EOS, NEO } from "@/constants.js";

export default {
  name: "HomePage",
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
    sortedWallets() {
      const wallets = this.wallets;
      const sortWallets = (walletA, walletB) =>
        walletB.value() - walletA.value();
      return wallets.sort(sortWallets);
    },
    walletsValue() {
      if (this.wallets.length > 0) {
        const sum = (currentValue, wallet) =>
          currentValue + parseFloat(wallet.value());
        return `$${parseFloat(this.wallets.reduce(sum, 0.0)).toFixed(2)}`;
      }

      return 0;
    }
  },
  mounted() {
    // Loader must be display only for the first request
    this.isLoading = true;
    this.fetchWallets();
    this.intervalID = setInterval(this.fetchWallets, 60000);
    this.isLoading = false;
  },
  beforeDestroy() {
    clearInterval(this.intervalID);
  },
  methods: {
    logoPath(wallet) {
      return `~/assets/images/${wallet.currency}.png`;
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
          return fetchXRPWallet(address.public_key);
        } else if (address.currency === ETH) {
          return fetchETHWallet(address.public_key);
        } else if (address.currency === EOS) {
          return fetchEOSWallet(address.account_name);
        } else if (address.currency === NEO) {
          return fetchNEOWallet(address.public_key);
        }
      });

      this.wallets = await Promise.all(pWallets);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles.scss";

.HomePage {
  background-color: $dark-grey;
  flex-direction: column;
  color: $white;
  align-items: flex-start;

  .button-container {
    width: 100%;
    justify-content: flex-end;

    .add-button {
      border-radius: 100;
      width: 60;
      height: 60;
      font-size: 30;
      background-color: $grey;
      color: $dark-grey;
      margin-bottom: 20;
      margin-right: 20;
    }

    .add-button:active {
      color: $blue;
    }
  }

  .wallets-value {
    color: $white;
    font-size: 30;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    font-weight: bold;
    flex-direction: column;

    .refresh-button {
      width: 35;
      height: 35;
      margin-left: 40;
    }
  }

  .wallets {
    height: 200;
    flex-direction: column;

    .wallet {
      padding: 10;
      background-color: $grey;
      justify-content: space-between;
      align-items: center;

      .title {
        justify-content: center;
        align-items: center;

        .currency {
          font-size: 15;
          color: $blue;
          margin-left: 20;
        }

        .logo {
          height: 20;
          width: 20;
        }
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
}
</style>
