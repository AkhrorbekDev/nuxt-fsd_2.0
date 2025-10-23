<script setup lang="ts">
import { useRoleService } from "~/features/role"
import { Role } from "~/entities/role"

const { t } = useI18n()
const { required } = useRule()
const { getRole, saveRole } = useRoleService()

const editing = ref(false)
const loading = ref(false)
const form = ref(new Role())

const rules = ref({
  name: { required },
  description: { required }
})

const { vuelidate, hasError } = useValidate(form, rules)

const label = computed(() => (editing.value ? t("actions.edit") : t("actions.add")))

const onBeforeShow = (id: number) => {
  if (id) {
    editing.value = true
    getRole(id, form, loading)
  }
}

const onHide = () => {
  editing.value = false
  loading.value = false
  form.value = new Role()
  vuelidate.value.$reset()
}

const onSave = async () => {
  const isValid = await vuelidate.value.$validate()
  if (isValid) saveRole(form, loading)
}
</script>

<template>
  <ui-modal
    id="role"
    :label="label"
    :loading="loading"
    :close-on-backdrop="false"
    @before-show="onBeforeShow"
    @hide="onHide"
  >
    <div class="grid grid-cols-1 gap-4 p-4">
      <ui-form-group v-slot="{ id }" v-bind="hasError('name')" required :label="$t('labels.name')">
        <ui-input v-model="form.name" :id />
      </ui-form-group>

      <ui-form-group v-slot="{ id }" v-bind="hasError('description')" required :label="$t('labels.description')">
        <ui-textarea v-model="form.description" rows="4" :id />
      </ui-form-group>

      <!-- TODO: Permissions -->
    </div>

    <template #footer="{ hide }">
      <div class="ui-modal-footer">
        <ui-button variant="white" color="secondary" :label="$t('actions.cancel')" @click="hide" />
        <ui-button :label="$t('actions.save')" @click="onSave" />
      </div>
    </template>
  </ui-modal>
</template>
