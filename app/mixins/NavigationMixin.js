export const NavigationMixin = {
  methods: {
    // transition it uses to fix flash white screen during navigation
    $_navigateTo(page, options) {
      this.$navigateTo(page, {
        transitionAndroid: {
          name: 'fade',
          duration: 1
        },
        ...options
      })
    }
  }
}
