import {
  validateEmailFormat,
  validateMinMaxLength,
  validateRequired,
  validateURL,
} from '@wizard/utils/helpers'

export const contactEmailValidation = (
  email: string,
  fieldName: string,
  isRequired: boolean
) => {
  const errors = [
    ...(email
      ? validateMinMaxLength({
          values: email,
          minLength: 8,
          maxLength: 100,
          fieldName,
        })
      : [{ key: true, msg: '' }]),
    {
      key: !(email && !validateEmailFormat(email)),
      msg: `${fieldName} should be valid`,
    },
  ]
  if (isRequired) {
    return [...errors, ...validateRequired(email, fieldName)]
  }
  return errors
}

export const contactUrlValidation = (
  contactUrl: string,
  fieldName: string,
  isRequired: boolean
) => {
  const errors = [
    {
      key: !(contactUrl && !validateURL(contactUrl)),
      msg: `${fieldName} should be valid url`,
    },
  ]
  if (isRequired) {
    return [...errors, ...validateRequired(contactUrl, fieldName)]
  }
  return errors
}
