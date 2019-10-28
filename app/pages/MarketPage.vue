<template>
  <flexboxLayout class="markets">
    <ListView v-for="coin in coins">
      <v-template>
        <FlexboxLayout class="coin">
          <Image :src="coin.image" class="image" data-test="image" />
          <label :text="coin.name" data-test="name" />
          <label
            :text="coin.priceChangePercentage24h"
            data-test="change-percentage"
          />
          <label :text="coin.currentPrice" data-test="current-price" />
        </FlexboxLayout>
      </v-template>
    </ListView>
  </flexboxLayout>
</template>

<script>
import { fetchMarket } from '@/http.js'
export default {
  name: 'MarketPage',
  props: {
    currency: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      coins: null
    }
  },
  watch: {
    currency() {
      this.fetchMarket()
    }
  },
  mounted() {
    this.fetchMarket()
  },
  methods: {
    async fetchMarket() {
      this.coins = await fetchMarket(this.currency)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles.scss';

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

.image {
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
