<script setup lang="ts">
import { useLayoutStore } from "~/entities/layout"

const store = useLayoutStore()
</script>

<template>
  <div class="duration-300 ease-in-out" :class="store.contentLgMargin">
    <div class="app-content">
      <slot name="header" />

      <main>
        <slot />
      </main>

      <slot name="footer" />
    </div>
  </div>
</template>
