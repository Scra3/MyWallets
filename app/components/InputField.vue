<template>
  <StackLayout class="Input">
    <FlexboxLayout :class="{ optional: isOptional }">
      <Label :text="label" />
      <Label v-if="isOptional" text="(Optional)" />
    </FlexboxLayout>
    <FlexboxLayout>
      <TextField
        v-model="currentValue"
        @textChange="$emit('value-did-change', $event.value)"
        @blur="$emit('input-did-unfocus', $event.value)"
        :class="{
          error: isValid === false,
          success: isValid === true
        }"
        :keyboardType="keyboardType"
        :hint="hint"
        class="text-field"
        data-test="input"
        automationText="text-field"
      />
      <Label
        v-if="isValid === false"
        text="✖"
        class="failed-icon"
        data-test="failed-icon"
      />

      <Label
        v-if="isValid === true"
        text="✓"
        class="success-icon"
        data-test="success-icon"
      />

      <ActivityIndicator v-if="isChecking" :busy="isChecking" class="spinner" />
    </FlexboxLayout>

    <Label
      v-if="isValid === false"
      :text="labelError"
      class="label-error"
      data-test="label-error"
    />
  </StackLayout>
</template>
<script>
export default {
  name: 'InputField',
  props: {
    value: {
      type: [String, Number],
      required: false,
      default: null
    },
    isOptional: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    labelError: {
      type: String,
      required: false,
      default: null
    },
    isValid: {
      type: Boolean,
      default: null,
      required: false
    },
    isChecking: {
      type: Boolean,
      default: null,
      required: false
    },
    hint: {
      type: String,
      required: false,
      default: null
    },
    keyboardType: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      currentValue: null
    }
  },
  beforeMount() {
    this.currentValue = this.value
  }
}
</script>

<style lang="scss" scoped>
.Input {
  padding: $separation-content;
  background-color: $surface;
  margin-top: 2 * $separation-content;

  .optional {
    justify-content: space-between;
  }

  .text-field {
    width: 100%;
    color: $onSurface;
    placeholder-color: $onSurfaceMediumEmphasis;

    &.error {
      border-color: $error;
    }

    &.success {
      border-color: $secondary;
    }
  }

  .success-icon {
    color: $secondary;
    width: 40;
    align-self: center;
  }

  .failed-icon {
    color: $error;
    width: 40;
    align-self: center;
  }

  .label-error {
    color: $error;
    margin-left: $separation-content;
    margin-bottom: $separation-content;
  }
}
</style>
