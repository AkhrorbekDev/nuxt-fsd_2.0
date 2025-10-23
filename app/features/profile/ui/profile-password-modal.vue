<script setup lang="ts">
import { useProfileService } from "~/features/profile"
import { ProfilePassword } from "~/entities/profile"

const { t } = useI18n()
const { required, minLength, sameAs } = useRule()
const { changeProfilePassword } = useProfileService()

const loading = ref(false)
const form = ref(new ProfilePassword())

const rules = ref({
  old_password: { required, minLength: minLength(8) },
  new_password: { required, minLength: minLength(8) },
  confirm_password: {
    required,
    minLength: minLength(8),
    sameAs: sameAs(
      computed(() => form.value.new_password),
      t("labels.new_password")
    )
  }
})

const { vuelidate, hasError } = useValidate(form, rules)

const onHide = () => {
  loading.value = false
  form.value = new ProfilePassword()
  vuelidate.value?.$reset()
}

const onSubmit = async () => {
  const isValid = await vuelidate.value?.$validate()
  if (isValid) changeProfilePassword(form, loading)
}
</script>

<template>
  <ui-modal id="profile-password" :label="$t('actions.change_password')" :loading @hide="onHide">
    <div class="grid gap-4 p-4">
      <ui-form-group v-slot="{ id }" v-bind="hasError('old_password')" required :label="$t('labels.current_password')">
        <ui-password-input v-model="form.old_password" autocomplete="new-password" :id />
      </ui-form-group>

      <ui-form-group v-slot="{ id }" v-bind="hasError('new_password')" required :label="$t('labels.new_password')">
        <ui-password-input v-model="form.new_password" autocomplete="new-password" :id />
      </ui-form-group>

      <ui-form-group
        v-slot="{ id }"
        v-bind="hasError('confirm_password')"
        required
        :label="$t('labels.confirm_password')"
      >
        <ui-password-input v-model="form.confirm_password" autocomplete="new-password" :id />
      </ui-form-group>
    </div>

    <template #footer="{ hide }">
      <div class="ui-modal-footer">
        <ui-button variant="white" color="secondary" :label="$t('actions.cancel')" @click="hide" />
        <ui-button :label="$t('actions.save')" @click="onSubmit" />
      </div>
    </template>
  </ui-modal>
</template>
