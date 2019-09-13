<template>
  <Page>
    <ActionBar :flat="true" class="action-bar">
      <StackLayout orientation="horizontal">
        <Label text="My Wallets" class="title" />
      </StackLayout>
    </ActionBar>

    <FlexboxLayout class="HomePage">
      <FlexboxLayout class="wallets-value">
        <Label :visibility="canDisplayWalletsValue" :text="walletsValue" />
        <Label :visibility="isThereError" :text="message" class="message"/>

        <ActivityIndicator :busy="isLoading" />
      </FlexboxLayout>

      <FlexboxLayout class="wallets">
        <ListView for="portfolio in wallets">
          <v-template>
            <FlexboxLayout class="wallet">
              <Label :text="portfolio.currency" class="currency" />
              <Label :text="portfolio.balance" />
              <Label :text="portfolio.value" class="value" />
            </FlexboxLayout>
          </v-template>
        </ListView>
      </FlexboxLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import { fetchXRPWallet, fetchETHWallet } from "@/http.js";
import { ETH, XRP, EOS } from "@/constants.js";

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
        { currency: XRP, public_key: "rs7YB1m6EQfNRCmm5VbqFW3GDvA9SoFTAR" }
      ],
      intervalID: null,
      isLoading: true,
      errored: false,
      message: "Cannot synchronize wallets"
    };
  },
  computed: {
    canDisplayWalletsValue() {
      return this.isLoading || this.errored ? "collapse" : "visible";
    },
    isThereError() {
      return this.errored ? "visible" : "collapse";
    },
    walletsValue() {
      if (this.wallets.length > 0) {
        const sum = (currentValue, wallet) => currentValue + parseFloat(wallet.value);
        return parseFloat(this.wallets.reduce(sum, 0.0));
      }

      return 0;
    }
  },
  mounted() {
    // Loader must be display only for the first request
    this.isLoading = true;
    this.fetchWallets();
    this.intervalID = setInterval(this.fetchWallets, 60000);
  },
  beforeDestroy() {
    clearInterval(this.intervalID);
  },
  methods: {
    async fetchWallets() {
      this.wallets = [];
      try {
        const pWallets = this.addresses.map(async address => {
          if (address.currency === XRP) {
            return fetchXRPWallet(address.public_key);
          } else if (address.currency === ETH) {
            return fetchETHWallet(address.public_key);
          }
          throw "Address is undefined";
        });

        this.wallets = await Promise.all(pWallets);
      } catch (error) {
        this.message = error;
        this.errored = true;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style lang="scss">
.action-bar {
  background-color: #222831;

  .title {
    color: #00adb5;
    font-size: 24;
    vertical-align: center;
  }
}

.HomePage {
  background-color: #222831;
  flex-direction: column;
  color: #eee;
  align-items: flex-start;

  .actions {
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 10;
  }

  .wallets-value {
    color: #eee;
    font-size: 30;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    font-weight: bold;

    .message {
      font-size: 20;
    }
  }

  .wallets {
    height: 200;
    flex-direction: column;
    background-color: #222831;

    .wallet {
      border-radius: 5;
      padding: 10;
      background-color: #393e46;
      justify-content: space-between;
      align-items: center;

      .currency {
        font-size: 20;
      }

      .value {
        font-weight: bold;
      }
    }
  }
}
</style>
