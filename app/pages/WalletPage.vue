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
          v-if="currentWallet.isUsingLocalBalance"
          :value="currentWallet.value()"
          :currency="currency"
          class="price"
          data-test="wallet-price"
        />
      </FlexboxLayout>

      <StackLayout class="input">
        <FlexboxLayout class="investment-label">
          <Label :text="`Investment (${currency.symbol})`" />
          <Label text="(Optional)" />
        </FlexboxLayout>
        <TextField
          v-model="currentWallet.investment"
          hint="Number"
          class="text-field"
          keyboardType="number"
        />
      </StackLayout>

      <StackLayout v-if="currentWallet.isUsingLocalBalance" class="input">
        <Label text="Total Balance" />
        <FlexboxLayout key="balance">
          <TextField
            v-model="currentWallet.balance"
            :class="{
              error: isAllowedInput === false
            }"
            hint="Number"
            class="text-field"
            data-test="balance-input"
            keyboardType="number"
          />
          <Label
            v-if="isAllowedInput === false"
            text="X"
            class="failed-icon"
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

      <StackLayout v-else>
        <StackLayout class="input">
          <Label text="Public wallet address" />
          <FlexboxLayout key="address">
            <TextField
              :class="{
                error: isAllowedInput === false
              }"
              v-model="currentWallet.address"
              hint="Address"
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
              class="failed-icon"
              data-test="failed-icon"
            />
          </FlexboxLayout>

          <Label
            v-if="isAllowedInput === false"
            text="Can't track wallet, check your address entry"
            class="label-error"
            data-test="label-error"
          />
        </StackLayout>

        <Label class="or-separator" text="OR" />
        <Button
          @tap="scanQrCode"
          class="scanner-button"
          text="Scan QR code"
          data-test="scanner-button"
        />
      </StackLayout>

      <FlexboxLayout class="footer-container">
        <Button
          @tap="checkInputAndBackToHomePage"
          class="save-button"
          text="Save Wallet"
          data-test="save-button"
        />
      </FlexboxLayout>
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
        if (this.currentWallet.isUsingLocalBalance) {
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
    useBalanceSetting(isUsingLocalBalance) {
      if (this.currentWallet.isUsingLocalBalance !== isUsingLocalBalance) {
        this.isAllowedInput = null
      }

      this.currentWallet.isUsingLocalBalance = isUsingLocalBalance
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
      padding: $separation-content;
      background-color: $grey;
      margin-top: 2 * $separation-content;

      .investment-label {
        justify-content: space-between;
      }

      .text-field {
        width: 100%;
        color: $white;

        &.error {
          border-bottom-width: 1;
          border-color: red;
        }
      }

      .failed-icon {
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

    .or-separator {
      horizontal-alignment: center;
      margin-top: $separation-content;
      margin-bottom: $separation-content;
    }

    .scanner-button {
      background-color: $blue;
      width: 50%;
    }

    .footer-container {
      flex-grow: 1;
      flex-direction: column;
      justify-content: flex-end;

      .save-button {
        width: 100%;
        background-color: $success-color;
        font-weight: bold;
      }
    }
  }
}
</style>
