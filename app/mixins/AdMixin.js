import admob from 'nativescript-admob'

export const AdMixin = {
  methods: {
    async $_preloadInterstitialAd() {
      try {
        await admob.preloadInterstitial({
          testing: true,
          androidInterstitialId: 'ca-app-pub-5433582223311514/8646997540',
          keywords: [
            'investment',
            'bitcoin',
            'crypto',
            'trading',
            'wallets',
            'mining'
          ]
        })
      } catch (e) {
        console.log('admob $_preloadInterstitialAd error: ' + e)
      }
    },
    async $_showInterstitialAd() {
      try {
        await admob.showInterstitial()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
