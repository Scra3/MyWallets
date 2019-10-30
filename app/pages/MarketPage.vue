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
            <label
              :text="coin.currentPrice"
              class="value"
              data-test="current-price"
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
