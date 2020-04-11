const ETH = 'ethereum'
const XRP = 'ripple'
const EOS = 'eos'
const NEO = 'neo'
const BTC = 'bitcoin'

const USD = { acronym: 'usd', symbol: '$' }
const EUR = { acronym: 'eur', symbol: '€' }

const DB_NAME = 'myWallets.db'

// It also defined in continuousService.js but for simplify unit test, it also defined here
const CONTINUOUS_SERVICE_CLASSNAME =
  'org.nativescript.mywallets.Continuous_Service'

export {
  ETH,
  XRP,
  EOS,
  NEO,
  USD,
  EUR,
  BTC,
  DB_NAME,
  CONTINUOUS_SERVICE_CLASSNAME
}
