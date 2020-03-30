<template>
  <FlexboxLayout v-else class="EmptyListMessage">
    <Image row="1" src="res://rocket" class="icon" />

    <label :text="title" class="title" data-test="information-message" />
    <label :text="subTitle" data-test="information-message" />
  </FlexboxLayout>
</template>
<script>
export default {
  name: 'EmptyListMessage',
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
.EmptyListMessage {
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .icon {
    height: 130;
  }

  .title {
    font-size: $large-font-size;
  }
}
</style>
