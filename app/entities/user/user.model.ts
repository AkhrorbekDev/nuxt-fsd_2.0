declare global {
  interface IModal {
    user: number
  }

  interface IUser {
    id: number
    name: string
    surname: string
    email: string
    phone: string
    role: string
    created_at: string
    updated_at: string
  }
}

export class User {
  id!: number
  role_id!: number
  name: string = ""
  surname: string = ""
  email: string = ""
  phone: string = ""
  password: string = ""
}
