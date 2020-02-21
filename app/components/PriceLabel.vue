<template>
  <FlexboxLayout class="price">
    <label :text="currency.symbol" />
    <label :text="value" />
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
