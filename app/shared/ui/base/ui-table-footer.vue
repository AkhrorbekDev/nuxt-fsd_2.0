<script setup lang="ts">
interface IProps {
  total: number
  page: number
  perPage: number
  range?: number
}

interface IEmits {
  (e: "update:page", value: number): void
  (e: "update:perPage", value: number): void
  (e: "change"): void
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const pageModel = computed({
  get() {
    return props.page
  },
  set(value: number) {
    emits("update:page", value)
  }
})

const perPageModel = computed({
  get() {
    return props.perPage
  },
  set(value: number) {
    emits("update:page", 0)
    emits("update:perPage", value)
  }
})
</script>

<template>
  <div class="ui-table-footer">
    <div class="app-container">
      <div class="ui-table-footer-content">
        <div class="ui-table-footer-left">
          <p class="text-sm leading-9">
            <strong>{{ total }}&nbsp;</strong>
            <span class="lowercase">{{ $t("labels.results") }}</span>
          </p>
        </div>

        <ui-pagination
          v-model="pageModel"
          :total="total"
          :per-page="perPageModel"
          @update:model-value="emits('change')"
        />

        <div v-if="total >= perPage" class="ui-table-footer-right">
          <ui-per-page
            v-model="perPageModel"
            :total="total"
            :range="range"
            :all-label="$t('labels.all')"
            @update:model-value="emits('change')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
