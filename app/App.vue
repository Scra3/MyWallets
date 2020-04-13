<template>
  <Page class="App darkMode">
    <ActionBar title="My Wallets" class="action-bar">
      <StackLayout
        orientation="horizontal"
        android:horizontalAlignment="left"
        android:verticalAlignment="center"
        class="action-title"
      >
        <Label text="My" />
        <Label text="W" class="label-w-letter" />
        <Label text="allets" />
      </StackLayout>

      <ActionItem
        @tap="toggleCurrency"
        :text="selectedCurrency.acronym"
        class="currency"
        android.position="right"
        data-test="action-item-currency"
      />
    </ActionBar>

    <BottomNavigation
      :selectedIndex="selectedIndex"
      @selectedIndexChange="selectIndex"
    >
      <TabStrip>
        <TabStripItem class="tab-strip-item">
          <Label text="Wallets" />
        </TabStripItem>
        <TabStripItem class="tab-strip-item">
          <Label text="Market" />
        </TabStripItem>
        <TabStripItem class="tab-strip-item">
          <Label text="Alerts" />
        </TabStripItem>
      </TabStrip>

      <TabContentItem>
        <WalletsView :currency="selectedCurrency" />
      </TabContentItem>
      <TabContentItem>
        <MarketView :currency="selectedCurrency" />
      </TabContentItem>
      <TabContentItem>
        <AlertsView :currency="selectedCurrency" />
      </TabContentItem>
    </BottomNavigation>
  </Page>
</template>

<script>
import WalletsView from '@/pages/WalletsView'
import MarketView from '@/pages/MarketView'
import AlertsView from '@/pages/AlertsView'
import { USD, EUR } from '@/constants'
import { mapActions, mapState } from 'vuex'
import { CONTINUOUS_SERVICE_CLASSNAME } from '@/constants'
import * as application from 'tns-core-modules/application'

export default {
  name: 'App',
  components: { WalletsView, MarketView, AlertsView },
  props: {
    defaultSelectedViewIndex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      selectedIndex: null
    }
  },
  computed: {
    ...mapState('appManager', ['app']),

    selectedCurrency() {
      if (!this.app) {
        return USD
      }
      return this.app.currency === USD.acronym ? USD : EUR
    }
  },
  beforeMount() {
    this.selectedIndex = this.defaultSelectedViewIndex
  },
  mounted() {
    this.loadAppState()
    this.startContinuousService()
  },
  methods: {
    ...mapActions('appManager', ['select', 'update', 'insert']),
    startContinuousService() {
      const context = application.android.context
      /* eslint-disable */
      const intent = new android.content.Intent()
      /* eslint-enable */
      intent.setClassName(context, CONTINUOUS_SERVICE_CLASSNAME)
      context.startService(intent)
    },
    async loadAppState() {
      try {
        await this.select()
      } catch (e) {
        console.log('when loading store states in App', e)
      }
    },
    displayConfirmCurrency(selectedCurrency) {
      return confirm({
        title: `Change currency to ${selectedCurrency.acronym.toUpperCase()}`,
        message:
          'Be careful, for the moment the currency is global to the app, it will also change the alert currencies.',
        okButtonText: `Change to ${selectedCurrency.acronym}`,
        cancelButtonText: 'Cancel'
      })
    },
    async toggleCurrency() {
      const selectedCurrency = this.selectedCurrency === USD ? EUR : USD
      if (!(await this.displayConfirmCurrency(selectedCurrency))) {
        return
      }

      if (this.app) {
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

<style lang="scss" scoped>
.App {
  .action-bar {
    font-size: $large-font-size;
    background-color: $background;
    color: $onBackground;

    .action-title {
      font-size: 18;

      .label-w-letter {
        font-weight: bold;
        color: $secondary;
      }
    }

    .currency {
      size: 24;
      color: $primary;
    }
  }

  .tab-strip-item {
    color: $onBackground;
    font-size: $normal-font-size;
    background-color: $background;
    text-transform: uppercase;

    &:active {
      color: $primary;
    }
  }
}
</style>
