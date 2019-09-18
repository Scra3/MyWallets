import Vue from 'nativescript-vue';
import HomePage from '@/pages/HomePage';

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    const Constructor = Vue.extend(HomePage);
    const HomePagesComponent = new Constructor().$mount();
    expect(HomePagesComponent.$el.textContent).to.contain('No Wallet added');
  });
});
