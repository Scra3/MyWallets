<template>
  <FlexboxLayout class="WalletSwitch" data-test="switch-container">
    <Button
      :class="{ selected: !wallet.isUsingLocalBalance }"
      @tap="$emit('is-balance-mode-did-tap', false)"
      class="switch-label"
      text="Track wallet"
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

    <Button
      :class="{ selected: wallet.isUsingLocalBalance }"
      @tap="$emit('is-balance-mode-did-tap', true)"
      text="Set balance manually"
      data-test="balance-label"
      class="switch-label"
    />
  </FlexboxLayout>
</template>

<script>
import { Wallet } from '@/models/Wallet'

export default {
  name: 'WalletSwitch',
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
  margin-bottom: 30;

  .switch {
    background-color: $onBackground;
    color: $secondary;
  }

  .switch-label {
    background-color: transparent;
    border-width: 0;
    border-color: transparent;
    z-index: 0;
    margin: 0;
    padding: 0;
    font-size: $small-font-size;
  }

  .selected {
    color: $secondary;
    font-weight: bold;
  }
}
</style>
