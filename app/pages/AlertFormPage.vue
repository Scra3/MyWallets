<template>
  <Page class="AlertFormPage darkMode">
    <ActionBar title="Edit Alert" class="action-bar">
      <NavigationButton
        @tap="$navigateBack()"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="back-button"
      />

      <ActionItem
        @tap="deleteCoin"
        :visibility="isUpdating ? 'visible' : 'collapse'"
        text="Delete"
        android.position="popup"
        data-test="delete-alert"
      />
    </ActionBar>

    <FlexboxLayout class="container">
      <FlexboxLayout class="title" data-test="title">
        <Image :src="currentCoin.image" class="icon coinIcon" />
        <Label :text="currentCoin.name" />
        <PriceLabel
          :value="currentCoin.currentPrice"
          :currency="currency"
          class="price"
          data-test="wallet-price"
        />
      </FlexboxLayout>

      <InputField
        key="input"
        :is-valid="isTargetValueValid"
        :value="targetValue"
        @value-did-change="targetValue = $event"
        label="Target Value"
        keyboardType="number"
        hint="Number"
        label-error="Must be equal or greater than 0"
        data-test="input-target-value"
      />

      <FlexboxLayout class="footer-container">
        <Button
          @tap="saveAlertIfValidAndBackToHomePage"
          :text="isUpdating ? 'Update Alert' : 'Save Alert'"
          class="save-button"
          data-test="save-button"
          automationText="save-button"
        />
      </FlexboxLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import { Coin } from '@/models/Coin'
import PriceLabel from '@/components/PriceLabel'
import App from '@/App'
import { WalletMixin } from '@/mixins/WalletMixin'
import InputField from '@/components/InputField'

export default {
  name: 'AlertFormPage',
  components: {
    PriceLabel,
    InputField
  },
  mixins: [WalletMixin],
  props: {
    coin: {
      type: Coin,
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
      currentCoin: null,
      targetValue: null,
      isTargetValueValid: null
    }
  },
  beforeMount() {
    this.currentCoin = this.coin
  },
  methods: {
    deleteCoin() {
      this.navigateToHomePageOnAlertsView()
    },
    saveAlertIfValidAndBackToHomePage() {
      this.verifyTargetValue()

      if (this.isTargetValueValid === true) {
        this.navigateToHomePageOnAlertsView()
      }
    },
    verifyTargetValue() {
      this.isTargetValueValid =
        !!this.targetValue && this.targetValue !== '' && this.targetValue >= 0
    },
    navigateToHomePageOnAlertsView() {
      this.$navigateTo(App, {
        props: {
          defaultSelectedViewIndex: 2
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.AlertFormPage {
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
