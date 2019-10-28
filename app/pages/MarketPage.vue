<template>
  <flexboxLayout class="markets">
    <ListView v-for="(coin, index) in coins">
      <v-template>
        <FlexboxLayout class="coin">
          <label :text="index + 1" class="index" data-test="index" />
          <Image :src="coin.image" class="image" data-test="image" />
          <label :text="coin.name" class="name" data-test="name" />
          <ChangePercentageLabel
            :value="coin.priceChangePercentage24h"
            class="change-percentage"
          />
          <label
            :text="coin.currentPrice"
            class="value"
            data-test="current-price"
          />
        </FlexboxLayout>
      </v-template>
    </ListView>
  </flexboxLayout>
</template>

<script>
import { fetchMarket } from '@/http.js'
import ChangePercentageLabel from '@/components/ChangePercentageLabel'

export default {
  name: 'MarketPage',
  components: { ChangePercentageLabel },
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

    .index {
      width: 5%;
    }

    .image {
      width: 15%;
    }

    .name {
      width: 30%;
      text-align: left;
    }

    .change-percentage,
    .value {
      width: 25%;
      text-align: right;
    }
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
