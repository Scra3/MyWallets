<template>
  <Page class="WalletPage darkMode">
    <ActionBar title="Edit Wallet" class="action-bar">
      <NavigationButton
        @tap="deleteWallet()"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="delete-wallet"
      />

      <ActionItem
        @tap="$navigateBack()"
        text="Delete"
        android.position="popup"
        data-test="back-button"
      />
    </ActionBar>
    <FlexboxLayout class="container">
      <FlexboxLayout class="setting-mode">
        <Button
          :class="{ selected: !isManualBalanceMode }"
          @tap="setManualBalanceMode(false)"
          class="switch-label"
          text="Synchronize wallet"
          data-test="synchronized-mode-switch"
        />
        <Switch v-model="isManualBalanceMode" class="switch" />
        <Button
          :class="{ selected: isManualBalanceMode }"
          @tap="setManualBalanceMode(true)"
          text="Set balance manually"
          data-test="manual-balance-mode-switch"
          class="switch-label"
        />
      </FlexboxLayout>

      <FlexboxLayout class="title">
        <Image :src="wallet.coin.image" class="image" />
        <Label :text="wallet.coin.name" />
      </FlexboxLayout>

      <StackLayout v-if="isManualBalanceMode" class="input">
        <Label text="Balance" />
        <TextField
          v-model="wallet.balance"
          class="text-field"
          data-test="balance-input"
          keyboardType="number"
        />
      </StackLayout>

      <StackLayout v-else class="input">
        <Label text="Public wallet address" />
        <TextField
          key="address"
          v-model="wallet.address"
          data-test="address-input"
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
        height="300"
        formats="QR_CODE"
      />

      <Button
        @tap="$navigateBack()"
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

export default {
  name: 'WalletPage',
  components: { BarcodeScanner },
  props: {
    wallet: {
      type: Wallet,
      required: true
    }
  },
  data() {
    return {
      isManualBalanceMode: false,
      isScanning: false
    }
  },
  methods: {
    deleteWallet() {
      this.$emit('delete-wallet-did-click')
      this.$navigateBack()
    },
    setManualBalanceMode(isManualBalanceMode) {
      this.isManualBalanceMode = isManualBalanceMode
    },
    onScanResult(result) {
      this.wallet.address = result.text
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
        this.wallet.address = result.text
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

      .image {
        height: 30;
        margin-right: $separation-content;
      }
    }

    .input {
      flex-grow: 1;
      .text-field {
        border-bottom-color: $white;
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
