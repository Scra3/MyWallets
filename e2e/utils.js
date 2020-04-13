async function clickOnAddWalletFromHomePage(driver) {
  const addWalletButton = await driver.findElementByAutomationText(
    'add-wallet-button'
  )
  await addWalletButton.click()
}

async function clickOnAddAlertFromAlertPage(driver) {
  const addWalletButton = await driver.findElementByAutomationText(
    'add-alert-button'
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
  const backButton = await driver.findElementByClassName(
    'android.widget.ImageButton'
  )
  await backButton.click()
}

async function clickOnCoinItem(driver, coinName) {
  const bitcoinLabel = await driver.findElementByText(coinName, 'contains')
  await bitcoinLabel.click()
}

async function clickOnDeleteButtonFormFormPage(driver) {
  const moreOptions = await driver.findElementByAutomationText('More options')
  await moreOptions.click()

  const deleteButton = await driver.findElementByText('Delete', 'contains')
  await deleteButton.click()
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

async function setTargetPriceInput(driver, value) {
  const targetPrice = (
    await driver.findElementsByAutomationText('text-field')
  )[0]
  await targetPrice.click()
  await targetPrice.type(value)
  await driver.hideDeviceKeyboard()
}

async function setNotePriceInput(driver, value) {
  const targetPrice = (
    await driver.findElementsByAutomationText('text-field')
  )[1]
  await targetPrice.click()
  await targetPrice.type(value)
  await driver.hideDeviceKeyboard()
}

async function clickOnSaveWallet(driver) {
  const saveButton = await driver.findElementByAutomationText('save-button')
  await saveButton.click()
}

async function clickOnSaveAlert(driver) {
  const saveButton = await driver.findElementByAutomationText('save-button')
  await saveButton.click()
}

async function clickOnCloseAd(driver) {
  const closeAdButton = await driver.findElementByClassName(
    'android.widget.ImageButton'
  )
  await closeAdButton.click()
}

exports.clickOnSaveWallet = clickOnSaveWallet
exports.clickOnAddWalletFromHomePage = clickOnAddWalletFromHomePage
exports.clickToMarketFromHomePage = clickToMarketFromHomePage
exports.setInvestmentInput = setInvestmentInput
exports.clickOnBackButton = clickOnBackButton
exports.setBalanceOrAddressInput = setBalanceOrAddressInput
exports.clickOnCoinItem = clickOnCoinItem
exports.clickOnCloseAd = clickOnCloseAd
exports.clickOnAddAlertFromAlertPage = clickOnAddAlertFromAlertPage
exports.setTargetPriceInput = setTargetPriceInput
exports.clickOnSaveAlert = clickOnSaveAlert
exports.setNotePriceInput = setNotePriceInput
exports.clickOnDeleteButtonFormFormPage = clickOnDeleteButtonFormFormPage
