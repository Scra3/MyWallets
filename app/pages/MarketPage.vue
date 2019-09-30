<template>
  <flexboxLayout class="markets">
    <ListView for="coin in coins">
      <v-template>
        <FlexboxLayout class="coin">
          <Image :src="coin.image" class="logo" />
          <label :text="coin.name" />
          <label :text="coin.priceChangePercentage24h" />
          <label :text="coin.currentPrice" />
        </FlexboxLayout>
      </v-template>
    </ListView>
  </flexboxLayout>
</template>

<script>
import { fetchMarket } from "@/http.js";
export default {
  name: "MarketPage",
  props: {
    currency: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      coins: []
    };
  },
  watch: {
    currency() {
      this.fetchMarket();
    }
  },
  mounted() {
    this.fetchMarket();
  },
  methods: {
    async fetchMarket() {
      this.coins = await fetchMarket(this.currency);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles.scss";

.markets {
  flex-direction: column;
  flex-grow: 1;

  .coin {
    justify-content: space-between;
    flex-direction: row;
    height: 60;
    align-items: center;
    padding: 10;
  }
}

.logo {
  height: 20;
  width: 20;
}

.positive-change {
  color: $success-color;
}

.negative-change {
  color: $error-color;
}
</style>
