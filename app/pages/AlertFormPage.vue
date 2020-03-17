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
        <Image :src="coin.image" class="icon coinIcon" />
        <Label :text="coin.name" />
        <PriceLabel
          :value="coin.currentPrice"
          :currency="currency"
          class="price"
          data-test="wallet-price"
        />
      </FlexboxLayout>

      <InputField
        key="target-value"
        :is-valid="isTargetValueValid"
        :value="currentAlert.targetPrice"
        @value-did-change="currentAlert.targetPrice = $event"
        label="Target Price"
        keyboardType="number"
        hint="Number"
        label-error="Must be equal or greater than 0"
        data-test="input-target-value"
      />

      <FlexboxLayout class="note-container">
        <InputField
          key="note"
          :value="currentAlert.note"
          @value-did-change="currentAlert.note = $event"
          :is-optional="true"
          label="Note"
          data-test="input-note"
          input-type="TextView"
        />
      </FlexboxLayout>

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
import { Alert } from '@/models/Alert'
import PriceLabel from '@/components/PriceLabel'
import App from '@/App'
import { WalletMixin } from '@/mixins/WalletMixin'
import InputField from '@/components/InputField'
import { mapActions } from 'vuex'

export default {
  name: 'AlertFormPage',
  components: {
    PriceLabel,
    InputField
  },
  mixins: [WalletMixin],
  props: {
    alert: {
      type: Alert,
      required: true
    },
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
      isTargetValueValid: null
    }
  },
  beforeMount() {
    this.currentAlert = this.alert
  },
  methods: {
    ...mapActions('alertManager', ['insert', 'update', 'delete']),
    async deleteCoin() {
      await this.delete(this.alert.id)
      this.navigateToHomePageOnAlertsView()
    },
    async saveAlertIfValidAndBackToHomePage() {
      this.verifyTargetValue()

      if (this.isTargetValueValid) {
        await this.insertOrUpdate()
        this.navigateToHomePageOnAlertsView()
      }
    },
    async insertOrUpdate() {
      if (this.isUpdating) {
        await this.update(this.currentAlert)
      } else {
        await this.insert(this.currentAlert)
      }
    },
    verifyTargetValue() {
      const targetPrice = this.currentAlert.targetPrice
      this.isTargetValueValid =
        !!targetPrice && targetPrice !== '' && targetPrice >= 0
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

    .note-container {
      height: 50%;
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
