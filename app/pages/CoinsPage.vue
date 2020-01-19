<template>
  <Page class="CoinsPage darkMode">
    <ActionBar title="Select your coin" class="action-bar">
      <NavigationButton
        @tap="$navigateBack()"
        text="Go Back"
        android.systemIcon="ic_menu_back"
        data-test="back-button"
      />
    </ActionBar>

    <StackLayout>
      <ActivityIndicator v-if="isLoading" :busy="isLoading" class="spinner" />
      <ErrorMessage v-else-if="isFailedToLoad" />

      <template v-if="coins">
        <SearchBar
          ref="search-bar"
          v-model="searchQuery"
          hint="Search coin"
          class="search-bar"
        />

        <ListView v-for="coin in filteredCoins" @itemTap="navigateToWalletPage">
          <v-template>
            <FlexboxLayout class="coin">
              <Image :src="coin.image" class="coinIcon" />
              <Label :text="coin.name" class="name" data-test="name" />
              <Label
                v-if="$_canTrackAddress(coin.id)"
                text="Trackable"
                class="trackable"
                data-test="trackable"
              />
              <Label text=">" class="arrow" />
            </FlexboxLayout>
          </v-template>
        </ListView>

        <Label
          v-if="filteredCoins.length === 0"
          text="No coins found"
          class="no-coins-message"
          data-test="no-coins-message"
        />
      </template>
    </StackLayout>
  </Page>
</template>

<script>
import { fetchCoinsMarket } from '@/Api'
import ErrorMessage from '@/components/ErrorMessage'
import WalletPage from '@/pages/WalletPage'
import { Wallet } from '@/models/Wallet'
import { WalletMixin } from '@/mixins/WalletMixin'

export default {
  name: 'CoinsPage',
  components: { ErrorMessage },
  mixins: [WalletMixin],
  props: {
    currency: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      coins: null,
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
  async mounted() {
    await this.fetchCoinsMarket()
    this.clearSearchBarFocus()
  },
  methods: {
    clearSearchBarFocus() {
      this.$refs['search-bar'].nativeView.android.clearFocus()
    },
    navigateToWalletPage(event) {
      this.$navigateTo(WalletPage, {
        props: {
          wallet: new Wallet(this.filteredCoins[event.index]),
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
    background-color: $dark-grey;
    color: $white;
  }

  .search-bar {
    color: $blue;
    background-color: $white;
  }

  .coin {
    color: $white;
    flex-direction: row;
    height: 60;
    align-items: center;
    padding: 10;

    .name {
      margin-left: 10;
      flex-grow: 1;
    }

    .trackable {
      color: $success-color;
      margin-right: 30;
    }

    .arrow {
      text-align: right;
    }
  }

  .no-coins-message {
    font-size: $large-font-size;
    color: $white;
    text-align: center;
  }
}
</style>
