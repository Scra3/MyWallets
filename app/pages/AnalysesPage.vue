<template>
  <Page class="AnalysesPage darkMode">
    <ActionBar title="Analyses" class="action-bar">
      <NavigationButton
        @tap="navigateBack"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="back-button"
      />
    </ActionBar>

    <Tabs @selectedIndexChange="handleSelectedIndex" selected-index="1">
      <TabStrip>
        <TabStripItem>
          <Label text="Sum Wallet Profits" />
        </TabStripItem>
        <TabStripItem>
          <Label text="Wallet Profits" />
        </TabStripItem>
        <TabStripItem>
          <Label text="Investment/Value" />
        </TabStripItem>
      </TabStrip>

      <TabContentItem>
        <WalletProfitsChartView :wallets="wallets" :currency="currency" />
      </TabContentItem>
      <TabContentItem>
        <CoinProfitsChartView :wallets="wallets" :currency="currency" />
      </TabContentItem>
      <TabContentItem>
        <PercentageChartView :wallets="wallets" />
      </TabContentItem>
    </Tabs>
  </Page>
</template>

<script>
import PercentageChartView from '@/pages/PercentageChartView'
import CoinProfitsChartView from '@/pages/CoinProfitsChartView'
import WalletProfitsChartView from '@/pages/WalletProfitsChartView'
import orientation from 'nativescript-orientation'
import * as firebase from 'nativescript-plugin-firebase'

export default {
  name: 'AnalysesPage',
  components: {
    PercentageChartView,
    CoinProfitsChartView,
    WalletProfitsChartView
  },
  props: {
    wallets: {
      type: Array,
      required: true
    },
    currency: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedIndex: null
    }
  },
  mounted() {
    firebase.analytics.setScreenName({
      screenName: 'analyses_page'
    })
  },
  methods: {
    handleSelectedIndex(args) {
      const investment_value_chart = 2
      if (args.value === investment_value_chart) {
        orientation.setOrientation('portrait')
      } else {
        orientation.enableRotation()
      }
    },
    navigateBack() {
      orientation.setOrientation('portrait')
      this.$navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.AnalysesPage {
  .action-bar {
    font-size: $large-font-size;
    background-color: $background;
    color: $onBackground;
  }

  TabStripitem {
    color: $onBackground;
    font-size: $normal-font-size;
    background-color: $background;
    text-transform: uppercase;

    &:active {
      color: $primary;
    }
  }

  Tabs TabStrip {
    highlight-color: $primary;
  }
}
</style>
