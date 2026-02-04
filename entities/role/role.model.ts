declare global {
  interface IModal {
    role: number
  }

  interface IRole {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
    permissions: string[]
  }
}

export class Role {
  id!: number
  name: string = ""
  description: string = ""
  permissions: string[] = []
}
