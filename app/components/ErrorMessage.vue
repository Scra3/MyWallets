<template>
  <Label text="Unable to connect to the server" class="ErrorMessage" />
</template>
<script>
export default {
  name: 'ErrorMessage'
}
</script>

<style lang="scss" scoped>
.ErrorMessage {
  text-align: center;
  width: 100%;
  color: $error;
  font-size: $normal-font-size;
}
</style>
