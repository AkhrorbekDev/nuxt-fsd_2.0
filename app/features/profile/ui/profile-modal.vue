<script setup lang="ts">
import { useProfileService } from "~/features/profile"
import { Profile } from "~/entities/profile"

const { required } = useRule()
const { $session } = useNuxtApp()
const { saveProfile } = useProfileService()

const loading = ref(false)
const form = ref(new Profile())
const rules = ref({ name: { required }, surname: { required }, phone: { required } })

const { vuelidate, hasError } = useValidate(form, rules)

const onShow = () => {
  form.value = new Profile($session.profile.value)
}

const onHide = () => {
  loading.value = false
  form.value = new Profile($session.profile.value)
  vuelidate.value?.$reset()
}

const onSubmit = async () => {
  const isValid = await vuelidate.value?.$validate()
  if (isValid) saveProfile(form, loading)
}
</script>

<template>
  <ui-modal id="profile" :label="$t('labels.profile')" :loading @show="onShow" @hide="onHide">
    <div class="grid gap-4 p-4">
      <ui-form-group v-slot="{ id }" v-bind="hasError('name')" required :label="$t('labels.first_name')">
        <ui-input v-model="form.name" :id="id" />
      </ui-form-group>

      <ui-form-group v-slot="{ id }" v-bind="hasError('surname')" required :label="$t('labels.last_name')">
        <ui-input v-model="form.surname" :id="id" />
      </ui-form-group>

      <ui-form-group v-slot="{ id }" v-bind="hasError('phone')" required :label="$t('labels.phone')">
        <ui-mask-input v-model="form.phone" mask="+### (##) ###-##-##" :id />
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
