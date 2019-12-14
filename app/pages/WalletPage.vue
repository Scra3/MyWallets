<template>
  <Page class="WalletPage darkMode">
    <ActionBar title="Edit Wallet" class="action-bar">
      <NavigationButton
        @tap="$navigateBack"
        text="Go Back"
        android.systemIcon="ic_menu_back"
      />

      <ActionItem
        @tap="$navigateBack"
        text="Delete"
        android.position="popup"
        class=""
      />
    </ActionBar>

    <FlexboxLayout class="container">
      <FlexboxLayout class="setting-mode">
        <Label
          :class="{ selected: !isManualMode }"
          @tap="isManualMode = false"
          text="Connected mode"
        />
        <Switch v-model="isManualMode" class="switch" />
        <Label
          :class="{ selected: isManualMode }"
          @tap="isManualMode = true"
          text="Manual mode"
        />
      </FlexboxLayout>

      <FlexboxLayout class="title">
        <Image :src="wallet.coin.image" class="image" />
        <Label :text="wallet.coin.name" />
      </FlexboxLayout>

      <StackLayout v-if="isManualMode" class="input">
        <Label text="Balance" />
        <TextField v-model="currentWallet.balance" class="text-field" />
      </StackLayout>

      <StackLayout v-else class="input">
        <Label text="Public wallet address" />
        <TextField
          :key="currentWallet.address"
          v-model="currentWallet.address"
        />
        <Label horizontalAlignment="center" text="OR" />
        <Button
          @tap="doScanWithFrontCamera"
          class="scanner-button"
          text="Scan QR code"
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

      <Button @tap="$navigateBack" class="save-button" text="Save Wallet" />
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
      currentWallet: { ...this.wallet },
      isManualMode: false
    }
  },
  methods: {
    onScanResult(result) {
      this.currentWallet.address = result.text
    },
    doScanWithBackCamera() {
      camera.requestPermissions().then(
        function success() {
          this.scan(false)
        },
        function failure() {
          // permission request rejected
          // ... tell the user ...
        }
      )
    },
    doScanWithFrontCamera() {
      this.scan(true)
    },
    scan(front) {
      new BarcodeScanner()
        .scan({
          cancelLabel: 'EXIT. Also, try the volume buttons!', // iOS only, default 'Close'
          cancelLabelBackgroundColor: '#333333', // iOS only, default '#000000' (black)
          message: 'Use the volume buttons for extra light', // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
          preferFrontCamera: front, // Android only, default false
          showFlipCameraButton: true, // default false
          torchOn: false, // launch with the flashlight on (default false)
          resultDisplayDuration: 500, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
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
@import '../styles.scss';

.WalletPage {
  color: $white;

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
