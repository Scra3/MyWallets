const nsAppium = require('nativescript-dev-appium')
const {
  clickOnSaveWallet,
  clickOnAddWalletFromHomePage,
  clickToMarketFromHomePage,
  setInvestmentInput,
  clickOnBackButton,
  setBalanceOrAddressInput,
  clickOnCoinItem,
  clickOnAddAlertFromAlertPage,
  setTargetPriceInput,
  clickOnSaveAlert,
  setNotePriceInput,
  clickOnDeleteButtonFormFormPage,
  clickOnCloseAd
} = require('./utils.js')

const EMPTY_WALLET_LIST_MESSAGE = 'Empty wallet list'
const EMPTY_ALERT_LIST_MESSAGE = 'Empty alert list'

describe('MVP scenarios', () => {
  let driver

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1200000
    driver = await nsAppium.createDriver()
  })

  afterAll(async () => {
    await driver.quit()
    console.log('Quit driver!')
  })

  afterEach(async function() {
    await driver.logTestArtifacts('failure')
  })

  it('shows alert view when the user clicks on the alert tab', async () => {
    const alertTab = await driver.findElementByAutomationText('Alerts')
    await alertTab.click()

    const label = await driver.findElementByText(
      EMPTY_ALERT_LIST_MESSAGE,
      'contains'
    )
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('adds a new bitcoin alert', async () => {
    await clickOnAddAlertFromAlertPage(driver)

    await clickOnCoinItem(driver, 'Bitcoin')

    await setTargetPriceInput(driver, 7.4)

    await clickOnSaveAlert(driver)

    await clickOnCloseAd(driver)

    const label = await driver.findElementByText('7.4', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('updates the bitcoin alert', async () => {
    await clickOnCoinItem(driver, 'Bitcoin')

    await setTargetPriceInput(driver, 8.4)
    await setNotePriceInput(driver, 'stop loss')

    await clickOnSaveAlert(driver)

    await clickOnCloseAd(driver)

    let label = await driver.findElementByText('8.4', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
    label = await driver.findElementByText('stop loss', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('removes the bitcoin alert', async () => {
    await clickOnCoinItem(driver, 'Bitcoin')

    await clickOnDeleteButtonFormFormPage(driver)

    const label = await driver.findElementByText(
      EMPTY_ALERT_LIST_MESSAGE,
      'contains'
    )
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('changes USD to EUR', async () => {
    await driver.sleep(2000)

    const usdLabel = await driver.findElementByText('USD', 'contains')
    await usdLabel.click()

    const applyButton = (
      await driver.findElementsByClassName('android.widget.Button')
    )[1]
    await applyButton.click()

    await driver.sleep(2000)

    const label = await driver.findElementByText('EUR', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('shows market view when the user clicks on the market tab', async () => {
    await clickToMarketFromHomePage(driver)

    const labelName = await driver.findElementByText('24h', 'contains')
    expect(labelName.isDisplayed()).toBeTruthy()
  })

  it('shows wallets view when the user clicks on the wallet tab', async () => {
    await clickToMarketFromHomePage(driver)

    const walletsTab = await driver.findElementByAutomationText('Wallets')
    await walletsTab.click()

    await driver.sleep(1000)

    const label = await driver.findElementByText(
      EMPTY_WALLET_LIST_MESSAGE,
      'contains'
    )
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('shows coins page when the user click on add button', async () => {
    await clickOnAddWalletFromHomePage(driver)

    const label = await driver.findElementByText('Select your coin', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('shows wallet page with the bitcoin coin', async () => {
    await clickOnCoinItem(driver, 'Bitcoin')

    const title = await driver.findElementByText('Edit Wallet', 'contains')
    expect(title.isDisplayed()).toBeTruthy()

    const bitcoinLabel = await driver.findElementByText('Bitcoin', 'contains')
    expect(bitcoinLabel.isDisplayed()).toBeTruthy()
  })

  it('goes to home page when the user clicks two times on back button', async () => {
    await clickOnBackButton(driver)
    await clickOnBackButton(driver)

    const label = await driver.findElementByText(
      EMPTY_WALLET_LIST_MESSAGE,
      'contains'
    )
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('adds a bitcoin wallet', async () => {
    await clickOnAddWalletFromHomePage(driver)
    await clickOnCoinItem(driver, 'Bitcoin')

    await setBalanceOrAddressInput(driver, 7.4)

    await clickOnSaveWallet(driver)

    await clickOnCloseAd(driver)

    const label = await driver.findElementByText('7.4 BTC', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('updates a bitcoin wallet', async () => {
    await driver.sleep(1000)

    await clickOnCoinItem(driver, 'Bitcoin')

    await setBalanceOrAddressInput(driver, 3.4)

    await clickOnSaveWallet(driver)
    await driver.sleep(1000)

    await clickOnCloseAd(driver)

    const label = await driver.findElementByText('3.4 BTC', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('add EOS wallet by connecting it', async () => {
    await driver.sleep(1000)

    await clickOnAddWalletFromHomePage(driver)

    const searchInput = await driver.findElementByClassName(
      'android.widget.EditText'
    )
    await searchInput.type('EO')

    await clickOnCoinItem(driver, 'EOS')

    const connectedWalletButton = await driver.findElementByAutomationText(
      'tappable-label'
    )
    await connectedWalletButton.click()

    // without sleeping, sometimes balanceInput does not fond
    await driver.sleep(1000)

    await setBalanceOrAddressInput(driver, 'gi3tmnzsgqge')

    await clickOnSaveWallet(driver)

    await clickOnCloseAd(driver)

    // without sleeping, sometimes EOS text is not found
    await driver.sleep(1000)

    const label = await driver.findElementByText('EOS', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('updates EOS wallet by adding investment', async () => {
    await clickOnCoinItem(driver, 'EOS')

    await setInvestmentInput(driver, 986)

    await clickOnSaveWallet(driver)

    await clickOnCloseAd(driver)

    // without sleeping, sometimes EOS text is not found
    await driver.sleep(1000)

    const label = await driver.findElementByText('986', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('navigates to analyses pages', async () => {
    const analysisButton = await driver.findElementByAutomationText(
      'analysis-button'
    )
    await analysisButton.click()

    const walletsTab = await driver.findElementByAutomationText('Percentage')
    await walletsTab.click()

    await clickOnBackButton(driver)

    await driver.sleep(1000)

    const label = await driver.findElementByText('986', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('removes EOS wallet when user clicked on delete', async () => {
    await clickOnCoinItem(driver, 'EOS')

    await clickOnDeleteButtonFormFormPage(driver)

    const wallets = await driver.findElementsByAutomationText(
      'wallet-item',
      'contains'
    )
    const btcLabel = await driver.findElementByText('3.4 BTC', 'contains')
    expect(wallets.length).toEqual(1)
    expect(btcLabel.isDisplayed()).toBeTruthy()
  })

  it('does not navigate to home page when user adds a negative balance and negative investment', async () => {
    await clickOnAddWalletFromHomePage(driver)

    const searchInput = await driver.findElementByClassName(
      'android.widget.EditText'
    )
    await searchInput.type('XR')
    await clickOnCoinItem(driver, 'XRP')

    await setBalanceOrAddressInput(driver, -7.4)
    await setInvestmentInput(driver, -100)

    await clickOnSaveWallet(driver)
    await clickOnCloseAd(driver)

    const label = await driver.findElementByText('Save Wallet', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })
})
