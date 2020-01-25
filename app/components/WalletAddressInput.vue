<template>
  <StackLayout class="WalletAddressInput">
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

    <Label class="or-separator" text="OR" />

    <Button
      @tap="scanQrCode"
      class="scanner-button"
      text="Scan QR code"
      data-test="scanner-button"
    />
  </StackLayout>
</template>
<script>
import InputField from '@/components/InputField'
import { BarcodeScanner } from 'nativescript-barcodescanner'
import * as camera from 'nativescript-camera'

export default {
  name: 'WalletAddressInput',
  components: { InputField },
  props: {
    address: {
      type: String,
      required: false,
      default: null
    },
    hasConnectionError: {
      type: Boolean,
      required: true
    },
    isValid: {
      type: Boolean,
      required: false,
      default: null
    },
    isCheckingAddress: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      connectionLabelError: 'Connection error',
      defaultLabelError: "Can't track wallet, check your address entry"
    }
  },
  computed: {
    labelError() {
      return this.hasConnectionError
        ? this.connectionLabelError
        : this.defaultLabelError
    }
  },
  methods: {
    async scanQrCode() {
      try {
        await camera.requestPermissions()
        this.scan()
      } catch (e) {
        console.log(e)
      }
    },
    async scan() {
      try {
        const result = await new BarcodeScanner().scan({ formats: 'QR_CODE' })
        this.$emit('address-did-change', result.text)
      } catch (errorMessage) {
        console.log('No scan. ' + errorMessage)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.WalletAddressInput {
  .or-separator {
    horizontal-alignment: center;
    margin-top: $separation-content;
    margin-bottom: $separation-content;
  }

  .scanner-button {
    background-color: $blue;
    width: 50%;
  }
}
</style>
