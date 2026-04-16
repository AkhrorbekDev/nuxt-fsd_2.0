<script setup lang="ts">
import { useUserService } from "~/features/user"
import { User } from "~/entities/user"
import { RoleSelect } from "~/features/role"

const { t } = useI18n()
const { required, requiredIf, email, minLength } = useRule()
const { getUser, saveUser } = useUserService()

const editing = ref(false)
const loading = ref(false)
const form = ref(new User())

const rules = ref({
  name: { required },
  surname: { required },
  email: { required, email },
  phone: { required },
  role_id: { required },
  password: { requiredIf: requiredIf(() => !editing.value), minLength: minLength(8) }
})

const { vuelidate, hasError } = useValidate(form, rules)

const label = computed(() => (editing.value ? t("actions.edit") : t("actions.add")))

const onBeforeShow = (id: number) => {
  if (id) {
    editing.value = true
    getUser(id, form, loading)
  }
}

const onHide = () => {
  editing.value = false
  loading.value = false
  form.value = new User()
  vuelidate.value.$reset()
}

const onSave = async () => {
  const isValid = await vuelidate.value.$validate()
  if (isValid) saveUser(form, loading)
}
</script>

<template>
  <ui-modal
    id="user"
    :label="label"
    :loading="loading"
    :close-on-backdrop="false"
    @before-show="onBeforeShow"
    @hide="onHide"
  >
    <div class="grid grid-cols-1 gap-4 p-4">
      <ui-form-group v-slot="{ id }" v-bind="hasError('name')" required :label="$t('labels.first_name')">
        <ui-input v-model="form.name" :id />
      </ui-form-group>

      <ui-form-group v-slot="{ id }" v-bind="hasError('surname')" required :label="$t('labels.last_name')">
        <ui-input v-model="form.surname" :id />
      </ui-form-group>

      <ui-form-group v-slot="{ id }" v-bind="hasError('email')" required :label="$t('labels.email')">
        <ui-input v-model="form.email" :id />
      </ui-form-group>

      <ui-form-group v-slot="{ id }" v-bind="hasError('phone')" required :label="$t('labels.phone')">
        <ui-mask-input v-model="form.phone" mask="+### (##) ###-##-##" :id />
      </ui-form-group>

      <ui-form-group v-slot="{ id }" v-bind="hasError('role_id')" required :label="$t('labels.role')">
        <role-select v-model="form.role_id" append-to-body :id />
      </ui-form-group>

      <ui-form-group
        v-if="!editing"
        v-slot="{ id }"
        v-bind="hasError('password')"
        required
        :label="$t('labels.password')"
      >
        <ui-password-input v-model="form.password" autocomplete="new-password" :id />
      </ui-form-group>
    </div>

    <template #footer="{ hide }">
      <div class="ui-modal-footer">
        <ui-button variant="white" color="secondary" :label="$t('actions.cancel')" @click="hide" />
        <ui-button :label="$t('actions.save')" @click="onSave" />
      </div>
    </template>
  </ui-modal>
</template>
