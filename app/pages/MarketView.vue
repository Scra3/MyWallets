<template>
  <StackLayout class="MarketView darkMode">
    <SearchBar
      ref="search-bar"
      v-model="searchQuery"
      hint="Search coin"
      class="search-bar"
    />

    <FlexboxLayout class="header">
      <Label text="#" class="index" />
      <Label text="Name" class="name" />
      <Label text="24h" class="change-percentage" />
      <Label text="Price" class="price" />
    </FlexboxLayout>
    <Label
      v-if="filteredCoins.length === 0 && isLoading === false"
      text="No coins found"
      class="no-coins-message"
      data-test="no-coins-message"
    />
    <ActivityIndicator v-if="isLoading" :busy="isLoading" class="spinner" />
    <ErrorMessage v-else-if="isFailedToLoad" data-test="error-message" />
    <PullToRefresh @refresh="refreshCoinsMarket" class="spinner">
      <ListView v-for="(coin, index) in filteredCoins">
        <v-template>
          <FlexboxLayout class="coin" data-test="coin">
            <label :text="index + 1" class="index" data-test="index" />
            <Image :src="coin.image" class="image coinIcon" data-test="image" />
            <label :text="coin.name" class="name" data-test="name" />
            <ChangeLabel
              :value="priceChange24h(coin)"
              unit="%"
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
  </StackLayout>
</template>

<script>
import { fetchCoinsMarket } from '@/Api'
import ChangeLabel from '@/components/ChangeLabel'
import PriceLabel from '@/components//PriceLabel'
import ErrorMessage from '@/components/ErrorMessage'

export default {
  name: 'MarketView',
  components: { ErrorMessage, PriceLabel, ChangeLabel },
  props: {
    currency: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      coins: [],
      isLoading: false,
      isFailedToLoad: false,
      searchQuery: ''
    }
  },
  computed: {
    filteredCoins() {
      return this.coins.filter(
        coin =>
          coin.name.toUpperCase().includes(this.searchQuery.toUpperCase()) ||
          coin.symbol.toUpperCase().includes(this.searchQuery.toUpperCase())
      )
    }
  },
  watch: {
    currency() {
      this.fetchCoinsMarket()
    }
  },
  mounted() {
    this.fetchCoinsMarket()
    this.clearSearchBarFocus()
  },
  methods: {
    priceChange24h(coin) {
      // sometimes when the user scroll very fast priceChangePercentage24H is null
      return coin.priceChangePercentage24H || 0
    },
    clearSearchBarFocus() {
      // it waits the search bar to be loaded to clear focus
      const searchBar = this.$refs['search-bar'].nativeView.android
      if (searchBar) {
        searchBar.clearFocus()
      } else {
        setTimeout(this.clearSearchBarFocus, 100)
      }
    },
    async refreshCoinsMarket(event) {
      const pullRefresh = event.object
      this.isFailedToLoad = false

      try {
        this.coins = await fetchCoinsMarket(this.currency)
      } catch (e) {
        console.log('when refresh coins market in MarketView', e)
        this.isFailedToLoad = true
      } finally {
        pullRefresh.refreshing = false
      }
    },
    async fetchCoinsMarket() {
      this.isLoading = true
      this.isFailedToLoad = false

      try {
        this.coins = await fetchCoinsMarket(this.currency)
      } catch (e) {
        console.log('when fetching coins market in MarketView', e)
        this.isFailedToLoad = true
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.MarketView {
  .search-bar {
    color: $onSurface;
    background-color: $surface;
    margin-bottom: $separation-content;
    text-field-hint-color: $onSurface;
  }

  .coin,
  .header {
    flex-direction: row;
    height: 60;
    align-items: center;
    padding: $separation-content;
  }

  .name {
    width: 35%;
    text-align: left;
    margin-left: $separation-content;
  }

  .header {
    height: 40;
    font-weight: bold;
    color: $onBackground;

    .name {
      width: 50%;
      padding-left: 20;
      text-align: left;
    }
  }

  .coin {
    border-radius: $border-radius;
    background-color: $surface;
  }

  .index {
    width: 15%;
    text-align: left;
  }

  .image {
    width: 10%;
    text-align: left;
  }

  .change-percentage {
    width: 25%;
    text-align: center;
  }

  .price {
    width: 25%;
    text-align: right;
  }

  .no-coins-message {
    font-size: $normal-font-size;
    color: $onSurface;
    text-align: center;
  }
}
</style>
