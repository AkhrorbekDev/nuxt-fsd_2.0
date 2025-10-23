<script setup lang="ts">
import { useUserService } from "~/features/user"

interface IProps {
  id: number
  name: string
}

const props = defineProps<IProps>()

const modal = useModal()
const { deleteUser } = useUserService()

const showUserModal = () => modal.show("user", props.id)
</script>

<template>
  <ui-button-group>
    <ui-icon-button
      size="sm"
      variant="white"
      color="secondary"
      icon-class="text-xl"
      icon-name="lucide:pencil-line"
      :label="$t('actions.edit')"
      @click="showUserModal"
    />

    <ui-icon-button
      size="sm"
      variant="white"
      color="danger"
      icon-class="text-lg"
      icon-name="lucide:trash-2"
      :label="$t('actions.delete')"
      @click="deleteUser(id, name)"
    />
  </ui-button-group>
</template>
