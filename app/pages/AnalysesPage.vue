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
  methods: {
    handleSelectedIndex(args) {
      const wallet_total_value_chart_index = 0
      if (args.value === wallet_total_value_chart_index) {
        orientation.enableRotation()
      } else {
        orientation.setOrientation('portrait')
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
