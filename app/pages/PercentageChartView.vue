<template>
  <FlexboxLayout class="PercentageChartView darkMode">
    <label text="Wallet Value/Investment % Grouped By Coin" class="title" />
    <StackLayout class="chart">
      <RadCartesianChart>
        <CategoricalAxis v-tkCartesianVerticalAxis />
        <LinearAxis
          v-tkCartesianHorizontalAxis
          :labelFormat="xAxeFormatWithoutDecimal"
        />
        <BarSeries
          v-tkCartesianSeries
          :items="formattedWallets"
          categoryProperty="coin"
          valueProperty="percentageValue"
          legendTitle="Wallet Value %"
        />
        <BarSeries
          v-tkCartesianSeries
          :items="formattedWallets"
          categoryProperty="coin"
          valueProperty="percentageInvestment"
          legendTitle="Wallet Investment %"
        />
        <RadLegendView v-tkPieLegend position="Top" />
      </RadCartesianChart>
    </StackLayout>
  </FlexboxLayout>
</template>

<script>
import { WalletMixin } from '@/mixins/WalletMixin'

export default {
  name: 'PercentageChartView',
  mixins: [WalletMixin],
  props: {
    wallets: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      xAxeFormatWithoutDecimal: '%.0f'
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
        const percentageValue =
          parseInt((wallet.value() / this.totalValue) * 100) || 0

        const percentageInvestment =
          parseInt((wallet.investment / this.totalInvestment) * 100) || 0

        return {
          percentageValue,
          percentageInvestment,
          coin: `${wallet.coin.symbol.toUpperCase()} (${percentageInvestment}%, ${percentageValue}%)`
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.PercentageChartView {
  width: 100%;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: $normal-font-size;
    font-weight: bold;
    flex-grow: 1;
    color: $onBackground;
    margin-top: $separation-content;
  }

  .chart {
    height: 90%;
  }
}
</style>