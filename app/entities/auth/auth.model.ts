declare global {
  interface ISignIn {
    profile: ISessionProfile
    token: string
  }
}

export class SignIn {
  hash: string = ""
  email: string = ""
  password: string = ""
}

export class ForgotPassword {
  hash: string = ""
  email: string = ""
}
