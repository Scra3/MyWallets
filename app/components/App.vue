<template>
  <Page>
    <FlexboxLayout>
      <Label
        text="third"
        class="test"
      />
    </FlexboxLayout>
  </Page>
</template>

<script >
  export default {
    data() {
      return {
        msg: 'Hello Worlddezdezoezdezdezds!'
      }
    }
  }


</script>

<style lang="scss" scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }
    Page {
        .test {
            color: red;
        }
    }
</style>
