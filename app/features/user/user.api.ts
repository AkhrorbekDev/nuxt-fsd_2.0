import { User } from "~/entities/user"

export const useUserApi = () => {
  const BASE_URL = "/user"
  const { $http } = useNuxtApp()

  const getUserList = (params: Record<string, any>): AsyncResponseContainer<IUser[]> => {
    return $http.$get(BASE_URL, { params })
  }

  const getUserById = (id: number): AsyncResponseContainer<User> => {
    return $http.$get(`${BASE_URL}/${id}`)
  }

  const createUser = (payload: User): AsyncResponseContainer<IUser> => {
    return $http.$post(BASE_URL, payload)
  }

  const updateUser = (payload: User): AsyncResponseContainer<IUser> => {
    return $http.$put(`${BASE_URL}/${payload.id}`, payload)
  }

  const deleteUser = (id: number): AsyncResponseContainer => {
    return $http.$delete(`${BASE_URL}/${id}`)
  }

  return {
    getUserList,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  }
}
