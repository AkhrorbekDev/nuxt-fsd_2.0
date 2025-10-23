<script setup lang="ts">
import { useAuthService } from "~/features/auth"
import { SignIn } from "~/entities/auth"

const authService = useAuthService()

const { required, email, minLength } = useRule()

const loading = ref(false)
const form = ref<SignIn>(new SignIn())

const rules = ref({
  email: { required, email },
  password: { required, minLength: minLength(5) }
})

const { vuelidate, hasError } = useValidate(form, rules)

const onSubmit = async () => {
  const isValid = await vuelidate.value.$validate()
  if (isValid) await authService.signIn(form, loading)
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="onSubmit">
    <ui-form-group v-bind="hasError('email')" v-slot="{ id }" :label="$t('labels.email')">
      <ui-input-group>
        <template #before>
          <icon class="ml-1 text-lg text-gray-400" name="lucide:mail" />
        </template>

        <ui-input v-model="form.email" autofocus tabindex="1" :id :placeholder="$t('placeholders.enter_email')" />
      </ui-input-group>
    </ui-form-group>

    <ui-form-group v-bind="hasError('password')" v-slot="{ id }" class="mb-2" :label="$t('labels.password')">
      <ui-input-group>
        <template #before>
          <icon class="ml-0.5 text-lg text-gray-400" name="lucide:lock" />
        </template>

        <ui-password-input v-model="form.password" tabindex="2" :id :placeholder="$t('placeholders.enter_password')" />
      </ui-input-group>
    </ui-form-group>

    <ui-button
      tabindex="3"
      type="submit"
      :label="$t('actions.sign_in')"
      :loading="loading"
      :disabled="vuelidate.$error"
    />
  </form>
</template>
