<template>
  <Button @tap="$emit('tap')" :text="text" class="TappableLabel" />
</template>
<script>
export default {
  name: 'TappableLabel',
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.TappableLabel {
  background-color: transparent;
  border-width: 0;
  border-color: transparent;
  z-index: 0;
  margin: 0;
  padding: 0;
  font-size: $small-font-size;
}
</style>
