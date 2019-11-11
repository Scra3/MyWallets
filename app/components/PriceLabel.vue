<template>
  <FlexboxLayout class="price">
    <label :text="currencySymbol" data-test="currency" />
    <label :text="parseFloat(value).toFixed(2)" data-test="current-price" />
  </FlexboxLayout>
</template>
<script>
import { USD } from '@/constants.js'

export default {
  name: 'PriceLabel',
  props: {
    value: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    }
  },
  computed: {
    currencySymbol() {
      return this.currency === USD ? '$' : '€'
    }
  }
}
</script>
<style lang="scss" scoped>
.price {
  justify-content: flex-end;
  font-weight: bold;
}
</style>
