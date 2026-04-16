declare global {
  interface IModal {
    "profile": void
    "profile-password": void
  }
}

export class Profile {
  id!: number
  name: string = ""
  surname: string = ""
  email: string = ""
  phone: string = ""
  password: string = ""

  constructor(data?: Partial<Profile>) {
    if (data) Object.assign(this, data)
  }
}

export class ProfilePassword {
  old_password: string = ""
  new_password: string = ""
  confirm_password: string = ""
}
