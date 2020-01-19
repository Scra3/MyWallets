<template>
  <InputField
    key="address"
    :value="address"
    :is-valid="isValid"
    @value-did-change="$emit('address-did-change', $event)"
    :is-checking="isCheckingAddress"
    :label-error="labelError"
    label="Public wallet address"
    hint="Address"
  />
</template>
<script>
import { WalletMixin } from '@/mixins/WalletMixin'
import InputField from '@/components/InputField'

export default {
  name: 'WalletAddressInput',
  components: { InputField },
  mixins: [WalletMixin],
  props: {
    address: {
      type: String,
      required: false,
      default: null
    },
    coinId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isValid: null,
      isCheckingAddress: false,
      isFailedVerification: false,
      connectionLabelError: 'Connection error',
      defaultLabelError: "Can't track wallet, check your address entry"
    }
  },
  computed: {
    labelError() {
      return this.isFailedVerification
        ? this.connectionLabelError
        : this.defaultLabelError
    }
  },
  watch: {
    address() {
      this.checkInputValidity()
    }
  },
  methods: {
    async checkInputValidity() {
      this.isCheckingAddress = true
      this.$emit('is-checking-address-validity', this.isCheckingAddress)

      this.isFailedVerification = false
      this.isValid = null

      try {
        if (this.address) {
          this.isValid = await this.$_checkAddressValidity(
            this.address,
            this.coinId
          )
        } else {
          this.isValid = false
        }
      } catch (e) {
        this.isFailedVerification = true
      } finally {
        this.$emit('is-address-valid', this.isValid)

        this.isCheckingAddress = false
        this.$emit('is-checking-address-validity', this.isCheckingAddress)
      }
    }
  }
}
</script>
