const nsAppium = require('nativescript-dev-appium')
const {
  clickOnSaveWallet,
  clickOnAddWalletFromHomePage,
  clickToMarketFromHomePage,
  setInvestmentInput,
  clickOnBackButton,
  setBalanceOrAddressInput,
  clickOnCoinItem
} = require('./utils.js')

describe('sample scenario', () => {
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

  it('displays a message to explain at the user to add a new wallet', async () => {
    const label = await driver.findElementByText(
      'Please add wallets',
      'contains'
    )
    expect(await label.isDisplayed()).toBeTruthy()
  })

  it('shows market view when the user clicks on the market tab', async () => {
    await clickToMarketFromHomePage(driver)

    const nameLabel = await driver.findElementByText('24h', 'contains')
    expect(await nameLabel.isDisplayed()).toBeTruthy()
  })

  it('shows wallets view when the user clicks on the wallet tab', async () => {
    await clickToMarketFromHomePage(driver)

    const walletsTab = await driver.findElementByAutomationText('Wallets')
    await walletsTab.click()

    const label = await driver.findElementByText(
      'Please add wallets',
      'contains'
    )
    expect(await label.isDisplayed()).toBeTruthy()
  })

  it('shows coins page when the user click on add button', async () => {
    await clickOnAddWalletFromHomePage(driver)

    const label = await driver.findElementByText('Select your coin', 'contains')
    expect(await label.isDisplayed()).toBeTruthy()
  })

  it('shows wallet page with the bitcoin coin', async () => {
    await clickOnCoinItem(driver, 'Bitcoin')

    const title = await driver.findElementByText('Edit Wallet', 'contains')
    expect(await title.isDisplayed()).toBeTruthy()

    const bitcoinLabel = await driver.findElementByText('Bitcoin', 'contains')
    expect(await bitcoinLabel.isDisplayed()).toBeTruthy()
  })

  it('goes to home page', async () => {
    await clickOnBackButton(driver)
    await clickOnBackButton(driver)

    const label = await driver.findElementByText(
      'Please add wallets',
      'contains'
    )
    expect(await label.isDisplayed()).toBeTruthy()
  })

  it('adds a bitcoin wallet', async () => {
    await clickOnAddWalletFromHomePage(driver)
    await clickOnCoinItem(driver, 'Bitcoin')

    await setBalanceOrAddressInput(driver, 7.4)

    await clickOnSaveWallet(driver)

    const label = await driver.findElementByText('7.4 BTC', 'contains')
    expect(await label.isDisplayed()).toBeTruthy()
  })

  it('updates a bitcoin wallet', async () => {
    await clickOnCoinItem(driver, 'Bitcoin')

    await setBalanceOrAddressInput(driver, 3.4)

    await clickOnSaveWallet(driver)

    const label = await driver.findElementByText('3.4 BTC', 'contains')
    expect(await label.isDisplayed()).toBeTruthy()
  })

  it('add EOS wallet by connecting it', async () => {
    await clickOnAddWalletFromHomePage(driver)

    await clickOnCoinItem(driver, 'EOS')

    const connectedWalletButton = await driver.findElementByAutomationText(
      'tappable-label'
    )
    await connectedWalletButton.click()

    // without sleeping, sometimes balanceInput does not fond
    await driver.sleep(1000)

    await setBalanceOrAddressInput(driver, 'gi3tmnzsgqge')

    await clickOnSaveWallet(driver)

    // without sleeping, sometimes EOS text is not found
    await driver.sleep(1000)

    const label = await driver.findElementByText('EOS', 'contains')
    expect(await label.isDisplayed()).toBeTruthy()
  })

  it('updates EOS wallet by adding investment', async () => {
    await clickOnCoinItem(driver, 'EOS')

    await setInvestmentInput(driver, 986)

    await clickOnSaveWallet(driver)

    // without sleeping, sometimes EOS text is not found
    await driver.sleep(1000)

    const label = await driver.findElementByText('986', 'contains')
    expect(await label.isDisplayed()).toBeTruthy()
  })

  it('does not navigate to home page when user adds a negative balance and negative investment', async () => {
    await clickOnAddWalletFromHomePage(driver)
    await clickOnCoinItem(driver, 'XRP')

    await setBalanceOrAddressInput(driver, -7.4)
    await setInvestmentInput(driver, -100)

    await clickOnSaveWallet(driver)

    const label = await driver.findElementByText('Save Wallet', 'contains')
    expect(await label.isDisplayed()).toBeTruthy()
  })
})
