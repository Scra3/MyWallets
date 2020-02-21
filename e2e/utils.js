async function clickOnAddWalletFromHomePage(driver) {
  const addWalletButton = await driver.findElementByAutomationText(
    'add-wallet-button'
  )
  await addWalletButton.click()
}

async function clickToMarketFromHomePage(driver) {
  const marketTab = await driver.findElementByAutomationText('Market')
  await marketTab.click()
}

async function clickOnBackButton(driver) {
  // automation text does not work
  //let backButton = await driver.findElementByAutomationText('back-button')
  let backButton = await driver.findElementByClassName(
    'android.widget.ImageButton'
  )
  await backButton.click()
}

async function clickOnCoinItem(driver, coinName) {
  let bitcoinLabel = await driver.findElementByText(coinName, 'contains')
  await bitcoinLabel.click()
}

async function setBalanceOrAddressInput(driver, value) {
  const balanceInput = (
    await driver.findElementsByAutomationText('text-field')
  )[1]
  await balanceInput.click()
  await balanceInput.type(value)
  await driver.hideDeviceKeyboard()
}

async function setInvestmentInput(driver, value) {
  const balanceInput = (
    await driver.findElementsByAutomationText('text-field')
  )[0]
  await balanceInput.click()
  await balanceInput.type(value)
  await driver.hideDeviceKeyboard()
}

async function clickOnSaveWallet(driver) {
  const saveButton = await driver.findElementByAutomationText('save-button')
  await saveButton.click()
}

exports.clickOnSaveWallet = clickOnSaveWallet
exports.clickOnAddWalletFromHomePage = clickOnAddWalletFromHomePage
exports.clickToMarketFromHomePage = clickToMarketFromHomePage
exports.setInvestmentInput = setInvestmentInput
exports.clickOnBackButton = clickOnBackButton
exports.setBalanceOrAddressInput = setBalanceOrAddressInput
exports.clickOnCoinItem = clickOnCoinItem
