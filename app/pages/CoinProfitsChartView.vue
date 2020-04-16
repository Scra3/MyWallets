<template>
  <FlexboxLayout class="CoinProfitsChartView darkMode">
    <StackLayout>
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
  name: 'CoinProfitsChartView',
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
.CoinProfitsChartView {
  width: 100%;
  flex-direction: column;
  align-items: center;
}
</style>
