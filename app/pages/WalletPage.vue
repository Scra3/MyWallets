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
      <WalletSwitch
        v-if="$_canTrackAddress(currentWallet.coin.id)"
        :wallet="currentWallet"
        @is-balance-mode-did-tap="useBalanceSetting"
      />

      <FlexboxLayout class="title" data-test="title">
        <Image :src="currentWallet.coin.image" class="icon coinIcon" />
        <Label :text="currentWallet.coin.name" />
        <PriceLabel
          v-if="currentWallet.isUsingBalanceSetting"
          :value="currentWallet.value()"
          :currency="currency"
          class="price"
          data-test="wallet-price"
        />
      </FlexboxLayout>

      <StackLayout v-if="currentWallet.isUsingBalanceSetting" class="input">
        <Label text="Total Balance" />
        <FlexboxLayout key="balance">
          <TextField
            v-model="currentWallet.balance"
            @focus="isFocusingInput = true"
            :class="{
              error: isAllowedInput === false,
              focus: isAllowedInput !== false && isFocusingInput
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
        <FlexboxLayout key="address">
          <TextField
            :class="{
              error: isAllowedInput === false,
              focus: isAllowedInput !== false && isFocusingInput
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
          text="Can't track wallet, check your address entry"
          class="label-error"
          data-test="label-error"
        />

        <Label horizontalAlignment="center" text="OR" />
        <Button
          @tap="scanQrCode"
          class="scanner-button"
          text="Scan QR code"
          data-test="scanner-button"
        />
      </StackLayout>

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
import { WalletMixin } from '@/mixins/WalletMixin'
import WalletSwitch from '@/components/WalletSwitch'

export default {
  name: 'WalletPage',
  components: { WalletSwitch, PriceLabel },
  mixins: [WalletMixin],
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
      currentWallet: null,
      isAllowedInput: null,
      isFocusingInput: false,
      isCheckingAddress: false
    }
  },
  beforeMount() {
    this.currentWallet = this.wallet
  },
  methods: {
    isBalanceInputAllowed() {
      return (
        this.currentWallet.balance !== '' && this.currentWallet.balance >= 0
      )
    },
    async isAddressInputAllowed() {
      return (
        !!this.currentWallet.address &&
        (await this.$_checkAddressValidity(
          this.currentWallet.address,
          this.currentWallet.coin.id
        ))
      )
    },
    async checkInputAndBackToHomePage() {
      this.isAllowedInput = null
      this.isCheckingAddress = true

      try {
        if (this.currentWallet.isUsingBalanceSetting) {
          this.isAllowedInput = this.isBalanceInputAllowed()
        } else {
          this.isAllowedInput = await this.isAddressInputAllowed()
        }

        if (this.isAllowedInput) {
          this.navigateToHomePage()
        }
      } catch (e) {
        console.log(e)
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
    useBalanceSetting(isUsingBalanceSetting) {
      if (this.currentWallet.isUsingBalanceSetting !== isUsingBalanceSetting) {
        this.isFocusingInput = false
        this.isAllowedInput = null
      }

      this.currentWallet.isUsingBalanceSetting = isUsingBalanceSetting
    },
    async scanQrCode() {
      try {
        await camera.requestPermissions()
        this.scan()
      } catch (e) {
        console.log(e)
      }
    },
    async scan() {
      try {
        const result = await new BarcodeScanner().scan({ formats: 'QR_CODE' })
        this.currentWallet.address = result.text
      } catch (errorMessage) {
        console.log('No scan. ' + errorMessage)
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
