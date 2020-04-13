<template>
  <Page class="PieChartPage darkMode">
    <ActionBar title="Analysis view" class="action-bar">
      <NavigationButton
        @tap="$navigateBack"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="back-button"
      />
    </ActionBar>

    <FlexboxLayout class="legend">
      <RadPieChart allowAnimation="true" row="0">
        <PieSeries
          v-tkPieSeries
          :items="formattedWallets"
          selectionMode="DataPoint"
          expandRadius="0.4"
          outerRadiusFactor="0.7"
          valueProperty="Amount"
          legendLabel="Brand"
        />

        <RadLegendView
          v-tkPieLegend
          position="Right"
          title="Wallets"
          offsetOrigin="Right"
          width="110"
          enableSelection="true"
        />
      </RadPieChart>
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
    totalValue() {
      return this.$_totalValue(this.wallets)
    },
    formattedWallets() {
      return this.wallets.map(wallet => {
        let percentage = parseFloat(
          (wallet.value() / this.totalValue) * 100
        ).toFixed(0)
        return {
          Amount: wallet.value(),
          Brand: `${percentage}% ${wallet.coin.name}`
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

  .legend {
    height: 50%;
  }
}
</style>
