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
    tab-background-color: $grey;
    tab-text-color: $white;
    tab-text-font-size: $normal-font-size;
  }
}
</style>
