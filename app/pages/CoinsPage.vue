<template>
  <Page class="CoinsPage darkMode">
    <ActionBar title="Select your coin" class="action-bar">
      <NavigationButton
        @tap="$navigateBack"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="back-button"
      />
    </ActionBar>

    <StackLayout>
      <SearchBar v-model="searchQuery" hint="Search coin" class="search-bar" />
      <ActivityIndicator v-if="isLoading" :busy="isLoading" class="spinner" />
      <ErrorMessage v-else-if="isFailedToLoad" />
      <ListView @itemTap="handlerTapItem" v-for="coin in filteredCoins">
        <v-template>
          <FlexboxLayout class="coin">
            <Image :src="coin.image" class="coinIcon" />
            <Label :text="coin.name" class="name" data-test="name" />
            <Label
              v-if="$_canConnectAddress(coin.id) && isConnectableTagDisplayed"
              text="Connectable"
              class="connectable"
              data-test="connectable"
            />
            <Label text="›" class="arrow" />
          </FlexboxLayout>
        </v-template>
      </ListView>

      <Label
        v-if="filteredCoins.length === 0 && isLoading === false"
        text="No coins found"
        class="no-coins-message"
        data-test="no-coins-message"
      />
    </StackLayout>
  </Page>
</template>

<script>
import { fetchCoinsMarket } from '@/Api'
import ErrorMessage from '@/components/ErrorMessage'
import WalletFormPage from '@/pages/WalletFormPage'
import AlertFormPage from '@/pages/AlertFormPage'
import { Wallet } from '@/models/Wallet'
import { Alert } from '@/models/Alert'
import { WalletMixin } from '@/mixins/WalletMixin'
import { NavigationMixin } from '@/mixins/NavigationMixin'

export default {
  name: 'CoinsPage',
  components: { ErrorMessage },
  mixins: [WalletMixin, NavigationMixin],
  props: {
    currency: {
      type: Object,
      required: true
    },
    isConnectableTagDisplayed: {
      type: Boolean,
      required: false,
      default: true
    },
    navigateTo: {
      type: String,
      required: false,
      default: 'WalletFormPage'
    }
  },
  data() {
    return {
      coins: [],
      isLoading: true,
      isFailedToLoad: false,
      searchQuery: ''
    }
  },
  computed: {
    filteredCoins() {
      return this.coins.filter(
        coin =>
          coin.name.toUpperCase().includes(this.searchQuery.toUpperCase()) ||
          coin.symbol.toUpperCase().includes(this.searchQuery.toUpperCase())
      )
    }
  },
  mounted() {
    this.fetchCoinsMarket()
  },
  methods: {
    handlerTapItem(event) {
      const coin = this.filteredCoins[event.index]
      if (this.navigateTo === 'WalletFormPage') {
        this.navigateToWalletFormPage(coin)
      } else if (this.navigateTo === 'AlertFormPage') {
        this.navigateToAlertFormPage(coin)
      }
    },
    navigateToAlertFormPage(coin) {
      this.$_navigateTo(AlertFormPage, {
        props: {
          coin: coin,
          currency: this.currency,
          alert: new Alert(null, null, coin.currentPrice, coin.id)
        }
      })
    },
    navigateToWalletFormPage(coin) {
      this.$_navigateTo(WalletFormPage, {
        props: {
          wallet: new Wallet(coin),
          currency: this.currency
        }
      })
    },
    async fetchCoinsMarket() {
      try {
        this.isFailedToLoad = false
        this.isLoading = true
        this.coins = await fetchCoinsMarket(this.currency)
      } catch (e) {
        console.log('when fetching coins market in CoinsPage', e)
        this.isFailedToLoad = true
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.CoinsPage {
  .action-bar {
    background-color: $background;
    color: $onBackground;
  }

  .search-bar {
    color: $onSurface;
    background-color: $surface;
    margin-bottom: $separation-content;
    text-field-hint-color: $onSurface;
  }

  .coin {
    color: $onSurface;
    background-color: $surface;
    border-radius: $border-radius;
    flex-direction: row;
    height: 60;
    align-items: center;
    padding: 10;

    .name {
      margin-left: 10;
      flex-grow: 1;
    }

    .connectable {
      color: $secondary;
      margin-right: 30;
    }

    .arrow {
      text-align: right;
      font-size: 30;
    }
  }

  .no-coins-message {
    font-size: $normal-font-size;
    color: $onSurface;
    text-align: center;
  }
}
</style>
