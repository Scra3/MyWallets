<template>
  <flexboxLayout class="markets">
    <ActivityIndicator v-if="isLoading" :busy="isLoading" />

    <PullToRefresh v-else @refresh="refresh">
      <ListView v-for="(coin, index) in coins">
        <v-template>
          <FlexboxLayout class="coin" data-test="coin">
            <label :text="index + 1" class="index" data-test="index" />
            <Image :src="coin.image" class="image" data-test="image" />
            <label :text="coin.name" class="name" data-test="name" />
            <ChangePercentageLabel
              :value="coin.priceChangePercentage24h"
              class="change-percentage"
            />
            <PriceLabel
              :value="coin.currentPrice"
              :currency="currency"
              class="price"
            />
          </FlexboxLayout>
        </v-template>
      </ListView>
    </PullToRefresh>
  </flexboxLayout>
</template>

<script>
import { fetchMarket } from '@/Api'
import ChangePercentageLabel from '@/components/ChangePercentageLabel'
import PriceLabel from '@/components//PriceLabel'

export default {
  name: 'MarketPage',
  components: { PriceLabel, ChangePercentageLabel },
  props: {
    currency: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      coins: null,
      isLoading: true
    }
  },
  watch: {
    currency() {
      this.fetchCoinsMarket()
    }
  },
  mounted() {
    this.fetchCoinsMarket()
  },
  methods: {
    async refresh(event) {
      const pullRefresh = event.object
      this.coins = await fetchMarket(this.currency)
      pullRefresh.refreshing = false
    },
    async fetchCoinsMarket() {
      this.isLoading = true
      try {
        this.coins = await fetchMarket(this.currency)
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
      text-align: left;
    }

    .image {
      height: 25;
      width: 15%;
      text-align: left;
    }

    .name {
      width: 30%;
      text-align: left;
    }

    .change-percentage {
      width: 25%;
    }

    .price {
      width: 25%;
    }
  }
}
</style>
