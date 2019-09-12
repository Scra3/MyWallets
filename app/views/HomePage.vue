<template>
  <Page>
    <ActionBar class="action-bar" :flat="true">
      <StackLayout orientation="horizontal">
        <Label text="My Wallets" class="title" />
      </StackLayout>
    </ActionBar>

    <FlexboxLayout class="HomePage">
      <FlexboxLayout class="wallets-value">
        <Label :visibility="displayIfIsLoaded" :text="walletsValue" />
        <Label :visibility="displayIfError" text="Cannot synchronize wallets" />

        <ActivityIndicator :busy="isLoading" />
      </FlexboxLayout>

      <FlexboxLayout class="wallets">
        <ListView for="portfolio in wallets">
          <v-template>
            <FlexboxLayout class="wallet">
              <Label class="currency" :text="portfolio.currency" />
              <Label :text="portfolio.balance" />
              <Label class="value" :text="portfolio.value" />
            </FlexboxLayout>
          </v-template>
        </ListView>
      </FlexboxLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import { fetchXRPWallet, fetchXRPPrice } from "../http.js";

export default {
  name: "HomePage",
  data() {
    return {
      wallets: [],
      addresses: [
        { currency: "XRP", address: "rs7YB1m6EQfNRCmm5VbqFW3GDvA9SoFTAR" },
      ],
      intervalID: null,
      isLoading: true,
      error: false
    };
  },
  computed: {
    displayIfIsLoaded() {
      return this.isLoading ? "collapse" : "visible";
    },
    displayIfError() {
      return this.error ? "visible" : "collapse";
    },
    walletsValue() {
      if (this.wallets.length > 0) {
        const reducer = (total, portfolioB) => total + portfolioB.value;
        return parseFloat(this.wallets.reduce(reducer, 0.0));
      }

      return null;
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
        const pwallets = this.addresses.map(async address => {
          if (address.currency === "XRP") {
            return await fetchXRPWallet(this.addresses[0].address);
          }
        });

        const wallets = await Promise.all(pwallets);
        for (const wallet of wallets) {
          if (wallet.balance_changes[0].currency === "XRP") {
            const balance = parseFloat(wallet.balance_changes[0].final_balance);
            const price = await fetchXRPPrice();

            this.wallets.push({
              currency: "XRP",
              balance: balance,
              value: (price.ripple.eur * balance).toFixed(2)
            });
          }
        }
      } catch (e) {
        this.error = true;
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
