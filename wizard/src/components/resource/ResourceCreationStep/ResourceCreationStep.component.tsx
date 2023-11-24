import { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import dayjs from 'dayjs'
import { useAuth } from '@wizard/hooks'
import { KeyValueType } from '@wizard/models/base.model'
import {
  LEGAL_BASIS_LIST,
  RESOURCE_SUB_TYPE_LIST,
  RESOURCE_TYPE_LIST,
} from './ResourceCreationStep.constant'
import { postValidateResourceCreation } from '@wizard/api/resourceCreation.api'
import {
  ResourceCreationParamType,
  ResourceFormValue,
} from '@wizard/models/resource-creation.model'
import {
  AsyncSearchSelect,
  Button,
  Card,
  InputChips,
  InputField,
  RadioButtonGroup,
  TextArea,
  DateTimePicker,
  Select,
} from '@gaia-x-frontend/components-lib'
import {
  removeEmptyFields,
  Item,
  onLoadSubDivisions,
  validationCheck,
  validateRequired,
  onLoadVcOption,
  AsyncReqParam,
  validateUrlChip,
} from '@wizard/utils/helpers'
import { onLoadLicenseOption } from './ResourceCreationStep.helper'
import {
  CHIPS_OPTIONS,
  DATE_TIME_FORMATE,
  ResourceSubType,
  ResourceType,
} from '@wizard/utils/constants'
import ResourceCreationStepStyled from './ResourceCreationStep.module.scss'
import {
  contactEmailValidation,
  contactUrlValidation,
} from './ResourceCreationStep.validation'
import { AppLoader } from '@wizard/components/shared/AppLoader'

interface ResourceCreationStepProps {
  onClickNext: () => void
  setServiceCreationForm: React.Dispatch<
    React.SetStateAction<ResourceFormValue | undefined>
  >
  setResourceParams: React.Dispatch<
    React.SetStateAction<ResourceCreationParamType | undefined>
  >
  resourceCreationForm?: ResourceFormValue
  onSubmitForm: (value: KeyValueType) => void
  isSubmitLoading: boolean
  setCreateResourceLoading: (value: boolean) => void
}

const ResourceCreationStep = ({
  onClickNext,
  setServiceCreationForm: setResourceCreationForm,
  setResourceParams,
  resourceCreationForm,
  onSubmitForm,
  isSubmitLoading,
  setCreateResourceLoading,
}: ResourceCreationStepProps) => {
  const initialFormState = {
    resourceName: resourceCreationForm?.resourceName,
    description: resourceCreationForm?.description,
    aggregation: resourceCreationForm?.aggregation,
    resourceType: resourceCreationForm?.resourceType,
    resourceSubType: resourceCreationForm?.resourceSubType,
    locationAddress: resourceCreationForm?.locationAddress,
    locationCoordinates: resourceCreationForm?.locationCoordinates,
    maintainedBy: resourceCreationForm?.maintainedBy,
    ownedBy: resourceCreationForm?.ownedBy,
    manufacturedBy: resourceCreationForm?.manufacturedBy,
    copyrightOwner: resourceCreationForm?.copyrightOwner,
    policy: resourceCreationForm?.policy,
    license: resourceCreationForm?.license,
    producedBy: resourceCreationForm?.producedBy,
    exposedThrough: resourceCreationForm?.exposedThrough,
    DateOfExpiry: resourceCreationForm?.DateOfExpiry,
    DateOfDeletion: resourceCreationForm?.DateOfDeletion,
    containsPII: resourceCreationForm?.containsPII,
    legalBasis: resourceCreationForm?.legalBasis,
    contactEmail: resourceCreationForm?.contactEmail,
    contactUrl: resourceCreationForm?.contactUrl,
  }

  const auth = useAuth()
  const [resourceType, setResourceType] = useState<ResourceType>(
    ResourceType.Physical
  )
  const [subResourceType, setSubResourceType] = useState<ResourceSubType>(
    ResourceSubType.Software
  )
  const [isPhysicalResource, setIsPhysicalResource] = useState<boolean>(true)
  const [isVirtualTypeData, setIsVirtualTypeData] = useState<boolean>(false)
  const [isContainsPii, setIsContainsPii] = useState<boolean>(true)
  const defaultVcParams: AsyncReqParam = {
    page: -1,
    size: 20,
    criteriaOperator: 'OR',
  }

  const defaultLicenseParams: AsyncReqParam = {
    page: -1,
    size: 20,
    sort: {
      column: 'name',
      sortType: 'ASC',
    },
  }

  const defaultDivisionFilterParams: AsyncReqParam = {
    page: -1,
    size: 20,
    criteriaOperator: 'OR',
  }

  useEffect(() => {
    initialFormValueChanges()
  }, [])

  const initialFormValueChanges = () => {
    if (initialFormState.resourceType) {
      setResourceType(initialFormState.resourceType)
      setIsPhysicalResource(
        initialFormState.resourceType === ResourceType.Physical
      )
    }
    if (initialFormState.resourceSubType) {
      setSubResourceType(initialFormState.resourceSubType)
      setIsVirtualTypeData(
        initialFormState.resourceSubType === ResourceSubType.Data
      )
    }
    if (initialFormState.containsPII !== undefined) {
      setIsContainsPii(initialFormState.containsPII)
    }
  }

  const validate = (values: ResourceFormValue) => {
    const {
      resourceName,
      aggregation: aggregationValues,
      locationAddress,
      maintainedBy,
      ownedBy,
      manufacturedBy,
      copyrightOwner,
      license: licenseValues,
      producedBy,
      exposedThrough,
      legalBasis,
      contactEmail,
      contactUrl,
    } = values

    const aggregationUrls = aggregationValues
      ? aggregationValues.map((chip) => chip.value)
      : []
    let validateParams = {
      resourceName: validateRequired(resourceName, 'Resource name'),
      aggregation: validateUrlChip(aggregationUrls, 'Aggregation'),
    }

    if (isPhysicalResource) {
      const physicalResourceValidate = {
        locationAddress: validateRequired(locationAddress, 'Location address'),
        maintainedBy: validateUrlChip(maintainedBy, 'Maintained by', true),
        ownedBy: validateUrlChip(ownedBy, 'Owned by'),
        manufacturedBy: validateUrlChip(manufacturedBy, 'Manufactured by'),
      }
      validateParams = { ...validateParams, ...physicalResourceValidate }
    } else {
      const licenseUrls = licenseValues
        ? licenseValues.map((chip) => chip.value)
        : []
      let virtualType = {
        copyrightOwner: validateUrlChip(
          copyrightOwner,
          'Copyright owner',
          true
        ),
        license: validateUrlChip(licenseUrls, 'License', true),
      }
      if (isVirtualTypeData) {
        let virtualTypeData = {
          producedBy: validateUrlChip([producedBy], 'Produced by', true),
          exposedThrough: validateUrlChip(
            [exposedThrough],
            'Exposed through',
            true
          ),
        }
        virtualTypeData = {
          ...virtualTypeData,
          ...onContainsPiiChangeValidate(
            isContainsPii,
            legalBasis,
            contactEmail,
            contactUrl
          ),
        }
        virtualType = { ...virtualType, ...virtualTypeData }
      }
      validateParams = { ...validateParams, ...virtualType }
    }
    return validationCheck(validateParams)
  }

  const onContainsPiiChangeValidate = (
    isContainsPii: boolean,
    legalBasis: string,
    contactEmail: string,
    contactUrl: string
  ) => {
    let errors = {}
    if (isContainsPii) {
      errors = {
        legalBasis: validateRequired(legalBasis, 'Legal basis'),
        contactEmail: contactEmailValidation(
          contactEmail,
          'Contact email',
          !contactUrl
        ),
        contactUrl: contactUrlValidation(
          contactUrl,
          'Contact url',
          !contactEmail
        ),
      }
    } else {
      errors = {
        contactEmail: contactEmailValidation(
          contactEmail,
          'Contact email',
          isContainsPii
        ),
        contactUrl: contactUrlValidation(
          contactUrl,
          'Contact url',
          isContainsPii
        ),
      }
    }
    return errors
  }

  const onResourceTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as ResourceType
    setResourceType(value)
    setIsPhysicalResource(value === ResourceType.Physical)
  }

  const onResourceSubTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = (event.target as HTMLInputElement).value as ResourceSubType
    setSubResourceType(value)
    setIsVirtualTypeData(value === ResourceSubType.Data)
  }

  const onChangeContainsPii = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value
    setIsContainsPii(value === 'true')
  }

  const onSubmit = (values: ResourceFormValue) => {
    const formValue: ResourceFormValue = { ...values }
    if (isSubmitLoading) return
    setCreateResourceLoading(true)
    const params: ResourceCreationParamType = {
      credentialSubject: {
        type: resourceType,
        subType:
          resourceType === ResourceType.Virtual ? subResourceType : undefined,
        'gx:name': formValue.resourceName,
        'gx:description': formValue.description,
        'gx:aggregationOf': formValue.aggregation
          ? (formValue.aggregation as unknown as Item[]).map((agr) => {
              return { id: agr.value }
            })
          : [],
      },
    }
    if (isPhysicalResource) {
      params.credentialSubject = {
        ...params.credentialSubject,
        ...getPhysicalResourceParams(formValue),
      }
    } else if (isVirtualTypeData) {
      params.credentialSubject = {
        ...params.credentialSubject,
        ...getVirtualTypeDataParams(formValue),
      }
    } else {
      params.credentialSubject = {
        ...params.credentialSubject,
        ...getVirtualTypeSoftwareParams(formValue),
      }
    }
    formValue.resourceType = resourceType
    formValue.resourceSubType = subResourceType
    formValue.containsPII = isContainsPii

    setResourceCreationForm(formValue)
    setResourceParams(params)

    if (auth?.userConfig?.keyStored) {
      onSubmitForm(params as unknown as KeyValueType)
    } else {
      const queryParams = removeEmptyFields<typeof params>(params)
      postValidateResourceCreation({ queryParams })
        .then(() => {
          onClickNext()
        })
        .finally(() => setCreateResourceLoading(false))
    }
  }

  const getPhysicalResourceParams = (formValue: ResourceFormValue) => {
    return {
      'gx:maintainedBy': formValue.maintainedBy.map((maintainer) => {
        return { id: maintainer }
      }),
      'gx:ownedBy': formValue.ownedBy
        ? formValue.ownedBy.map((owned) => {
            return { id: owned }
          })
        : [],
      'gx:manufacturedBy': formValue.manufacturedBy
        ? formValue.manufacturedBy.map((manufactured) => {
            return { id: manufactured }
          })
        : [],
      'gx:locationAddress': formValue.locationAddress.map((countryCode) => {
        return { 'gx:countryCode': countryCode.value }
      }),
      'gx:location': formValue.locationCoordinates
        ? formValue.locationCoordinates.map((coordinate) => {
            return { 'gx:gps': coordinate }
          })
        : [],
    }
  }

  const getVirtualTypeDataParams = (formValue: ResourceFormValue) => {
    return {
      'gx:copyrightOwnedBy': formValue.copyrightOwner.map((owner) => {
        return { id: owner }
      }),
      'gx:license': formValue.license
        ? formValue.license.map((license) => {
            return license.value
          })
        : [],
      'gx:policy':
        formValue.policy && formValue.policy.length
          ? { 'gx:customAttribute': JSON.stringify(formValue.policy) }
          : null,
      'gx:producedBy': {
        id: formValue.producedBy,
      },
      'gx:exposedThrough': [formValue.exposedThrough],
      'gx:containsPII': isContainsPii,
      'gx:legalBasis': formValue.legalBasis,
      'gx:obsoleteDateTime': formValue.DateOfDeletion
        ? dayjs(formValue.DateOfDeletion).format(DATE_TIME_FORMATE)
        : '',
      'gx:expirationDateTime': formValue.DateOfExpiry
        ? dayjs(formValue.DateOfExpiry).format(DATE_TIME_FORMATE)
        : '',
      'gx:email': formValue.contactEmail ? formValue.contactEmail : '',
      'gx:url': formValue.contactUrl ? formValue.contactUrl : '',
    }
  }

  const getVirtualTypeSoftwareParams = (formValue: ResourceFormValue) => {
    return {
      'gx:copyrightOwnedBy': formValue.copyrightOwner.map((owner) => {
        return { id: owner }
      }),
      'gx:license': formValue.license
        ? formValue.license.map((license) => {
            return license.value
          })
        : [],
      'gx:policy':
        formValue.policy && formValue.policy.length
          ? { 'gx:customAttribute': JSON.stringify(formValue.policy) }
          : null,
    }
  }

  return (
    <div
      className={
        ResourceCreationStepStyled.ResourceCreationContainer +
        ' flex flex-col items-center relative'
      }
    >
      {isSubmitLoading && (
        <div className=" absolute w-[100%] bg-white/60 h-[100%] z-10 ">
          <AppLoader />
        </div>
      )}
      <div className="w-[101.6rem] max-2xl:w-[80rem]">
        <h1 className="text-[2rem] font-[600] mt-[3.6rem] mb-[4rem]">
          Fill the following form to publish your service to the relevant Gaia-X
          catalogue
        </h1>
        <Form
          initialValues={{ ...initialFormState }}
          onSubmit={onSubmit}
          validate={validate}
          keepDirtyOnReinitialize
          render={({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit} noValidate>
              <div>
                {/* Start general info card */}
                <Card title="General Information">
                  <div>
                    <Field
                      name="resourceName"
                      render={({ input, meta }) => (
                        <InputField
                          {...input}
                          variant="standard"
                          label="Resource name"
                          fullWidth
                          placeholder="Enter resource name"
                          error={meta.touched && meta.error ? true : false}
                          required
                          helperText={
                            meta.touched &&
                            meta.error && <span>{meta.error}</span>
                          }
                          tooltip="Resource Name will be displayed in all lists/ catalogue"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Field
                      name="description"
                      render={({ input, meta }) => (
                        <TextArea
                          {...input}
                          variant="standard"
                          label="Description"
                          fullWidth
                          placeholder="Enter description"
                          rows={3}
                          multiline
                          error={meta.touched && meta.error ? true : false}
                          helperText={
                            meta.touched &&
                            meta.error && <span>{meta.error}</span>
                          }
                          tooltip="Explain what a customer can expect by using your Resource"
                        />
                      )}
                    />
                  </div>

                  <div className="mt-[4rem] mb-[2rem]">
                    <Field
                      name="aggregation"
                      render={({ input, meta }) => {
                        return (
                          <>
                            <AsyncSearchSelect
                              placeholder="Aggregation of (VC URL)"
                              label="Aggregation of (VC URL)"
                              {...input}
                              loadOptions={(searchString: string) =>
                                onLoadVcOption(searchString, defaultVcParams)
                              }
                              isCreation
                              isMulti={true}
                              menuPlacement="auto"
                              tooltip="Enter One or more Gaia-X compliant Resource Resolvable ID/ URL with SD or Select Resource from the List"
                            />
                            {meta.touched && meta.error && (
                              <span className="field-error">{meta.error}</span>
                            )}
                          </>
                        )
                      }}
                    />
                  </div>
                </Card>
                {/* End card */}

                {/* Start Radio button card */}
                <div className="mt-[2rem]">
                  <Card title="Type">
                    <div className="flex gap-[5rem]">
                      <div>
                        <h3 className="text-[1.6rem] font-[600]">
                          Resource type
                        </h3>
                        <div>
                          <Field
                            name="resourceType"
                            render={({ input }) => (
                              <RadioButtonGroup
                                {...input}
                                radioGroupProps={{
                                  defaultValue: `${
                                    initialFormState.resourceType ??
                                    ResourceType.Physical
                                  }`,
                                  name: 'resource-type-group',
                                }}
                                options={RESOURCE_TYPE_LIST}
                                onChange={onResourceTypeChange}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[1.6rem] font-[600]">
                          Resource sub type
                        </h3>
                        <div>
                          <Field
                            name="resourceSubType"
                            render={({ input }) => (
                              <RadioButtonGroup
                                {...input}
                                disabledGroup={isPhysicalResource}
                                onChange={onResourceSubTypeChange}
                                radioGroupProps={{
                                  defaultValue: `${
                                    initialFormState?.resourceSubType ??
                                    ResourceSubType.Software
                                  }`,
                                  name: 'resource-sub-type-group',
                                }}
                                options={RESOURCE_SUB_TYPE_LIST}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                {/* End card */}

                {/* Start location details card */}
                {isPhysicalResource && (
                  <div className="mt-[2rem]">
                    <Card title="Location details">
                      <div className="mt-[1rem]">
                        <Field
                          name="locationAddress"
                          render={({ input, meta }) => {
                            return (
                              <>
                                <AsyncSearchSelect
                                  label="Location address* (Country code)"
                                  placeholder="Location address *"
                                  {...input}
                                  loadOptions={(searchString: string) =>
                                    onLoadSubDivisions(
                                      searchString,
                                      defaultDivisionFilterParams
                                    )
                                  }
                                  isMulti={true}
                                  menuPlacement="auto"
                                  tooltip="Select One or more Physical Location of your Resource"
                                />
                                {meta.touched && meta.error && (
                                  <span className="field-error">
                                    {meta.error}
                                  </span>
                                )}
                              </>
                            )
                          }}
                        />
                      </div>

                      <div className="mt-[2rem] mb-[2rem]">
                        <Field
                          name="locationCoordinates"
                          render={({ input, meta }) => (
                            <InputChips
                              {...input}
                              variant="standard"
                              label="Location Coordinates (in ISO 6709 format)"
                              fullWidth
                              placeholder="Enter location co-ordinates"
                              error={meta.touched && meta.error ? true : false}
                              helperText={
                                meta.touched &&
                                meta.error && <span>{meta.error}</span>
                              }
                              addOnBlur
                              addOnWhichKey={CHIPS_OPTIONS}
                            />
                          )}
                        />
                      </div>
                    </Card>
                  </div>
                )}
                {/* End card */}

                {/* Start technical details card */}
                {isPhysicalResource && (
                  <div className="mt-[2rem]">
                    <Card title="Technical Details">
                      <div>
                        <Field
                          name="maintainedBy"
                          render={({ input, meta }) => (
                            <InputChips
                              {...input}
                              variant="standard"
                              label="Maintained by"
                              fullWidth
                              placeholder="Enter maintained by"
                              error={meta.touched && meta.error ? true : false}
                              required
                              helperText={
                                meta.touched &&
                                meta.error && <span>{meta.error}</span>
                              }
                              addOnBlur
                              addOnWhichKey={CHIPS_OPTIONS}
                              tooltip="Enter One or more Gaia X registered Legal Participant Resolvable ID/ URL with SD"
                            />
                          )}
                        />
                      </div>

                      <div className="mt-[2rem]">
                        <Field
                          name="ownedBy"
                          render={({ input, meta }) => (
                            <InputChips
                              {...input}
                              variant="standard"
                              label="Owned by"
                              fullWidth
                              placeholder="Enter owned by"
                              error={meta.touched && meta.error ? true : false}
                              helperText={
                                meta.touched &&
                                meta.error && <span>{meta.error}</span>
                              }
                              addOnBlur
                              addOnWhichKey={CHIPS_OPTIONS}
                              tooltip="Enter One or more Gaia X registered Legal Participant Resolvable ID/ URL with SD"
                            />
                          )}
                        />
                      </div>

                      <div className="mt-[2rem] mb-[2rem]">
                        <Field
                          name="manufacturedBy"
                          render={({ input, meta }) => (
                            <InputChips
                              {...input}
                              variant="standard"
                              label="Manufactured by"
                              fullWidth
                              placeholder="Enter manufactured by"
                              error={meta.touched && meta.error ? true : false}
                              helperText={
                                meta.touched &&
                                meta.error && <span>{meta.error}</span>
                              }
                              addOnBlur
                              addOnWhichKey={CHIPS_OPTIONS}
                              tooltip="Enter One or more Gaia X registered Legal Participant Resolvable ID/ URL with SD"
                            />
                          )}
                        />
                      </div>
                    </Card>
                  </div>
                )}
                {/* End card */}

                {/* Start ownership & controls card */}
                {!isPhysicalResource && (
                  <div className="mt-[2rem]">
                    <Card title="Ownership & Controls">
                      <div>
                        <Field
                          name="copyrightOwner"
                          render={({ input, meta }) => (
                            <InputChips
                              {...input}
                              variant="standard"
                              label="Copyright owner"
                              fullWidth
                              placeholder="Enter copyright owner"
                              error={meta.touched && meta.error ? true : false}
                              required
                              helperText={
                                meta.touched &&
                                meta.error && <span>{meta.error}</span>
                              }
                              addOnBlur
                              addOnWhichKey={CHIPS_OPTIONS}
                              tooltip="Enter One or more Gaia X registered Legal Participant Resolvable ID/ URL with SD"
                            />
                          )}
                        />
                      </div>

                      <div className="mt-[2rem]">
                        <Field
                          name="policy"
                          render={({ input }) => (
                            <InputChips
                              {...input}
                              variant="standard"
                              label="Policy"
                              fullWidth
                              placeholder="Enter policy"
                              addOnWhichKey={CHIPS_OPTIONS}
                              addOnBlur
                              tooltip="Enter one or more URLs to a page defining Access Control, throttling, Usage, Retention etc"
                            />
                          )}
                        />
                      </div>

                      <div
                        className={
                          ResourceCreationStepStyled.inputSelectCustom +
                          ' mt-[2rem] mb-[2rem]'
                        }
                      >
                        <Field
                          name="license"
                          render={({ input, meta }) => {
                            return (
                              <>
                                <AsyncSearchSelect
                                  placeholder="Select license*"
                                  label="License*"
                                  {...input}
                                  loadOptions={(searchString: string) =>
                                    onLoadLicenseOption(
                                      searchString,
                                      defaultLicenseParams
                                    )
                                  }
                                  isCreation
                                  isMulti={true}
                                  menuPlacement="auto"
                                  tooltip="Enter SPDX identifier or URL To the License Document"
                                />
                                {meta.touched && meta.error && (
                                  <span className="field-error">
                                    {meta.error}
                                  </span>
                                )}
                              </>
                            )
                          }}
                        />
                      </div>
                    </Card>
                  </div>
                )}
                {/* End card */}

                {/* Start technical details card */}
                {!isPhysicalResource && isVirtualTypeData && (
                  <div className="mt-[2rem]">
                    <Card title="Technical Details">
                      <div>
                        <Field
                          name="producedBy"
                          render={({ input, meta }) => (
                            <InputField
                              {...input}
                              variant="standard"
                              label="Produced by"
                              fullWidth
                              placeholder="Enter produced by"
                              error={meta.touched && meta.error ? true : false}
                              required
                              helperText={
                                meta.touched &&
                                meta.error && <span>{meta.error}</span>
                              }
                              tooltip="Enter One or more Gaia X registered Legal Participant Resolvable ID/ URL with SD"
                            />
                          )}
                        />
                      </div>

                      <div className="mt-[2rem]">
                        <Field
                          name="exposedThrough"
                          render={({ input, meta }) => (
                            <InputField
                              {...input}
                              variant="standard"
                              label="Exposed through"
                              fullWidth
                              placeholder="Enter exposed through"
                              error={meta.touched && meta.error ? true : false}
                              required
                              helperText={
                                meta.touched &&
                                meta.error && <span>{meta.error}</span>
                              }
                              tooltip="Enter a resolvable link to the data exchange component that exposes the data resource"
                            />
                          )}
                        />
                      </div>

                      <div className="mt-[2rem] flex gap-[2rem]">
                        <div className="w-[49%]">
                          <Field
                            name="DateOfExpiry"
                            render={({ input }) => (
                              <DateTimePicker
                                {...input}
                                label="Date of expiry"
                                slotProps={{
                                  textField: { variant: 'standard' },
                                }}
                                disablePast
                                maxDate={values['DateOfDeletion']}
                                tooltip="Select the date and time after which the Data will become Obsolete"
                              />
                            )}
                          />
                        </div>

                        <div className="w-[49%]">
                          <Field
                            name="DateOfDeletion"
                            render={({ input }) => (
                              <DateTimePicker
                                {...input}
                                label="Date of deletion"
                                slotProps={{
                                  textField: { variant: 'standard' },
                                }}
                                disablePast
                                minDate={values['DateOfExpiry']}
                                tooltip="Select the date and time after which the Data will expire and shall be deleted"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
                {/* End card */}

                {!isPhysicalResource && isVirtualTypeData && (
                  <div className="mt-[2rem] flex gap-[2rem]">
                    <div className="w-[25%]">
                      {/* Start Contains PII card */}
                      <Card title="Contains PII">
                        <div>
                          <Field
                            name="containsPII"
                            render={({ input }) => (
                              <RadioButtonGroup
                                {...input}
                                onChange={onChangeContainsPii}
                                radioGroupProps={{
                                  defaultValue:
                                    initialFormState.containsPII ?? true,
                                  name: 'contains-pii',
                                }}
                                options={[
                                  { label: 'Yes', value: true },
                                  { label: 'No', value: false },
                                ]}
                              />
                            )}
                          />
                        </div>
                      </Card>
                    </div>
                    {/* End card */}

                    {/* Start Legal Basis card */}
                    <div className="w-[75%]">
                      <Card title="Legal Basis">
                        <div className="mt-[0.3rem]">
                          <Field
                            name="legalBasis"
                            render={({ input, meta }) => (
                              <Select
                                label="Legal Basis"
                                {...input}
                                required={isContainsPii}
                                items={LEGAL_BASIS_LIST}
                                error={meta.touched && meta.error}
                                helperText={
                                  meta.touched &&
                                  meta.error && <span>{meta.error}</span>
                                }
                                tooltip="Select the applicable article being followed for Legitimate processing of information related to PII"
                              />
                            )}
                          />
                        </div>
                      </Card>
                    </div>

                    {/* End card */}
                  </div>
                )}

                {/* Start Data Protection Contact card */}
                {!isPhysicalResource && isVirtualTypeData && (
                  <div className="mt-[2rem]">
                    <Card title="Data Protection Contact">
                      <div className="flex items-center gap-[2rem]">
                        <div className="w-[45%]">
                          <Field
                            name="contactEmail"
                            render={({ input, meta }) => (
                              <InputField
                                {...input}
                                variant="standard"
                                label="Email Address"
                                fullWidth
                                placeholder="Enter email address"
                                error={
                                  meta.touched && meta.error ? true : false
                                }
                                required={
                                  isContainsPii && !values['contactUrl']
                                }
                                helperText={
                                  meta.touched &&
                                  meta.error && <span>{meta.error}</span>
                                }
                                tooltip="Provide email ID or Contact form to facilitate a Data Consumer to seek Clarity on Personal Data Protection measures being taken"
                              />
                            )}
                          />
                        </div>

                        <div className="w-[5%] text-center">Or</div>

                        <div className="w-[45%]">
                          <Field
                            name="contactUrl"
                            render={({ input, meta }) => (
                              <InputField
                                {...input}
                                variant="standard"
                                label="Contact form URL"
                                fullWidth
                                placeholder="Enter contact form URL"
                                error={
                                  meta.touched && meta.error ? true : false
                                }
                                required={
                                  isContainsPii && !values['contactEmail']
                                }
                                helperText={
                                  meta.touched &&
                                  meta.error && <span>{meta.error}</span>
                                }
                                tooltip="Provide email ID or Contact form to facilitate a Data Consumer to seek Clarity on Personal Data Protection measures being taken"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
                {/* End card */}

                <div className="mt-[3rem] text-right pb-[3rem]">
                  <Button variant="contained" type="submit" color="primary">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  )
}

export { ResourceCreationStep }
