<template>
  <StackLayout class="AlertsView darkMode">
    <FlexboxLayout
      v-if="sortedAlerts.length > 0 && isFailedToLoad"
      class="overview"
    >
      <ErrorMessage
        :is-failed-to-load="isFailedToLoad"
        data-test="error-message"
      />
    </FlexboxLayout>

    <grid-layout rows="auto, *">
      <StackLayout v-if="sortedAlerts.length > 0" row="1" class="alerts">
        <FlexboxLayout class="header">
          <Label text="Name" />
          <Label text="Note" />
          <Label text="Target Price" />
        </FlexboxLayout>
        <ListView
          v-for="alert in sortedAlerts"
          @itemTap="navigateToAlertFormPage"
          automationText="alert-item"
        >
          <v-template>
            <FlexboxLayout class="alert" data-test="alert">
              <Image :src="getCoin(alert.coinId).image" class="coinIcon" />
              <Label
                :text="getCoin(alert.coinId).name"
                class="coin-name"
                data-test="alert-coin-name"
              />
              <Label :text="alert.note" class="note" />
              <PriceLabel
                :value="Number(alert.targetPrice)"
                :currency="currency"
                class="target-price"
                data-test="target-price"
              />
            </FlexboxLayout>
          </v-template>
        </ListView>
      </StackLayout>
      <LoadingMessage
        v-else-if="isLoading"
        row="1"
        sub-title="Please wait, we are fetching Alerts."
        title="Processing"
      />
      <EmptyListMessage
        v-else
        row="1"
        title="Empty alert list"
        sub-title="Save an alert and it will show up here."
        data-test="information-message"
      />
      <Fab
        @tap="navigateToCoinsPage"
        row="2"
        automationText="add-alert-button"
        class="fab-button"
      >
        +
      </Fab>
    </grid-layout>
  </StackLayout>
</template>

<script>
import CoinsPage from '@/pages/CoinsPage'
import { mapActions, mapState } from 'vuex'
import { Alert } from '@/models/Alert'
import ErrorMessage from '@/components/ErrorMessage'
import AlertFormPage from '@/pages/AlertFormPage'
import { fetchCoinsMarket } from '@/Api'
import PriceLabel from '@/components/PriceLabel'
import EmptyListMessage from '@/components/EmptyListMessage'
import LoadingMessage from '@/components/LoadingMessage'
import { NavigationMixin } from '@/mixins/NavigationMixin'

export default {
  name: 'AlertsView',
  components: { LoadingMessage, ErrorMessage, PriceLabel, EmptyListMessage },
  mixins: [NavigationMixin],
  props: {
    currency: {
      type: Object,
      required: true
    }
  },
  data() {
    return { alerts: [], isLoading: false, isFailedToLoad: false, coins: [] }
  },
  computed: {
    ...mapState('alertManager', ['persistedAlerts']),
    sortedAlerts() {
      return [...this.alerts].sort((a, b) => (a.coinId > b.coinId ? 1 : -1))
    },
    persistedAlertsFromDB() {
      return this.persistedAlerts || []
    }
  },
  watch: {
    currency() {
      this.fetchData()
    },
    async persistedAlertsFromDB() {
      try {
        await this.fetchAlerts()
      } catch (e) {
        console.log('when fetching data in AlertsView', e)
        this.isFailedToLoad = true
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    ...mapActions('alertManager', ['selectAll']),
    getCoin(id) {
      return this.coins.find(coin => coin.id === id) || {}
    },
    async fetchData() {
      this.isLoading = true
      this.isFailedToLoad = false

      try {
        await this.selectAll()
        await this.fetchAlerts()
      } catch (e) {
        console.log('when fetching data in AlertsView', e)
        this.isFailedToLoad = true
      } finally {
        this.isLoading = false
      }
    },
    async fetchAlerts() {
      const coins = await fetchCoinsMarket(this.currency)
      this.alerts = this.persistedAlertsFromDB.map(persistedAlert =>
        Alert.buildAlertFromPersistedAlert(persistedAlert)
      )
      this.coins = coins.filter(
        coin => !!this.alerts.find(alert => alert.coinId === coin.id)
      )
    },
    navigateToAlertFormPage(event) {
      const selectedAlert = this.sortedAlerts[event.index]
      this.$_navigateTo(AlertFormPage, {
        props: {
          coin: this.getCoin(selectedAlert.coinId),
          currency: this.currency,
          alert: selectedAlert,
          isUpdating: true
        }
      })
    },
    navigateToCoinsPage() {
      this.$_navigateTo(CoinsPage, {
        props: {
          currency: this.currency,
          isConnectableTagDisplayed: false,
          navigateTo: 'AlertFormPage'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.AlertsView {
  .overview {
    justify-content: center;
    align-items: center;
    padding: $separation-content;
    border-radius: $border-radius;
    height: 120;
    font-size: $large-font-size;
    background-color: $surface;
    margin: $separation-content;
  }

  .header {
    font-weight: bold;
    justify-content: space-between;
    padding: $separation-content;
  }

  .alerts {
    padding: $separation-content;

    .alert {
      justify-content: space-between;
      align-items: center;
      background-color: $surface;
      border-radius: $border-radius;
      padding: $separation-content;
      width: auto;
      color: $onSurface;

      .price {
        color: $onSurface;
      }

      .coin-name {
        width: 20%;
        text-align: left;
      }

      .note {
        text-overflow: ellipsis;
        width: 40%;
      }

      .target-price {
        font-weight: bold;
        color: $primary;
        width: 20%;
        text-align: right;
      }
    }
  }

  .fab-button {
    height: 60;
    width: 50;
    margin: 15;
    background-color: $secondary;
    horizontal-align: right;
    vertical-align: bottom;
    color: $onSecondary;
  }
}
</style>
