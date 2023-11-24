import {
  Registration,
  RegistrationWithUndefined,
} from '@wizard/models/onBoard.model'
import {
  checkEmptyValue,
  validateAlphaNumericFormat,
} from '@wizard/utils/helpers'

export const legalRegistrationTypeValidation = (name: string) => {
  if (checkEmptyValue(name)) {
    return 'Legal registration type is required'
  }
  return
}

export const legalRegistrationNumberValidation = (name: string) => {
  if (checkEmptyValue(name)) {
    return 'Legal registration number is required'
  } else if (!validateAlphaNumericFormat(name)) {
    return 'Legal registration number is invalid'
  } else {
    return
  }
}

// On Boarding Array form func
export const validateRegistrations = (registrations: Registration[]) => {
  if (registrations?.length) {
    const actualErrors: RegistrationWithUndefined[] = []
    registrations.forEach((item) => {
      const errors: RegistrationWithUndefined = {}
      errors['legalRegistrationType'] = legalRegistrationTypeValidation(
        item.legalRegistrationType
      )
      errors['legalRegistrationNumber'] = legalRegistrationNumberValidation(
        item.legalRegistrationNumber
      )
      actualErrors.push(errors)
    })

    return { fieldValidation: actualErrors }
  } else {
    return null
  }
}
