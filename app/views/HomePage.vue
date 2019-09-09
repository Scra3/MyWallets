<template>
  <Page>
    <FlexboxLayout class="container">
      <FlexboxLayout class="wallets-amount">
        <Label :visibility="displayIfIsLoaded" :text="walletsAmount" />
        <Label :visibility="displayIfError" text="Cannot synchronize wallets" />
        <ActivityIndicator :busy="isLoading" />
      </FlexboxLayout>

      <FlexboxLayout class="actions">
        <Button :visibility="displayIfIsLoaded" class="refresh-button" text="Refresh" @tap="fetchWallets" />
      </FlexboxLayout>

      <FlexboxLayout class="wallets">
        <ListView for="portfolio in wallets">
          <v-template>
            <FlexboxLayout class="wallet">
              <Label :text="portfolio.currency" />
              <Label :text="portfolio.balance" />
              <Label :text="portfolio.amount" />
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
        { currency: "XRP", address: "rs7YB1m6EQfNRCmm5VbqFW3GDvA9SoFTAR" }
      ],
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
    walletsAmount() {
      if (this.wallets.length > 0) {
        const reducer = (total, portfolioB) => total + portfolioB.amount;
        return this.wallets.reduce(reducer, 0);
      }

      return null;
    }
  },
  mounted() {
    this.fetchWallets();
  },
  methods: {
    async fetchWallets() {
      this.wallets = []
      this.isLoading = true;
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
              amount: price.ripple.eur * balance
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

<style lang="scss" scoped>
.container {
  background-color: #222831;
  flex-direction: column;
  color: #eee;
  align-items: flex-start;

  .actions {
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 10;

    .refresh-button {
      color: #00adb5;
      background-color: #393e46;
      border-radius: 10;
      font-size: 16;
    }
  }

  .wallets-amount {
    color: #00adb5;
    font-size: 30;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .wallets {
    height: 200;
    flex-direction: column;
    background-color: #222831;

    .wallet {
      padding: 10;
      background-color: #393e46;
      justify-content: space-between;
    }
  }
}
</style>
