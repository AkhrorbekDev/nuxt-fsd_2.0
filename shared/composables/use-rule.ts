import {
  createI18nMessage,
  helpers,
  email,
  numeric,
  minLength,
  sameAs,
  required,
  requiredIf
} from "@vuelidate/validators"

const emailsRegex =
  /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/

const emails = {
  $validator: helpers.regex(emailsRegex),
  $message: "Value is not a valid email address",
  $params: {
    type: "emails"
  }
}

const vinPattern = /^-?[A-Z0-9]{17}$/

const vin = {
  $validator: helpers.regex(vinPattern),
  $message: "Invalid vin",
  $params: {
    type: "vin"
  }
}

export const useRule = () => {
  const i18n = useI18n()
  const withI18nMessage = createI18nMessage({ t: i18n.t.bind(i18n) })

  return {
    vin: withI18nMessage(vin),
    email: withI18nMessage(email),
    emails: withI18nMessage(emails),
    numeric: withI18nMessage(numeric),
    required: withI18nMessage(required),
    sameAs: withI18nMessage(sameAs, { withArguments: true }),
    minLength: withI18nMessage(minLength, { withArguments: true }),
    requiredIf: withI18nMessage(requiredIf, { withArguments: true })
  }
}
