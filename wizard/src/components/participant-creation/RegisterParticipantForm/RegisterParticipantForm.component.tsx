import arrayMutators from 'final-form-arrays'
import RegisterParticipantFormStyled from './RegisterParticipantForm.module.scss'

import { CHIPS_OPTIONS } from '@wizard/utils/constants'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Field, Form } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { OnBoardingFormProps, RegisterForm } from '@wizard/models/onBoard.model'
import { ROUTES_CONST } from '@wizard/routes/routes'
import { useState } from 'react'
import { ValuesType } from '@wizard/models/base.model'
import {
  AddMoreIcon,
  AsyncSearchSelect,
  Button,
  Checkbox,
  CrossIcon,
  Dialog,
  InputChips,
  InputField,
  Select,
} from '@gaia-x-frontend/components-lib'
import {
  RegisterParticipantRequest,
  registerParticipant,
} from '@wizard/api/auth.api'
import {
  validationCheck,
  validateEmail,
  onLoadSubDivisions,
  removeEmptyFields,
  validateRequired,
  validateUrlChip,
  AsyncReqParam,
  validateAlphaNumeric,
} from '@wizard/utils/helpers'
import { REGISTRATION_TYPE_VC_KEY } from './RegisterParticipantForm.constants'
import { validateRegistrations } from './RegisterParticipantForm.validation'

const initialFormState: RegisterForm = {
  email: '',
  legalName: '',
  shortName: '',
  registrations: [{ legalRegistrationType: '', legalRegistrationNumber: '' }],
  entityType: '',
  parentOrganization: [],
  subOrganization: [],
  headquartersAddress: null,
  legalAddress: null,
  sameAddress: false,
  ownDid: false,
  accept: false,
}

