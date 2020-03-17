<template>
  <StackLayout class="AlertsView darkMode">
    <FlexboxLayout class="overview">
      <ActivityIndicator v-if="isLoading" :busy="isLoading" class="spinner" />
      <ErrorMessage
        v-else-if="isFailedToLoad"
        :is-failed-to-load="isFailedToLoad"
        data-test="error-message"
      />
      <label
        v-else-if="alerts.length === 0"
        text="Please add alerts"
        data-test="information-message"
      />

      <label
        v-else
        :text="`${alerts.length} Alerts`"
        data-test="information-message"
      />
    </FlexboxLayout>

    <grid-layout rows="auto, *">
      <StackLayout row="1">
        <ListView
          v-for="alert in sortedAlerts"
          @itemTap="navigateToAlertFormPage"
          automationText="alert-item"
        >
          <v-template>
            <FlexboxLayout class="alert">
              <Image :src="getCoin(alert.coinId).image" class="coinIcon" />
              <Label :text="getCoin(alert.coinId).name" class="coin-name" />
              <Label :text="alert.note" class="note" />
              <PriceLabel
                :value="alert.targetPrice"
                :currency="currency"
                class="target-price"
                data-test="target-price"
              />
            </FlexboxLayout>
          </v-template>
        </ListView>
      </StackLayout>
      <Fab
        @tap="navigateToCoinsPage"
        row="1"
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

export default {
  name: 'AlertsView',
  components: { ErrorMessage, PriceLabel },
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
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    ...mapActions('alertManager', ['selectAll']),
    getCoin(id) {
      return this.coins.find(coin => coin.id === id)
    },
    async fetchData() {
      this.isLoading = true
      this.isFailedToLoad = false

      try {
        await this.fetchAlerts()
      } catch (e) {
        console.log('when fetching data in AlertsView', e)
        this.isFailedToLoad = true
      } finally {
        this.isLoading = false
      }
    },
    async fetchAlerts() {
      // eslint-disable-next-line no-unused-vars
      const [_, coins] = await Promise.all([
        this.selectAll(),
        fetchCoinsMarket(this.currency)
      ])

      this.alerts = this.persistedAlertsFromDB.map(persistedAlert =>
        Alert.buildAlertFromPersistedAlert(persistedAlert)
      )
      this.coins = coins.filter(
        coin => !!this.alerts.find(alert => alert.coinId === coin.id)
      )
    },
    navigateToAlertFormPage(event) {
      const selectedAlert = this.sortedAlerts[event.index]
      this.$navigateTo(AlertFormPage, {
        props: {
          coin: this.getCoin(selectedAlert.coinId),
          currency: this.currency,
          alert: selectedAlert,
          isUpdating: true
        }
      })
    },
    navigateToCoinsPage() {
      this.$navigateTo(CoinsPage, {
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
      width: 30%;
    }

    .target-price {
      font-weight: bold;
      with: 10%;
      color: $primary;
      width: 30%;
      text-align: right;
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
