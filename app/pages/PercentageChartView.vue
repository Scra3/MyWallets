<template>
  <FlexboxLayout class="PercentageChartView darkMode">
    <StackLayout>
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
          showLabels="true"
        />
        <BarSeries
          v-tkCartesianSeries
          :items="formattedWallets"
          categoryProperty="coin"
          valueProperty="percentageInvestment"
          legendTitle="Wallet Investment %"
          showLabels="true"
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
          coin: wallet.coin.symbol.toUpperCase()
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
}
</style>
