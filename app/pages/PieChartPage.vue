<template>
  <Page class="PieChartPage darkMode">
    <ActionBar title="Analyses" class="action-bar">
      <NavigationButton
        @tap="$navigateBack"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="back-button"
      />
    </ActionBar>

    <FlexboxLayout class="chart-container">
      <label text="Percentage Analysis Grouped By Coin" class="title" />
      <StackLayout class="chart">
        <RadCartesianChart>
          <CategoricalAxis v-tkCartesianVerticalAxis />
          <LinearAxis v-tkCartesianHorizontalAxis />
          <BarSeries
            v-tkCartesianSeries
            :items="formattedWallets"
            categoryProperty="Brand"
            valueProperty="percentageValue"
            legendTitle="Wallet Value Percentage"
          />
          <BarSeries
            v-tkCartesianSeries
            :items="formattedWallets"
            categoryProperty="Brand"
            valueProperty="percentageInvestment"
            legendTitle="Wallet Investment Percentage"
          />
          <RadLegendView v-tkPieLegend position="Top" />
        </RadCartesianChart>
      </StackLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import { WalletMixin } from '@/mixins/WalletMixin'

export default {
  name: 'PieChartPage',
  mixins: [WalletMixin],
  props: {
    wallets: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalInvestment() {
      return this.$_totalInvestment(this.wallets)
    },
    totalValue() {
      return this.$_totalValue(this.wallets)
    },
    formattedWallets() {
      return this.wallets.map(wallet => {
        const percentageValue = parseInt(
          (wallet.value() / this.totalValue) * 100
        )

        const percentageInvestment = parseInt(
          (wallet.investment / this.totalInvestment) * 100
        )

        return {
          percentageValue,
          percentageInvestment,
          Brand: wallet.coin.name
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.PieChartPage {
  .action-bar {
    background-color: $background;
    color: $onBackground;
  }

  .chart-container {
    width: 100%;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: $normal-font-size;
      font-weight: bold;
      flex-grow: 1;
      color: $onBackground;
    }

    .chart {
      height: 90%;
    }
  }
}
</style>
