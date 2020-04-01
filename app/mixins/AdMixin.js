import admob from 'nativescript-admob'

const options = {
  testing: true,
  androidInterstitialId: 'ca-app-pub-5433582223311514/8646997540',
  keywords: ['investment', 'bitcoin', 'crypto', 'trading', 'wallets', 'mining']
}
export const AdMixin = {
  methods: {
    async $_preloadInterstitialAd() {
      try {
        await admob.preloadInterstitial(options)
      } catch (e) {
        console.log('admob $_preloadInterstitialAd error: ' + e)
      }
    },
    async $_showInterstitialAd() {
      try {
        await admob.showInterstitial()
      } catch (e) {
        await admob.createInterstitial(options)
      }
    }
  }
}
