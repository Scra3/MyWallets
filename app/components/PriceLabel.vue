<template>
  <FlexboxLayout class="price">
    <label :text="currency.symbol" data-test="currency" />
    <label :text="parseFloat(value).toFixed(2)" data-test="current-price" />
  </FlexboxLayout>
</template>
<script>
export default {
  name: 'PriceLabel',
  props: {
    value: {
      type: Number,
      required: true
    },
    currency: {
      type: Object,
      required: true
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
