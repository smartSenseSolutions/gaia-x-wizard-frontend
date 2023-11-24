import ServiceCreateStyled from './ServiceCreate.module.scss'
import { AppLoader } from '@wizard/components/shared/AppLoader'
import { CHIPS_OPTIONS, MasterType } from '@wizard/utils/constants'
import { Field, Form } from 'react-final-form'
import { FormApi } from 'final-form'
import { getAlert } from '@wizard/hooks'
import { getMaster } from '@wizard/api/auth.api'
import { postValidateServiceOffer } from '@wizard/api/serviceCreation.api'
import { useEffect, useState } from 'react'
import {
  AsyncSearchSelect,
  Button,
  Card,
  InputChips,
  InputField,
  Select,
  TextArea,
} from '@gaia-x-frontend/components-lib'
import {
  onLoadDependsVcOption,
  onLoadFormatType,
  onLoadStandardOption,
} from './ServiceCreate.helper'
import {
  validationCheck,
  AsyncReqParam,
  onLoadSubDivisions,
  removeEmptyFields,
  validateRequired,
  validateUrlChip,
  validateUrlAsRequired,
  onLoadVcOption,
} from '@wizard/utils/helpers'
import {
  FormOptionInterface,
  ServiceFormValues,
  ServiceOfferingFinalFormPrototype,
} from '@wizard/models/service-creation.model'
import { ErrorPayload } from '@wizard/models/api.model'
interface ServiceCreationComponentProps {
  onClickNext: () => void
  setServiceCreationForm?: React.Dispatch<
    React.SetStateAction<ServiceOfferingFinalFormPrototype>
  >
  serviceCreationForm?: ServiceOfferingFinalFormPrototype | any
}
const ServiceCreate = ({
  onClickNext,
  setServiceCreationForm,
  serviceCreationForm,
}: ServiceCreationComponentProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formOptions, setFormOptions] = useState<FormOptionInterface>({
    requestType: [],
    accessType: [],
  })
  const initialFormState = {
    serviceName: serviceCreationForm?.serviceName,
    description: serviceCreationForm?.description,
    termsUrl: serviceCreationForm?.termsUrl,
    dependsOn: serviceCreationForm?.dependsOn,
    supportedStandards: serviceCreationForm?.supportedStandards,
    locationOfService: serviceCreationForm?.locationOfService,
    othersPolicy: serviceCreationForm?.othersPolicy,
    vcUrl: serviceCreationForm?.vcUrl,
    requestType: serviceCreationForm?.requestType,
    accessType: serviceCreationForm?.accessType,
    formateType: serviceCreationForm?.formateType,
  }

  const defaultVcParams: AsyncReqParam = {
    page: -1,
    size: 20,
    criteriaOperator: 'OR',
  }
  const defaultStandardParams: AsyncReqParam = {
    page: -1,
    size: 20,
  }

  const defaultFormateParams: AsyncReqParam = {
    page: -1,
    size: 20,
  }
  const defaultDependsVcParams: AsyncReqParam = {
    page: -1,
    size: 20,
    criteriaOperator: 'OR',
  }

  const defaultDivisionFilterParams: AsyncReqParam = {
    page: -1,
    size: 20,
    criteriaOperator: 'OR',
  }

  useEffect(() => {
    getFormOptions()
      .then((res) => {
        setFormOptions(res)
      })
      .catch(() => {
        // Log error
      })
  }, [])

  const getFormOptions = async () => {
    const param = {
      page: 0,
      size: 500,
    }
    const responses = await Promise.all([
      getMaster({
        pathParams: { dataType: MasterType.RequestType },
        queryParams: param,
      }),
      getMaster({
        pathParams: { dataType: MasterType.AccessType },
        queryParams: param,
      }),
    ])
    return {
      requestType: responses[0].payload.content.map((item) => ({
        label: item.type,
        value: item.type,
      })),
      accessType: responses[1].payload.content.map((item) => ({
        label: item.type,
        value: item.type,
      })),
    }
  }

  const validate = (values: ServiceFormValues) => {
    const {
      serviceName,
      termsUrl,
      vcUrl: aggregationValues,
      dependsOn: dependsOnValue,
      requestType,
      locationOfService,
      accessType,
      formateType,
    } = values

    const aggregationUrls = (aggregationValues || []).map((chip) => chip.value)
    const dependsOnUrl = (dependsOnValue || []).map((chip) => chip.value)

    return validationCheck({
      serviceName: validateRequired(serviceName, 'Service name'),
      termsUrl: validateUrlAsRequired(termsUrl, 'T&C URL'),
      vcUrl: validateUrlChip(aggregationUrls, 'Aggregation of', true),
      dependsOn: validateUrlChip(dependsOnUrl, 'Depends On'),
      requestType: validateRequired(requestType, 'Request type'),
      locationOfService: validateRequired(locationOfService, 'Policy'),
      accessType: validateRequired(accessType, 'Access type'),
      formateType: validateRequired(formateType, 'Formate type'),
    })
  }

  const handleFormSubmit = (
    formValues: ServiceFormValues,
    form: FormApi<ServiceFormValues, ServiceFormValues>
  ) => {
    if (isLoading) return
    setIsLoading(true)
    const { dirty: isFormDirtySinceLastSubmit } = form.getState()
    if (isFormDirtySinceLastSubmit) {
      const {
        serviceName,
        description,
        termsUrl,
        locationOfService,
        othersPolicy,
        requestType,
        accessType,
        formateType,
        vcUrl,
        dependsOn,
        supportedStandards,
      } = formValues

      const param = {
        name: serviceName,
        description,
        credentialSubject: {
          'gx:termsAndConditions': {
            'gx:URL': termsUrl,
          },
          'gx:policy': {
            'gx:location': (locationOfService || []).map((item) => item.value),
            'gx:customAttribute': othersPolicy?.length
              ? JSON.stringify(othersPolicy)
              : null,
          },
          'gx:dataAccountExport': {
            'gx:requestType': requestType,
            'gx:accessType': accessType,
            'gx:formatType': (formateType || []).map((item) => item.label),
          },
          'gx:aggregationOf': (vcUrl || []).map((item) => ({ id: item.value })),
          ...(dependsOn?.length
            ? { 'gx:dependsOn': dependsOn.map((item) => ({ id: item?.value })) }
            : null),
          'gx:dataProtectionRegime': supportedStandards?.map(
            (item) => item.value
          ),
          type: 'gx:ServiceOffering',
        },
      }

      const queryParams = removeEmptyFields<typeof param>(param)
      postValidateServiceOffer({ queryParams })
        .then(() => {
          if (setServiceCreationForm) {
            setServiceCreationForm(
              (state: ServiceOfferingFinalFormPrototype) => ({
                ...state,
                ...formValues,
              })
            )
          }
          onClickNext()
        })
        .catch((err: ErrorPayload) => {
          getAlert('error', err.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      onClickNext()
    }
  }
  return (
    <div
      className={ServiceCreateStyled.container + ' flex flex-col items-center'}
    >
      <h3 className="w-[101.6rem] max-2xl:w-[80rem] text-[2rem] mb-[2.8rem] font-[600]">
        Fill the following form to publish your service to the relevant Gaia-X
        catalogue
      </h3>
      <div className={ServiceCreateStyled.container + ' relative '}>
        {isLoading && (
          <div className=" absolute w-[100%] bg-white/60 h-[100%] z-10 ">
            <AppLoader />
          </div>
        )}
        <Form
          initialValues={{ ...initialFormState }}
          onSubmit={handleFormSubmit}
          validate={validate}
          keepDirtyOnReinitialize
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} noValidate>
              <section className="flex w-[101.6rem] max-2xl:w-[80rem] gap-[1.6rem]">
                <div className="flex min-w-[calc(50%-0.8rem)] max-w-[50rem] flex-col gap-[1.6rem]">
                  <Card title="General Information">
                    <>
                      <div className="pt-[1rem]">
                        <Field
                          name="serviceName"
                          render={({ input, meta }) => (
                            <InputField
                              {...input}
                              variant="standard"
                              label="Service name"
                              fullWidth
                              disabled={isLoading}
                              id="serviceName"
                              placeholder="Enter Service name"
                              tooltip="Service Name will be displayed in all lists/ catalogue"
                              error={meta.touched && meta.error}
                              required
                              helperText={
                                meta.touched &&
                                meta.error && <span>{meta.error}</span>
                              }
                            />
                          )}
                        />
                      </div>

                      <div className=" mt-[2rem] pb-[3rem]">
                        <Field
                          name="description"
                          render={({ input, meta }) => (
                            <TextArea
                              {...input}
                              variant="standard"
                              label="Description"
                              fullWidth
                              multiline
                              disabled={isLoading}
                              rows={5}
                              placeholder="Enter Description"
                              error={meta.touched && meta.error}
                              helperText={
                                meta.touched &&
                                meta.error && <span>{meta.error}</span>
                              }
                              tooltip="Explain what a customer can expect by using your Service"
                            />
                          )}
                        />
                      </div>
                    </>
                  </Card>

                  <Card
                    key={'Relations with other services'}
                    title="Relations with other services"
                  >
                    <>
                      <div className="pt-[2rem]">
                        <Field
                          name="vcUrl"
                          render={({ input, meta }) => (
                            <>
                              <AsyncSearchSelect
                                {...input}
                                label="Aggregation of* (VC URL)"
                                placeholder="Aggregation of* (VC URL)"
                                loadOptions={(searchString: string) =>
                                  onLoadVcOption(searchString, defaultVcParams)
                                }
                                isMulti={true}
                                isDisabled={isLoading}
                                isCreation
                                createLabel="Add"
                                menuPlacement="auto"
                                tooltip="Enter one or more Gaia-X compliant Resource Resolvable ID/ URL with SD or Select Resource from the List"
                              />
                              {meta.touched && meta.error && (
                                <span className="field-error">
                                  {meta.error}
                                </span>
                              )}
                            </>
                          )}
                        />
                      </div>
                      <div className=" mt-[5rem] pb-[8.7rem]">
                        <Field
                          name="dependsOn"
                          render={({ input, meta }) => (
                            <>
                              <AsyncSearchSelect
                                {...input}
                                label="Depends on (VC URL)"
                                placeholder="Depends on (VC URL)"
                                isCreation
                                createLabel="Add"
                                isDisabled={isLoading}
                                loadOptions={(searchString: string) =>
                                  onLoadDependsVcOption(
                                    searchString,
                                    defaultDependsVcParams
                                  )
                                }
                                isMulti={true}
                                menuPlacement="auto"
                                tooltip="Enter one or more Gaia-X compliant Service Offering Resolvable ID/ URL with SD or Select Service Offering from the List"
                              />
                              {meta.touched && meta.error && (
                                <span className="field-error">
                                  {meta.error}
                                </span>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </>
                  </Card>

                  <Card
                    key={'Compliance with data protection regimes'}
                    title="Compliance with data protection regimes"
                  >
                    <div className="pt-[2rem] mb-[3rem]">
                      <Field
                        name="supportedStandards"
                        render={({ input, meta }) => (
                          <>
                            <AsyncSearchSelect
                              {...input}
                              label="Supported standards"
                              placeholder="Supported standards"
                              isDisabled={isLoading}
                              loadOptions={(searchString: string) =>
                                onLoadStandardOption(
                                  searchString,
                                  defaultStandardParams
                                )
                              }
                              isMulti={true}
                              menuPlacement="auto"
                              tooltip="Select one or more Personal Data Protection Regime being followed"
                            />
                            {meta.touched && meta.error && (
                              <span className="field-error">{meta.error}</span>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </Card>
                </div>
                <div className="flex flex-col min-w-[calc(50%-0.8rem)] max-w-[50rem] gap-[1.6rem]">
                  <Card title="Policy" key={'Policy'}>
                    <div className="pt-[1.5rem] pb-[3rem]">
                      <Field
                        name="locationOfService"
                        render={({ input, meta }) => (
                          <>
                            <AsyncSearchSelect
                              {...input}
                              label="Location of service*"
                              placeholder="Location of service*"
                              isDisabled={isLoading}
                              menuPlacement={'auto'}
                              isMulti
                              loadOptions={(searchString: string) =>
                                onLoadSubDivisions(
                                  searchString,
                                  defaultDivisionFilterParams
                                )
                              }
                              tooltip="Select one or more locations where your service will be available"
                            />
                            {meta.touched && meta.error && (
                              <span className="field-error">{meta.error}</span>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <div className="">
                      <Field
                        name="othersPolicy"
                        render={({ input }) => (
                          <InputChips
                            {...input}
                            variant="standard"
                            label="Others"
                            fullWidth
                            placeholder="Enter policy"
                            addOnWhichKey={CHIPS_OPTIONS}
                            addOnBlur
                            tooltip="Enter one or more URLs to a page defining Access Control, throttling, Usage, Retention etc"
                          />
                        )}
                      />
                    </div>
                  </Card>

                  <Card title="Terms & Conditions" key={'Terms & Conditions'}>
                    <div className="pt-[1rem] pb-[3rem]">
                      <Field
                        name="termsUrl"
                        render={({ input, meta }) => (
                          <InputField
                            {...input}
                            variant="standard"
                            label="T&C URL"
                            fullWidth
                            disabled={isLoading}
                            id="termsUrl"
                            placeholder="Enter T&C URL"
                            error={meta.touched && meta.error}
                            required
                            helperText={
                              meta.touched &&
                              meta.error && <span>{meta.error}</span>
                            }
                            tooltip="Enter URL of your Terms and Conditions Page for use of your Service Offering"
                          />
                        )}
                      />
                    </div>
                  </Card>

                  <Card title="Technical Details" key={'Technical Details'}>
                    <div className="pt-[1rem]">
                      <Field
                        name="requestType"
                        render={({ input, meta }) => (
                          <Select
                            {...input}
                            items={formOptions?.requestType}
                            required
                            id="requestType"
                            disabled={isLoading}
                            label="Request type"
                            error={meta.touched && meta.error}
                            helperText={
                              meta.touched &&
                              meta.error && <span>{meta.error}</span>
                            }
                            tooltip="Select the Means to request Data Retrieval"
                          />
                        )}
                      />
                    </div>

                    <div className="mt-[1rem] ">
                      <Field
                        name="accessType"
                        render={({ input, meta }) => (
                          <Select
                            {...input}
                            items={formOptions?.accessType}
                            required
                            disabled={isLoading}
                            id="accessType"
                            label="Access type"
                            error={meta.touched && meta.error}
                            helperText={
                              meta.touched &&
                              meta.error && <span>{meta.error}</span>
                            }
                            tooltip="Select the Type of Data Support"
                          />
                        )}
                      />
                    </div>

                    <div className="mt-[3rem] pb-[3rem] ">
                      <Field
                        name="formateType"
                        render={({ input, meta }) => (
                          <>
                            <AsyncSearchSelect
                              {...input}
                              label="Format type*"
                              placeholder="Format type*"
                              isMulti
                              isDisabled={isLoading}
                              menuPlacement={'auto'}
                              loadOptions={(search: string) =>
                                onLoadFormatType(search, defaultFormateParams)
                              }
                              tooltip="Select the Media Type of Data"
                            />
                            {meta.touched && meta.error && (
                              <span className="field-error">{meta.error}</span>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </Card>
                </div>
              </section>

              <div className="mt-[3rem] text-right pb-[3rem]">
                <Button disabled={isLoading} type="submit" variant="contained">
                  Next
                </Button>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  )
}

export { ServiceCreate }
