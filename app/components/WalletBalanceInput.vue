<template>
  <InputField
    key="balance"
    :value="balance"
    :is-valid="isValid"
    @value-did-change="$emit('balance-did-change', $event)"
    label="Total Balance"
    label-error="Must be greater than 0 and not be blank"
    hint="Number"
    keyboardType="number"
  />
</template>

<script>
import InputField from '@/components/InputField'

export default {
  name: 'WalletBalanceInput',
  components: { InputField },
  props: {
    balance: {
      type: [String, Number],
      required: false,
      default: null
    },
    isValid: {
      type: Boolean,
      required: false,
      default: null
    }
  }
}
</script>
