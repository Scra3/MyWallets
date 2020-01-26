<template>
  <Page class="App">
    <ActionBar title="My Wallets" class="action-bar">
      <ActionItem
        @tap="toggleCurrency"
        :text="selectedCurrency.acronym"
        class="currency"
        android.position="right"
        data-test="action-item-currency"
      />
    </ActionBar>

    <TabView
      :selectedIndex="selectedIndex"
      @selectedIndexChange="selectIndex"
      android:androidTabsPosition="bottom"
      class="tab-view"
    >
      <TabViewItem title="Wallets">
        <WalletsView :currency="selectedCurrency" />
      </TabViewItem>

      <TabViewItem title="Market">
        <MarketView :currency="selectedCurrency" />
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import WalletsView from '@/pages/WalletsView'
import MarketView from '@/pages/MarketView'
import { USD, EUR } from '@/constants.js'

export default {
  name: 'App',
  components: { WalletsView, MarketView },
  data() {
    return {
      selectedCurrency: EUR,
      selectedIndex: 0
    }
  },
  methods: {
    toggleCurrency() {
      this.selectedCurrency = this.selectedCurrency === USD ? EUR : USD
    },
    selectIndex(args) {
      this.selectedIndex = args.value
    }
  }
}
</script>

<style lang="scss">
.App {
  background-color: $background;
  color: $onBackground;

  .action-bar {
    background-color: $background;
    color: $onBackground;

    .currency {
      size: 24;
      color: $primary;
    }
  }

  .tab-view {
    font-size: $normal-font-size;
    selected-tab-text-color: $primary;
    tab-background-color: $background;
    tab-text-color: $onBackground;
    tab-text-font-size: $normal-font-size;
  }
}
</style>
