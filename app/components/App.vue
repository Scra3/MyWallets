<template>
    <Page>
        <ActionBar title="Welcome to NativeScript-Vue!"/>
        <FlexboxLayout backgroundColor="#3c495e">
            <Label text="third" class="test"/>
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
            color: blue;
        }
    }
</style>
