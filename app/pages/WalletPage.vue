<template>
  <Page class="WalletPage darkMode">
    <ActionBar title="Edit Wallet" class="action-bar">
      <NavigationButton
        @tap="$navigateBack()"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="back-button"
      />

      <ActionItem
        @tap="deleteWallet()"
        text="Delete"
        android.position="popup"
        data-test="delete-wallet"
      />
    </ActionBar>
    <FlexboxLayout class="container">
      <FlexboxLayout class="setting-mode">
        <Button
          :class="{ selected: !currentWallet.isUsingBalanceSetting }"
          @tap="useBalanceSetting(false)"
          class="switch-label"
          text="Synchronize wallet"
          data-test="address-mode-label"
        />

        <Switch
          v-model="currentWallet.isUsingBalanceSetting"
          @checkedChange="handleCheckedChange"
          class="switch"
        />

        <Button
          :class="{ selected: currentWallet.isUsingBalanceSetting }"
          @tap="useBalanceSetting(true)"
          text="Set balance manually"
          data-test="manual-balance-mode-label"
          class="switch-label"
        />
      </FlexboxLayout>

      <FlexboxLayout class="title" data-test="title">
        <Image :src="currentWallet.coin.image" class="icon coinIcon" />
        <Label :text="currentWallet.coin.name" />
        <PriceLabel
          v-if="currentWallet.isUsingBalanceSetting"
          :value="walletPrice"
          :currency="currency"
          class="price"
          data-test="wallet-price"
        />
      </FlexboxLayout>

      <StackLayout v-if="currentWallet.isUsingBalanceSetting" class="input">
        <Label text="Balance" />
        <FlexboxLayout>
          <TextField
            v-model="currentWallet.balance"
            @focus="isFocusingInput = true"
            :class="{
              error: isAllowedInput === false,
              focus: isFocusingInput
            }"
            class="text-field"
            data-test="balance-input"
            keyboardType="number"
          />
          <Label
            v-if="isAllowedInput === false"
            text="X"
            class="failedIcon"
            data-test="failed-icon"
          />
        </FlexboxLayout>

        <Label
          v-if="isAllowedInput === false"
          text="Must be equal or greater than 0 and not be blank"
          class="label-error"
          data-test="label-error"
        />
      </StackLayout>

      <StackLayout v-else class="input">
        <Label text="Public wallet address" />
        <FlexboxLayout>
          <TextField
            key="address"
            :class="{
              error: isAllowedInput === false,
              focus: isFocusingInput
            }"
            @focus="isFocusingInput = true"
            v-model="currentWallet.address"
            class="text-field"
            data-test="address-input"
          />

          <ActivityIndicator
            v-if="isCheckingAddress"
            :busy="isCheckingAddress"
            class="spinner"
          />
          <Label
            v-if="isAllowedInput === false"
            text="X"
            class="failedIcon"
            data-test="failed-icon"
          />
        </FlexboxLayout>

        <Label
          v-if="isAllowedInput === false"
          text="Can't synchronize wallet, check your address entry"
          class="label-error"
          data-test="label-error"
        />

        <Label horizontalAlignment="center" text="OR" />
        <Button
          @tap="scanQrCode()"
          class="scanner-button"
          text="Scan QR code"
          data-test="scanner-button"
        />
      </StackLayout>

      <BarcodeScanner
        v-if="isScanning"
        @scanResult="onScanResult"
        formats="QR_CODE"
      />

      <Button
        @tap="checkInputAndBackToHomePage"
        class="save-button"
        text="Save Wallet"
        data-test="save-button"
      />
    </FlexboxLayout>
  </Page>
</template>

<script>
import { Wallet } from '@/models/Wallet'
import { BarcodeScanner } from 'nativescript-barcodescanner'
import * as camera from 'nativescript-camera'
import PriceLabel from '@/components/PriceLabel'
import App from '@/App'

