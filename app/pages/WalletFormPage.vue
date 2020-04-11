<template>
  <Page class="WalletFormPage darkMode">
    <ActionBar title="Edit Wallet" class="action-bar">
      <NavigationButton
        @tap="$navigateBack()"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="back-button"
      />

      <ActionItem
        @tap="deleteWallet"
        :visibility="isUpdating ? 'visible' : 'collapse'"
        text="Delete"
        android.position="popup"
        data-test="delete-wallet"
      />
    </ActionBar>

    <FlexboxLayout class="container">
      <WalletSwitch
        v-if="$_canConnectAddress(currentWallet.coin.id)"
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
          automationText="save-button"
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
import { NavigationMixin } from '@/mixins/NavigationMixin'
import { AdMixin } from '@/mixins/AdMixin'

export default {
  name: 'WalletFormPage',
  components: {
    WalletAddressInput,
    WalletBalanceInput,
    WalletSwitch,
    PriceLabel,
    InputField
  },
  mixins: [WalletMixin, NavigationMixin, AdMixin],
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
      isCheckingAddressValidity: false,
      isFailedCheckingAddressValidity: false
    }
  },
  computed: {
    isBalanceValid() {
      const balance = this.currentWallet.balance
      return !!balance && balance !== '' && balance >= 0
    },
    isInvestmentValid() {
      const investment = this.currentWallet.investment
      return !investment || investment >= 0
    }
  },
  beforeMount() {
    const w = this.wallet
    this.currentWallet = new Wallet(
      w.coin,
      w.balance,
      w.address,
      w.isUsingLocalBalance,
      w.investment,
      w.id
    )
  },
  mounted() {
    this.$_preloadInterstitialAd()
  },
  methods: {
    ...mapActions('walletManager', ['insert', 'delete', 'update']),
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
        console.log('when is verifying address in WalletFormPage', e)
        this.isFailedCheckingAddressValidity = true
      } finally {
        this.isCheckingAddressValidity = false
      }
    },
    async insertOrUpdate() {
      if (this.isUpdating) {
        await this.update(this.currentWallet)
      } else {
        await this.insert(this.currentWallet)
      }
    },
    async saveWalletAndBackToHomePage() {
      await this.$_showInterstitialAd()

      if (this.currentWallet.isUsingLocalBalance) {
        if (this.isBalanceValid && this.isInvestmentValid) {
          await this.insertOrUpdate()
          this.navigateToHomePage()
        }
      } else {
        await this.verifyAddress()

        if (this.isAddressValid && this.isInvestmentValid) {
          await this.insertOrUpdate()
          this.navigateToHomePage()
        }
      }
    },
    navigateToHomePage() {
      this.$_navigateTo(App)
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
.WalletFormPage {
  .action-bar {
    background-color: $background;
    color: $onBackground;

    ActionItem {
      color: $onBackground;
      background-color: $background;
    }
  }

  .container {
    color: $onSurface;
    flex-direction: column;
    margin: 10;

    .title {
      align-items: center;
      font-weight: bold;
      background-color: $surface;
      font-size: $normal-font-size;
      margin-bottom: $separation-content;
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
