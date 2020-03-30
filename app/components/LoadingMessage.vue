<template>
  <FlexboxLayout class="LoadingMessage">
    <ActivityIndicator :busy="true" class="spinner" />
    <label :text="title" class="title" />
    <label :text="subTitle" />
  </FlexboxLayout>
</template>
<script>
export default {
  name: 'LoadingMessage',
  props: {
    title: {
      type: String,
      required: true
    },
    subTitle: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.LoadingMessage {
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .title {
    font-size: $large-font-size;
  }
}
</style>
