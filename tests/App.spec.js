// App.spec.js
import { shallowMount } from "@vue/test-utils";
import MarketPage from "@/pages/MarketPage";

describe("App.vue", () => {
  it("mounts and renders", () => {
    const wrapper = shallowMount(MarketPage);

    expect(wrapper.html()).toBeTruthy();
  });
});
