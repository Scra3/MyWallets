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
        v-if="isUpdating"
        @tap="deleteWallet"
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
        :is-valid="isInvestmentValid"
        :value="currentWallet.investment"
        @value-did-change="currentWallet.investment = $event"
        keyboardType="number"
        hint="Number"
        label-error="Must be equal or greater than 0"
      />

      <WalletBalanceInput
        v-if="currentWallet.isUsingLocalBalance"
        :balance="currentWallet.balance"
        :is-valid="isBalanceValid"
        @balance-did-change="currentWallet.balance = $event"
      />

      <WalletAddressInput
        v-else
        :address="currentWallet.address"
        :is-valid="isAddressValid"
        :is-checking-address="isCheckingAddressValidity"
        :has-connection-error="isFailedCheckingAddressValidity"
        @address-did-change="currentWallet.address = $event"
      />

      <FlexboxLayout class="footer-container">
        <Button
          @tap="saveWalletAndBackToHomePage"
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
import PriceLabel from '@/components/PriceLabel'
import App from '@/App'
import { WalletMixin } from '@/mixins/WalletMixin'
import WalletSwitch from '@/components/WalletSwitch'
import WalletBalanceInput from '@/components/WalletBalanceInput'
import WalletAddressInput from '@/components/WalletAddressInput'
import InputField from '@/components/InputField'
import { mapActions } from 'vuex'

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
      isAddressValid: null,
      isBalanceValid: null,
      isInvestmentValid: null,
      isCheckingAddressValidity: false,
      isFailedCheckingAddressValidity: false
    }
  },
  beforeMount() {
    this.currentWallet = this.wallet
  },
  methods: {
    ...mapActions(['insert', 'delete', 'update']),
    async verifyAddress() {
      this.isCheckingAddressValidity = true
      this.isFailedCheckingAddressValidity = false
      this.isAddressValid = null

      try {
        if (this.currentWallet.address) {
          this.isAddressValid = await this.$_checkAddressValidity(
            this.currentWallet.address,
            this.currentWallet.coin.id
          )
        } else {
          this.isAddressValid = false
        }
      } catch (e) {
        this.isFailedCheckingAddressValidity = true
      } finally {
        this.isCheckingAddressValidity = false
      }
    },
    verifyBalance() {
      const balance = this.currentWallet.balance
      this.isBalanceValid = !!balance && balance !== '' && balance >= 0
    },
    verifyInvestment() {
      const investment = this.currentWallet.investment

      this.isInvestmentValid =
        investment === null || investment === '' || investment >= 0
    },
    async saveInDb() {
      if (this.isUpdating) {
        await this.update(this.currentWallet)
      } else {
        await this.insert(this.currentWallet)
      }
    },
    async saveWalletAndBackToHomePage() {
      this.verifyInvestment()

      if (this.currentWallet.isUsingLocalBalance && this.isInvestmentValid) {
        this.verifyBalance()

        if (this.isBalanceValid) {
          await this.saveInDb()
          this.navigateToHomePage()
        }
      } else if (
        !this.currentWallet.isUsingLocalBalance &&
        this.isInvestmentValid
      ) {
        await this.verifyAddress()

        if (this.isAddressValid) {
          await this.saveInDb()
          this.navigateToHomePage()
        }
      }
    },
    navigateToHomePage() {
      this.$navigateTo(App, {
        props: {
          currency: this.currency
        }
      })
    },
    async deleteWallet() {
      await this.delete(this.currentWallet.id)
      this.navigateToHomePage()
    },
    useLocalBalance(isUsingLocalBalance) {
      this.currentWallet.isUsingLocalBalance = isUsingLocalBalance
    }
  }
}
</script>

<style lang="scss" scoped>
.WalletPage {
  .action-bar {
    background-color: $background;
    color: $onBackground;

    ActionItem {
      color: $onBackground;
      background-color: $background;
    }
  }

  .container {
    color: $white;
    flex-direction: column;
    margin: 10;

    .title {
      align-items: center;
      font-weight: bold;
      background-color: $surface;
      font-size: $normal-font-size;
      margin-bottom: 10;
      padding: $separation-content;

      .icon {
        margin-right: $separation-content;
      }

      .price {
        flex-grow: 1;
        justify-content: flex-end;
      }
    }

    .footer-container {
      flex-grow: 1;
      flex-direction: column;
      justify-content: flex-end;

      .save-button {
        width: 100%;
        background-color: $secondary;
        font-weight: bold;
        color: $onSecondary;
      }
    }
  }
}
</style>
