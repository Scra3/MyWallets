<template>
  <FlexboxLayout class="PercentageChartView darkMode">
    <FlexboxLayout class="legend">
      <FlexboxLayout>
        <Label text="Percent Value" />
        <StackLayout class="value" />
      </FlexboxLayout>
      <FlexboxLayout>
        <Label text="Percent Investment" />
        <StackLayout class="investment" />
      </FlexboxLayout>
    </FlexboxLayout>
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
          showLabels="true"
          seriesName="palette"
          maxBarSize="100"
        />
        <BarSeries
          v-tkCartesianSeries
          :items="formattedWallets"
          categoryProperty="coin"
          valueProperty="percentageInvestment"
          showLabels="true"
          seriesName="palette"
          maxBarSize="100"
        />

        <Palette v-tkCartesianPalette seriesName="palette">
          <PaletteEntry
            v-tkCartesianPaletteEntry
            fillColor="#bb86fc"
            strokeColor="transparent"
            strokeWidth="4"
          />
          <PaletteEntry
            v-tkCartesianPaletteEntry
            fillColor="#3700b3"
            strokeColor="transparent"
            stroke-width="4"
          />
        </Palette>
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
      return this.wallets.map((wallet, index) => {
        const percentageValue =
          parseInt((wallet.value() / this.totalValue) * 100) || 0

        const percentageInvestment =
          parseInt((wallet.investment / this.totalInvestment) * 100) || 0

        return {
          percentageValue,
          percentageInvestment,
          coin: `${index + 1}. ${wallet.coin.symbol.toUpperCase()}`
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

  .legend {
    height: 40;
    width: 100%;
    justify-content: space-around;
    padding: $separation-content;

    .value,
    .investment {
      width: 20;
      border-radius: 50;
      margin-left: 10;
    }

    .investment {
      background-color: $primaryVariant;
    }

    .value {
      background-color: $primary;
    }
  }

  .chart {
    height: 90%;

    ChartSeriesLabel {
      font-weight: bold;
      font-size: $small-font-size;
      color: white;
      border-color: transparent;
      background-color: transparent;
    }
  }
}
</style>
