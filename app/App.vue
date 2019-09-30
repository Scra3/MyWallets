<template>
  <Page class="app">
    <ActionBar title="My Wallets" class="action-bar">
      <ActionItem
        @tap="toggleCurrency"
        :text="selectedCurrency"
        class="currency"
        android.position="right"
      />
    </ActionBar>

    <TabView
      :selectedIndex="selectedIndex"
      @selectedIndexChange="indexChange"
      androidTabsPosition="bottom"
      class="tab-view"
    >
      <TabViewItem title="Wallets">
        <WalletsPage :currency="selectedCurrency" />
      </TabViewItem>
      <TabViewItem title="Market">
        <MarketPage :currency="selectedCurrency" />
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import WalletsPage from "@/pages/WalletsPage";
import MarketPage from "@/pages/MarketPage";
import { USD, EUR } from "@/constants.js";

export default {
  name: "App",
  components: { WalletsPage, MarketPage },
  data() {
    return {
      selectedCurrency: USD,
      selectedIndex: 0
    };
  },
  methods: {
    toggleCurrency() {
      this.selectedCurrency = this.selectedCurrency === USD ? EUR : USD;
    },
    indexChange: function(args) {
      this.selectedIndex = args.value;
    }
  }
};
</script>

<style lang="scss">
@import "styles";
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
    selected-tab-text-color: #00adb5;
    tab-background-color: $grey;
    tab-text-color: $white;
  }
}
</style>
