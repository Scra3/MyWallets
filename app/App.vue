<template>
  <Page class="app">
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
      @selectedIndexChange="args => selectIndex(args.value)"
      android:androidTabsPosition="bottom"
      class="tab-view"
    >
      <TabViewItem title="Wallets" data-test="wallets-tab">
        <WalletsView :currency="selectedCurrency" />
      </TabViewItem>
      <TabViewItem title="Market" data-test="market-tab">
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
    selectIndex(index) {
      this.selectedIndex = index
    }
  }
}
</script>

<style lang="scss">
@import 'styles';
.app {
  background-color: $dark-grey;
  color: $white;

  .action-bar {
    background-color: $dark-grey;
    color: $white;

    .currency {
      size: 24;
      color: $blue;
    }
  }

  .tab-view {
    selected-tab-text-color: $blue;
    tab-background-color: $dark-grey;
    tab-text-color: $white;
  }
}
</style>
