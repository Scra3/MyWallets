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
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  components: { WalletsView, MarketView },
  data() {
    return {
      selectedIndex: 0
    }
  },
  computed: {
    ...mapState('appDb', ['app']),

    selectedCurrency() {
      if (!this.app) {
        return USD
      }

      return this.app.currency === USD.acronym ? USD : EUR
    }
  },
  mounted() {
    this.loadAppState()
  },
  methods: {
    ...mapActions('appDb', ['select', 'update', 'insert']),
    async loadAppState() {
      try {
        await this.select()
      } catch (e) {
        console.log('when loading store states in App', e)
      }
    },
    toggleCurrency() {
      const selectedCurrency = this.selectedCurrency === USD ? EUR : USD

      if (this.app) {
        console.log(selectedCurrency.acronym)
        this.update({ ...this.app, currency: selectedCurrency.acronym })
      } else {
        this.insert({ id: null, currency: selectedCurrency.acronym })
      }
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
