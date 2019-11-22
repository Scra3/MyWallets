<template>
  <label
    :text="
      value >= 0 ? `+${value.toFixed(2)}${unit}` : `${value.toFixed(2)}${unit}`
    "
    :class="[value >= 0 ? 'positive-change' : 'negative-change']"
    data-test="change-label"
  />
</template>
<script>
export default {
  name: 'ChangeLabel',
  props: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: false,
      default: ''
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
