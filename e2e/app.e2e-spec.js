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

  it('changes USD to EUR', async () => {
    const usdLabel = await driver.findElementByText('USD', 'contains')
    await usdLabel.click()

    const label = await driver.findElementByText('EUR', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('displays a message to explain at the user to add a new wallet', async () => {
    const label = await driver.findElementByText(
      'Please add wallets',
      'contains'
    )
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('shows market view when the user clicks on the market tab', async () => {
    await clickToMarketFromHomePage(driver)

    const nameLabel = await driver.findElementByText('24h', 'contains')
    expect(nameLabel.isDisplayed()).toBeTruthy()
  })

  it('shows wallets view when the user clicks on the wallet tab', async () => {
    await clickToMarketFromHomePage(driver)

    const walletsTab = await driver.findElementByAutomationText('Wallets')
    await walletsTab.click()

    await driver.sleep(1000)

    const label = await driver.findElementByText(
      'Please add wallets',
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
      'Please add wallets',
      'contains'
    )
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('adds a bitcoin wallet', async () => {
    await clickOnAddWalletFromHomePage(driver)
    await clickOnCoinItem(driver, 'Bitcoin')

    await setBalanceOrAddressInput(driver, 7.4)

    await clickOnSaveWallet(driver)

    const label = await driver.findElementByText('7.4 BTC', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('updates a bitcoin wallet', async () => {
    await clickOnCoinItem(driver, 'Bitcoin')

    await setBalanceOrAddressInput(driver, 3.4)

    await clickOnSaveWallet(driver)

    const label = await driver.findElementByText('3.4 BTC', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
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
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('updates EOS wallet by adding investment', async () => {
    await clickOnCoinItem(driver, 'EOS')

    await setInvestmentInput(driver, 986)

    await clickOnSaveWallet(driver)

    // without sleeping, sometimes EOS text is not found
    await driver.sleep(1000)

    const label = await driver.findElementByText('986', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })

  it('removes EOS wallet when user clicked on delete', async () => {
    await clickOnCoinItem(driver, 'EOS')

    const moreOptions = await driver.findElementByAutomationText('More options')
    await moreOptions.click()

    const deleteButton = await driver.findElementByText('Delete', 'contains')
    await deleteButton.click()

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
    await clickOnCoinItem(driver, 'XRP')

    await setBalanceOrAddressInput(driver, -7.4)
    await setInvestmentInput(driver, -100)

    await clickOnSaveWallet(driver)

    const label = await driver.findElementByText('Save Wallet', 'contains')
    expect(label.isDisplayed()).toBeTruthy()
  })
})
