<template>
  <Page>
    <ActionBar title="My Wallets" class="action-bar">
      <ActionItem
        @tap="toggleCurrency"
        :text="selectedCurrency"
        class="currency"
        android.position="right" />
    </ActionBar>

    <HomePage :currency="selectedCurrency" />
  </Page>
</template>

<script>
import HomePage from "@/pages/HomePage";
import { USD, EUR } from "@/constants.js";

export default {
  components: { HomePage },
  data() {
    return {
      selectedCurrency: USD
    };
  },
  methods: {
    toggleCurrency() {
      this.selectedCurrency = this.selectedCurrency === USD ? EUR : USD;
    }
  }
};
</script>

<style lang="scss">
@import "styles";

.action-bar {
  background-color: $dark-grey;
  color: $blue;

  .currency {
    size: 24;
    color: $blue;
  }
}
</style>
