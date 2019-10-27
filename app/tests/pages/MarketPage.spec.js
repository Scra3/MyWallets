import { shallowMount } from "@vue/test-utils";
import MarketPage from "@/pages/MarketPage";
import { USD } from "@/constants.js";
import flushPromises from "flush-promises";
import * as httpModule from "tns-core-modules/http";

describe("MarketPage.vue", () => {
  it("displays coins name", async () => {
    const wrapper = shallowMount(MarketPage, {
      propsData: {
        currency: USD
      }
    });
    await flushPromises();

    expect(wrapper.find("[data-test='name']").attributes().text).toEqual(
      "Bitcoin"
    );
  });

  it("Calls api url with selected currency", async () => {
    shallowMount(MarketPage, {
      propsData: {
        currency: USD
      }
    });
    await flushPromises();

    expect(httpModule.getJSON).toHaveBeenCalledWith(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
  });
});
