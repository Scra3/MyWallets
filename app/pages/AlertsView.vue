<template>
  <StackLayout class="AlertsView darkMode">
    <FlexboxLayout class="overview">
      <label text="Please add alerts" data-test="information-message" />
    </FlexboxLayout>

    <grid-layout rows="auto, *">
      <StackLayout row="1" />
      <Fab
        @tap="navigateToCoinsPage"
        row="1"
        automationText="add-alert-button"
        class="fab-button"
      >
        +
      </Fab>
    </grid-layout>
  </StackLayout>
</template>

<script>
import CoinsPage from '@/pages/CoinsPage'

export default {
  name: 'AlertsView',
  props: {
    currency: {
      type: Object,
      required: true
    }
  },
  methods: {
    navigateToCoinsPage() {
      this.$navigateTo(CoinsPage, {
        props: {
          currency: this.currency,
          isConnectableTagDisplayed: false,
          navigateTo: 'AlertFormPage'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.AlertsView {
  .overview {
    justify-content: center;
    align-items: center;
    padding: $separation-content;
    border-radius: $border-radius;
    height: 120;
    font-size: $large-font-size;
    background-color: $surface;
    margin: $separation-content;
  }

  .fab-button {
    height: 60;
    width: 50;
    margin: 15;
    background-color: $secondary;
    horizontal-align: right;
    vertical-align: bottom;
    color: $onSecondary;
  }
}
</style>