export default {
  name: 'WalletPage',
  components: { PriceLabel, BarcodeScanner },
  props: {
    wallet: {
      type: Wallet,
      required: true
    },
    currency: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isScanning: false,
      currentWallet: null,
      isAllowedInput: null,
      isFocusingInput: false,
      isCheckingAddress: false
    }
  },
  computed: {
    walletPrice() {
      if (!this.currentWallet) {
        return 0
      }

      if (this.currentWallet.isUsingBalanceSetting || this.isAllowedInput) {
        return this.currentWallet.value()
      }

      return 0
    }
  },
  beforeMount() {
    this.currentWallet = this.wallet
  },
  methods: {
    checkAddress() {
      return Promise.resolve(true)
    },
    async checkInputAndBackToHomePage() {
      this.isAllowedInput = null
      this.isCheckingAddress = true

      try {
        if (this.currentWallet.isUsingBalanceSetting) {
          this.isAllowedInput =
            this.currentWallet.balance !== '' && this.currentWallet.balance >= 0
        } else {
          this.isAllowedInput =
            !!this.currentWallet.address && (await this.checkAddress())
        }

        if (this.isAllowedInput) {
          this.navigateToHomePage()
        }
      } catch (e) {
      } finally {
        this.isCheckingAddress = false
      }
    },
    navigateToHomePage() {
      this.$navigateTo(App, {
        props: {
          currency: this.currency
        }
      })
    },
    deleteWallet() {
      this.navigateToHomePage()
    },
    handleCheckedChange() {
      this.isFocusingInput = false
      this.isAllowedInput = null
    },
    useBalanceSetting(isUsingBalanceSetting) {
      if (this.currentWallet.isUsingBalanceSetting !== isUsingBalanceSetting) {
        this.isFocusingInput = false
        this.isAllowedInput = null
      }
      this.currentWallet.isUsingBalanceSetting = isUsingBalanceSetting
    },
    onScanResult(result) {
      this.currentWallet.address = result.text
    },
    async scanQrCode() {
      try {
        this.isScanning = true
        await camera.requestPermissions()
        this.scan()
      } catch (e) {
        this.isScanning = false
      }
    },
    async scan() {
      try {
        const result = await new BarcodeScanner().scan()
        this.isScanning = false
        this.currentWallet.address = result.text
      } catch (errorMessage) {
        console.log('No scan. ' + errorMessage)
      } finally {
        this.isScanning = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.WalletPage {
  .action-bar {
    background-color: $dark-grey;
    color: $white;

    ActionItem {
      color: $white;
      background-color: $white;
    }
  }

  .container {
    color: $white;
    flex-direction: column;
    margin: 10;

    .setting-mode {
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 30;

      .switch {
        margin-right: 10;
        margin-left: 10;
        background-color: $white;
        color: $blue;
      }

      .switch-label {
        background-color: transparent;
        border-width: 0;
        border-color: transparent;
        z-index: 0;
        margin: 0;
        padding: 0;
        font-size: $small-font-size;
      }

      .selected {
        color: $success-color;
        font-weight: bold;
      }
    }

    .title {
      align-items: center;
      font-weight: bold;
      font-size: $normal-font-size;
      margin-bottom: 20;
      border-color: $white;
      border-width: 1;
      padding: 5;

      .icon {
        margin-right: $separation-content;
      }

      .price {
        flex-grow: 1;
        justify-content: flex-end;
      }
    }

    .input {
      flex-grow: 1;

      .text-field {
        width: 100%;

        &.focus {
          border-bottom-width: 1;
          border-color: $blue;
        }

        &.error {
          border-bottom-width: 1;
          border-color: red;
        }
      }

      .failedIcon {
        color: $error-color;
        width: 40;
        align-self: center;
      }

      .label-error {
        color: $error-color;
        margin-left: $separation-content;
        margin-bottom: $separation-content;
      }
    }

    .scanner-button {
      background-color: $blue;
      width: 50%;
    }

    .save-button {
      background-color: $success-color;
      width: 50%;
      font-weight: bold;
    }
  }
}
</style>
