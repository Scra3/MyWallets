<template>
  <FlexboxLayout class="WalletSwitch" data-test="switch-container">
    <TappableLabel
      :class="{ selected: !wallet.isUsingLocalBalance }"
      @tap="$emit('is-balance-mode-did-tap', false)"
      text="Connect wallet"
      data-test="address-label"
    />

    <Switch
      v-model="wallet.isUsingLocalBalance"
      @checkedChange="
        $emit('is-balance-mode-did-tap', wallet.isUsingLocalBalance)
      "
      class="switch"
      data-test="switch"
    />

    <TappableLabel
      :class="{ selected: wallet.isUsingLocalBalance }"
      @tap="$emit('is-balance-mode-did-tap', true)"
      text="Set balance manually"
      data-test="balance-label"
    />
  </FlexboxLayout>
</template>

<script>
import { Wallet } from '@/models/Wallet'
import TappableLabel from './TappableLabel'

export default {
  name: 'WalletSwitch',
  components: { TappableLabel },
  props: {
    wallet: {
      type: Wallet,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.WalletSwitch {
  align-items: center;
  justify-content: flex-end;
  margin-bottom: $separation-content * 2;

  .switch {
    background-color: $onBackground;
    color: $secondary;
  }

  .selected {
    color: $secondary;
    font-weight: bold;
  }
}
</style>
