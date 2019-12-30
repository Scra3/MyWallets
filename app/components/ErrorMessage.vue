<template>
  <Label text="Unable to connect to the server" class="ErrorMessage" />
</template>
<script>
export default {
  name: 'ErrorMessage'
}
</script>

<style lang="scss" scoped>
@import '../styles';

.ErrorMessage {
  text-align: center;
  width: 100%;
  color: $error-color;
  font-size: $normal-font-size;
}
</style>
