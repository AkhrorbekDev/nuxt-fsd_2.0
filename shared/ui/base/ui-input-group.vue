<script setup lang="ts"></script>

<template>
  <div class="ui-input-group">
    <div v-if="$slots?.before" class="before w-9">
      <slot name="before" />
    </div>

    <div v-if="$slots?.after" class="after w-9">
      <slot name="after" />
    </div>

    <slot />
  </div>
</template>

<style scoped>
:slotted(*) {
  @apply w-full;
}
</style>

<style>
.before ~ input,
.before ~ * input {
  @apply pl-9;
}

.after ~ input,
.after ~ * input {
  @apply pr-9;
}
</style>
