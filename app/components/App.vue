<template>
  <Page>
    <FlexboxLayout class="container">
      <FlexboxLayout class="totalBalance">
        <Label text="210,10$" />
      </FlexboxLayout>
      <FlexboxLayout class="portfolios">
        <ListView for="portfolio in portfolios">
          <v-template>
            <FlexboxLayout class="portfolio">
              <Label :text="portfolio.name" />
              <Label :text="portfolio.balance" />
            </FlexboxLayout>
          </v-template>
        </ListView>
      </FlexboxLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello Worlddezdezoezdezdezds!",
      portfolios: [{ name: "xrp", balance: 200 }, { name: "btc", balance: 300 }]
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #222831;
  flex-direction: column;
  color: #eee;
  align-items: flex-start;

  .totalBalance {
    font-size: 30em;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .portfolios {
    font-size: 20em;
    flex-direction: column;
  }
}
</style>