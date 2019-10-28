<template>
  <label
    :text="value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`"
    :class="[value >= 0 ? 'positive-change' : 'negative-change']"
    data-test="change-percentage"
  />
</template>
<script>
export default {
  name: 'ChangePercentageLabel',
  props: {
    value: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles';

.positive-change {
  color: $success-color;
}

.negative-change {
  color: $error-color;
}
</style>
