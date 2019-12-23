import { config } from '@vue/test-utils'

const NSElements = [
  'ActionBar',
  'ActionItem',
  'FormattedString',
  'GridLayout',
  'HtmlView',
  'NavigationButton',
  'Page',
  'StackLayout',
  'TabView',
  'TabViewItem',
  'TextField',
  'FlexboxLayout',
  'ListView',
  'v-template',
  'ActivityIndicator',
  'PullToRefresh',
  'Button',
  'NavigationButton',
  'BarcodeScanner'
]

NSElements.forEach(ele => {
  config.stubs[ele] = true
})
