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
        @is-balance-mode-did-tap="useLocalBalance"
      />

      <FlexboxLayout class="title" data-test="title">
        <Image :src="currentWallet.coin.image" class="icon coinIcon" />
        <Label :text="currentWallet.coin.name" />
        <PriceLabel
          v-if="currentWallet.isUsingLocalBalance && currentWallet.balance"
          :value="currentWallet.value()"
          :currency="currency"
          class="price"
          data-test="wallet-price"
        />
      </FlexboxLayout>

      <InputField
        key="investment"
        :label="`Investment (${currency.symbol})`"
        :is-optional="true"
        :value="currentWallet.investment"
        @value-did-change="currentWallet.investment = $event"
        keyboardType="number"
        hint="Number"
      />

      <WalletBalanceInput
        v-if="currentWallet.isUsingLocalBalance"
        :balance="currentWallet.balance"
        @balance-did-change="currentWallet.balance = $event"
        @is-balance-valid="isBalanceValid = $event"
      />

      <StackLayout v-else>
        <WalletAddressInput
          :address="currentWallet.address"
          :coin-id="currentWallet.coin.id"
          @address-did-change="currentWallet.address = $event"
          @is-address-valid="isAddressValid = $event"
          @is-checking-address-validity="isCheckingAddressValidity = $event"
        />

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
          @tap="backToHomePage"
          :text="isUpdating ? 'Update Wallet' : 'Save Wallet'"
          class="save-button"
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
import WalletBalanceInput from '@/components/WalletBalanceInput'
import WalletAddressInput from '@/components/WalletAddressInput'
import InputField from '@/components/InputField'

export default {
  name: 'WalletPage',
  components: {
    WalletAddressInput,
    WalletBalanceInput,
    WalletSwitch,
    PriceLabel,
    InputField
  },
  mixins: [WalletMixin],
  props: {
    wallet: {
      type: Wallet,
      required: true
    },
    currency: {
      type: Object,
      required: true
    },
    isUpdating: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      currentWallet: null,
      isBalanceValid: null,
      isAddressValid: null,
      isCheckingAddressValidity: false
    }
  },
  beforeMount() {
    this.currentWallet = this.wallet
  },
  methods: {
    backToHomePage() {
      if (this.isCheckingAddressValidity) {
        return false
      }

      if (
        this.isBalanceValid === null &&
        this.isAddressValid === null &&
        this.isUpdating
      ) {
        this.navigateToHomePage()
      } else if (
        this.currentWallet.isUsingLocalBalance &&
        this.isBalanceValid
      ) {
        this.navigateToHomePage()
      } else if (
        !this.currentWallet.isUsingLocalBalance &&
        this.isAddressValid
      ) {
        this.navigateToHomePage()
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
    useLocalBalance(isUsingLocalBalance) {
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