const RegisterParticipantForm = ({
  registrationTypes,
  entityTypes,
}: OnBoardingFormProps) => {
  const navigate = useNavigate()
  const [openDialog, setOpenDialog] = useState(false)
  const [isAcceptTermsCondition, setIsAcceptTermsCondition] = useState(false)
  const [sameAddress, setSameAddress] = useState(false)
  const defaultDivisionFilterParams: AsyncReqParam = {
    page: -1,
    size: 20,
    criteriaOperator: 'OR',
  }
  const onCheckboxChange = () => {
    if (isAcceptTermsCondition) {
      setIsAcceptTermsCondition(false)
    } else {
      setOpenDialog(true)
    }
  }

  const formValidate = (values: RegisterForm) => {
    const params = {
      email: validateEmail(values['email']),
      legalName: validateRequired(values['legalName'], 'Legal Name'),
      shortName: validateAlphaNumeric(values['shortName'], 'Short Name', true),
      registrations: validateRegistrations(values['registrations']),
      parentOrganization: validateUrlChip(
        values['parentOrganization'],
        'Organization'
      ),
      subOrganization: validateUrlChip(
        values['subOrganization'],
        'Organization'
      ),
      headquartersAddress: validateRequired(
        values['headquartersAddress'],
        'Address'
      ),
      legalAddress: sameAddress
        ? null
        : validateRequired(values['legalAddress'], 'Address'),
    }
    return validationCheck(params as unknown as ValuesType)
  }

  const onSubmit = async (data: RegisterForm) => {
    const legalRegistrationNumber: { [key: string]: string } = {}
    for (const registration of data.registrations) {
      const vcKey = REGISTRATION_TYPE_VC_KEY[registration.legalRegistrationType]
      legalRegistrationNumber[vcKey] = registration.legalRegistrationNumber
    }

    let request: RegisterParticipantRequest = {
      body: {
        email: data.email,
        onboardRequest: {
          legalName: data.legalName,
          shortName: data.shortName,
          entityType: data.entityType,
          ownDid: data.ownDid,
          acceptedTnC: isAcceptTermsCondition,
          credential: {
            legalParticipant: {
              credentialSubject: {
                'gx:legalName': data.legalName,
                'gx:headquarterAddress': {
                  'gx:countrySubdivisionCode': data.headquartersAddress!.value,
                },
                'gx:legalAddress': {
                  'gx:countrySubdivisionCode': sameAddress
                    ? data.headquartersAddress!.value
                    : data.legalAddress!.value,
                },
                'gx:parentOrganization': data.parentOrganization.map((item) => {
                  return {
                    id: item,
                  }
                }),
                'gx:subOrganization': data.subOrganization.map((item) => {
                  return {
                    id: item,
                  }
                }),
              },
            },
            legalRegistrationNumber: legalRegistrationNumber,
          },
        },
      },
    }
    request = removeEmptyFields<typeof request>(request)
    try {
      await registerParticipant(request)
      navigate({
        pathname: `/${ROUTES_CONST.EMAIL_VERIFY}`,
        search: createSearchParams({
          email: data.email,
        }).toString(),
      })
    } catch (error) {
      // console.log(error)
    }
  }

  return (
    <>
      <div
        className={
          RegisterParticipantFormStyled.RegisterParticipantFormContainer +
          ' w-[72.5rem] max-2xl:w-[65rem] rounded-[2rem] p-[5rem] h-[calc(100vh-8rem)] overflow-auto'
        }
      >
        <Form
          onSubmit={onSubmit}
          mutators={{
            ...arrayMutators,
          }}
          initialValues={{ ...initialFormState }}
          validate={formValidate}
          render={({
            form: {
              mutators: { push },
            },
            handleSubmit,
            values,
          }) => (
            <form onSubmit={handleSubmit} noValidate>
              <div>
                <Field
                  name="email"
                  render={({ input, meta }) => (
                    <InputField
                      {...input}
                      variant="standard"
                      label="Email"
                      fullWidth
                      placeholder="Enter email"
                      error={meta.touched && meta.error}
                      required
                      helperText={
                        meta.touched && meta.error && <span>{meta.error}</span>
                      }
                    />
                  )}
                />
              </div>

              <div className="flex gap-[2rem] mt-[2rem]">
                <Field
                  name="legalName"
                  render={({ input, meta }) => (
                    <InputField
                      {...input}
                      variant="standard"
                      label="Legal name"
                      fullWidth
                      placeholder="Enter legal name"
                      error={meta.touched && meta.error}
                      required
                      helperText={
                        meta.touched && meta.error && <span>{meta.error}</span>
                      }
                      tooltip="Enter Legal Name of your Company"
                    />
                  )}
                />

                <Field
                  name="shortName"
                  render={({ input, meta }) => (
                    <InputField
                      {...input}
                      variant="standard"
                      label="Short name"
                      fullWidth
                      placeholder="Enter short name"
                      error={meta.touched && meta.error}
                      required
                      helperText={
                        meta.touched && meta.error && <span>{meta.error}</span>
                      }
                      tooltip="Domain will be created using Short Name"
                    />
                  )}
                />
              </div>

              <FieldArray name="registrations">
                {({ fields }) =>
                  fields.map((name, index) => (
                    <div key={name} className="flex gap-[2rem] mt-[2rem]">
                      <div className="w-[50%]">
                        <Field
                          name={`${name}.legalRegistrationType`}
                          render={({ input, meta }) => (
                            <>
                              <Select
                                {...input}
                                items={registrationTypes
                                  .filter((item) => {
                                    const selectedTypes: string[] = values[
                                      'registrations'
                                    ]
                                      .filter(
                                        (value) => Object.keys(value).length > 0
                                      )
                                      .map((value) => {
                                        return value.legalRegistrationType
                                      })
                                    return item.type !== input.value &&
                                      selectedTypes.includes(item.type)
                                      ? false
                                      : true
                                  })
                                  .map((item) => {
                                    return {
                                      label: item.type,
                                      value: item.type,
                                    }
                                  })}
                                placeholder=""
                                label={'Legal registration type'}
                                required={true}
                                error={meta.touched && meta.error}
                                helperText={
                                  meta.touched &&
                                  meta.error && <span>{meta.error}</span>
                                }
                              />
                            </>
                          )}
                        />
                      </div>

                      <div className="flex gap-[1rem] items-center w-[50%]">
                        <div className="w-[95%]">
                          <Field
                            name={`${name}.legalRegistrationNumber`}
                            render={({ input, meta }) => (
                              <InputField
                                {...input}
                                variant="standard"
                                label="Legal registration number"
                                fullWidth
                                placeholder="Enter legal registration number"
                                error={meta.touched && meta.error}
                                required
                                helperText={
                                  meta.touched &&
                                  meta.error && <span>{meta.error}</span>
                                }
                                tooltip="Insert the Registration number for the selected Legal Registration Type"
                              />
                            )}
                          />
                        </div>

                        <div className="w-[5%] flex justfy-between gap-[0.5rem]">
                          {fields.length && fields.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => fields.remove(index)}
                              style={{ cursor: 'pointer' }}
                            >
                              <CrossIcon />
                            </button>
                          ) : (
                            ''
                          )}
                          {fields.length &&
                          fields.length < 3 &&
                          index === fields.length - 1 ? (
                            <button
                              type="button"
                              onClick={() =>
                                push('registrations', {
                                  legalRegistrationType: '',
                                })
                              }
                            >
                              <AddMoreIcon />
                            </button>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </FieldArray>

              <div className="mt-[2rem]">
                <Field
                  name="entityType"
                  render={({ input, meta }) => (
                    <>
                      <Select
                        {...input}
                        items={entityTypes.map((item) => {
                          return {
                            label: item.type,
                            value: item.id,
                          }
                        })}
                        placeholder=""
                        label="Type of entity"
                      />
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </>
                  )}
                />
              </div>

              <div className="flex gap-[2rem] mt-[2rem]">
                <Field
                  name="parentOrganization"
                  render={({ input, meta }) => (
                    <InputChips
                      {...input}
                      fullWidth
                      variant={'standard'}
                      label="Parent organization"
                      placeholder="Enter parent organization"
                      error={meta.touched && meta.error}
                      helperText={
                        meta.touched &&
                        meta.error && <span>Parent {meta.error}</span>
                      }
                      addOnWhichKey={CHIPS_OPTIONS}
                      hideClearAll={true}
                      addOnBlur
                      tooltip="Enter Gaia X registered Legal Participant Resolvable ID/ URL with SD"
                    />
                  )}
                />

                <Field
                  name="subOrganization"
                  render={({ input, meta }) => (
                    <InputChips
                      {...input}
                      variant="standard"
                      label="Sub organization"
                      fullWidth
                      placeholder="Enter sub organization"
                      error={meta.touched && meta.error}
                      helperText={
                        meta.touched &&
                        meta.error && <span>Sub {meta.error}</span>
                      }
                      addOnBlur
                      addOnWhichKey={CHIPS_OPTIONS}
                      hideClearAll={true}
                      addOnBlurs
                      tooltip="Enter Gaia X registered Legal Participant Resolvable ID/ URL with SD"
                    />
                  )}
                />
              </div>

              <div className="flex gap-[2rem] mt-[4rem]">
                <div className="w-[50%]">
                  <h2 className="mb-[3rem] text-[2rem] font-[600]">
                    Headquarter Address
                  </h2>

                  <Field
                    name="headquartersAddress"
                    render={({ input, meta }) => {
                      return (
                        <>
                          <AsyncSearchSelect
                            {...input}
                            label="Headquarter Address"
                            placeholder="Select Headquarter Address *"
                            menuPlacement={'auto'}
                            loadOptions={(searchString: string) =>
                              onLoadSubDivisions(
                                searchString,
                                defaultDivisionFilterParams
                              )
                            }
                            required={true}
                          />
                          {meta.touched && meta.error && (
                            <span className="field-error">
                              Headquarter {meta.error}
                            </span>
                          )}
                        </>
                      )
                    }}
                  />
                </div>

                <div className="w-[50%]">
                  <h2 className="mb-[3rem] text-[2rem] font-[600]">
                    Legal Address
                  </h2>
                  <Field
                    name="legalAddress"
                    render={({ input, meta }) => {
                      return (
                        <>
                          <AsyncSearchSelect
                            {...input}
                            label="Legal Address"
                            placeholder="Select Legal Address *"
                            menuPlacement={'auto'}
                            loadOptions={(searchString: string) =>
                              onLoadSubDivisions(
                                searchString,
                                defaultDivisionFilterParams
                              )
                            }
                            isDisabled={sameAddress}
                            required={true}
                            value={
                              sameAddress
                                ? values['headquartersAddress']
                                : undefined
                            }
                          />

                          {meta.touched && meta.error && (
                            <span className="field-error">
                              Legal {meta.error}
                            </span>
                          )}
                        </>
                      )
                    }}
                  />
                  {values['headquartersAddress'] ? (
                    <label className="mt-[1rem] inline-block">
                      <Field
                        name="sameAddress"
                        render={({ input }) => (
                          <Checkbox
                            {...input}
                            label={<span>Same as headquarter address</span>}
                            onChange={(e) => setSameAddress(e.target.checked)}
                          />
                        )}
                      />
                    </label>
                  ) : (
                    ''
                  )}
                </div>
              </div>

              <div className="mt-[3rem]">
                <Field
                  name="ownDid"
                  render={({ input }) => (
                    <label>
                      <Checkbox
                        {...input}
                        label={'We want to use our own DID and Private key'}
                      />
                    </label>
                  )}
                />
              </div>

              <div className="mt-[1rem]">
                <Field
                  name="ownDid"
                  render={({ input }) => (
                    <label>
                      <Checkbox
                        {...input}
                        label={<a>I accept the Gaia-X Terms and Conditions</a>}
                        checked={isAcceptTermsCondition}
                        onChange={onCheckboxChange}
                        tooltip={
                          !isAcceptTermsCondition
                            ? 'Please Read and Accept the Gaia - X Terms and Conditions'
                            : ''
                        }
                      />
                    </label>
                  )}
                />
              </div>

              <div className="text-right flex justify-center gap-[2rem] mt-[5rem]">
                <Button
                  variant="outlined"
                  type="button"
                  color="primary"
                  className="mt-[2rem]"
                  size="medium"
                  onClick={() => {
                    navigate(ROUTES_CONST.ROOT)
                  }}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  className="mt-[2rem]"
                  size="medium"
                  disabled={!isAcceptTermsCondition}
                >
                  Register
                </Button>
              </div>
            </form>
          )}
        />
      </div>

      <Dialog
        open={openDialog}
        onClose={(e: boolean) => setOpenDialog(e)}
        onSubmit={(event: boolean) => {
          setIsAcceptTermsCondition(!isAcceptTermsCondition)
          setOpenDialog(event)
        }}
        title=""
      >
        <div className="mb-[2rem]">
          <p className="text-[2rem] font-[400] mt-[2rem] mb-[1rem]">
            The <a>PARTICIPANT</a> signing the Self-Description agrees as
            follows:
          </p>
          <ul className="pl-[3rem] list-decimal font-[400] text-[2rem]">
            <li>
              To update its descriptions about any changes, be it technical,
              organizational, or legal - especially but not limited to
              contractual in regards to the indicated attributes present in the
              descriptions.
            </li>

            <li>
              The keypair used to sign Verifiable Credentials will be revoked
              where Gaia-X Association becomes aware of any inaccurate
              statements in regards to the claims which result in a
              non-compliance with the Trust Framework and policy rules defined
              in the Policy Rules and Labelling Document (PRLD).
            </li>
          </ul>
        </div>
      </Dialog>
    </>
  )
}

export { RegisterParticipantForm }
