<script setup lang="ts"></script>

<template>
  <nuxt-loading-indicator color="#2563eb" />
  <nuxt-route-announcer />

  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>

  <toaster close-button rich-colors invert position="top-right" />
</template>
