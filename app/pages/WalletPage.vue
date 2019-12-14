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
          @tap="doScanWithFrontCamera()"
          class="scanner-button"
          text="Scan QR code"
          data-test="scanner-button"
        />
      </StackLayout>

      <GridLayout columns="*" rows="auto, auto, auto, auto">
        <BarcodeScanner
          @scanResult="onScanResult"
          v-if="false"
          row="1"
          height="300"
          formats="QR_CODE"
          beep-on-scan="true"
          report-duplicates="true"
          prefer-front-camera="false"
        />
      </GridLayout>

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
      isManualBalanceMode: false
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
    doScanWithFrontCamera() {
      camera.requestPermissions().then(
        function success() {
          this.scan()
        },
        function failure() {}
      )
    },
    scan() {
      new BarcodeScanner()
        .scan({
          cancelLabel: 'EXIT. Also, try the volume buttons!', // iOS only, default 'Close'
          cancelLabelBackgroundColor: '#333333', // iOS only, default '#000000' (black)
          message: 'Use the volume buttons for extra light', // Android only, default is 'Place a barcode inside t
          preferFrontCamera: false, // Android only, default false
          showFlipCameraButton: true, // default false
          torchOn: false, // launch with the flashlight on (default false)
          resultDisplayDuration: 500, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned
          beepOnScan: true, // Play or Suppress beep on scan (default true)
          closeCallback: () => {
            console.log('Scanner closed @ ' + new Date().getTime())
          }
        })
        .then(
          function(result) {
            console.log('ok')
            // Note that this Promise is never invoked when a 'continuousScanCallback' function is provided
            setTimeout(function() {
              // if this alert doesn't show up please upgrade to {N} 2.4.0+
              alert({
                title: 'Scan result',
                message:
                  'Format: ' + result.format + ',\nValue: ' + result.text,
                okButtonText: 'OK'
              })
            }, 500)
          },
          function(errorMessage) {
            console.log('No scan. ' + errorMessage)
          }
        )
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
