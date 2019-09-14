<template>
  <Page>
    <ActionBar :flat="true" class="action-bar">
      <StackLayout orientation="horizontal">
        <Label text="My Wallets" class="title" />
      </StackLayout>
    </ActionBar>

    <HomePage />
  </Page>
</template>

<script>
import HomePage from "@/views/HomePage";

export default {
  components: { HomePage }
};
</script>

<style lang="scss">
@import "../styles.scss";

.action-bar {
  background-color: $dark-grey;

  .title {
    color: $blue;
    font-size: 24;
    vertical-align: center;
  }
}
</style>