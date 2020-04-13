<template>
  <Page class="AnalysesPag darkMode">
    <ActionBar title="Analyses" class="action-bar">
      <NavigationButton
        @tap="$navigateBack"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="back-button"
      />
    </ActionBar>

    <Tabs selected-index="1">
      <TabStrip>
        <TabStripItem>
          <Label text="Profits" />
        </TabStripItem>
        <TabStripItem>
          <Label text="Percentage" />
        </TabStripItem>
      </TabStrip>

      <TabContentItem>
        <GridLayout>
          <GainsChartView :wallets="wallets" />
        </GridLayout>
      </TabContentItem>
      <TabContentItem>
        <PercentageChartView :wallets="wallets" />
      </TabContentItem>
    </Tabs>
  </Page>
</template>

<script>
import PercentageChartView from '@/pages/PercentageChartView'
import GainsChartView from '@/pages/GainsChartView'

export default {
  name: 'AnalysesPag',
  components: { PercentageChartView, GainsChartView },
  props: {
    wallets: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedIndex: null
    }
  }
}
</script>

<style lang="scss" scoped>
.AnalysesPag {
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
    highlight-color: $onBackground;
  }
}
</style>
