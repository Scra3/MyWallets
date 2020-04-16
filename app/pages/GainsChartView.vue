<template>
  <FlexboxLayout class="PercentageChartView darkMode">
    <label text="Coin Profits" class="title" />
    <StackLayout class="chart">
      <RadCartesianChart>
        <CategoricalAxis v-tkCartesianHorizontalAxis />
        <LinearAxis
          v-tkCartesianVerticalAxis
          :labelFormat="xAxeFormatWithoutDecimal"
        />
        <BarSeries
          v-tkCartesianSeries
          :items="formattedWallets"
          categoryProperty="coin"
          valueProperty="profit"
          legendTitle="Wallet Profit"
          paletteMode="Item"
          showLabels="true"
        />
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
    },
    currency: {
      type: Object,
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
        const profit = parseInt(wallet.value() - wallet.investment)

        return {
          profit,
          coin: wallet.coin.symbol.toUpperCase()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
BarSeries {
  fill-color: #c8a1ff;
  stroke-color: white;
  stroke-width: 4;
}

.PercentageChartView {
  width: 100%;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: $large-font-size;
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
