import { DialogCustom, FormStepper } from '@gaia-x-frontend/components-lib'
import { getAlert } from '@wizard/hooks/useAlert.hooks'
import { getConfigAPI } from '@wizard/api/onboard.api'
import { postCreateServiceOffer } from '@wizard/api/serviceCreation.api'
import { PRIVATE, ROUTES_CONST } from '@wizard/routes/routes'
import { removeEmptyFields } from '@wizard/utils/helpers'
import { useAuth } from '@wizard/hooks'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ZERO } from '@wizard/utils/constants'
import {
  RequestLabel,
  ServiceCreate,
  ESign,
  OfferingCreationSuccessDialogBody,
} from '@wizard/components'
import {
  CreatedServiceResponseType,
  OfferChangeParam,
  ServiceCreationThirdStep,
  ServiceOfferingFinalFormPrototype,
} from '@wizard/models/service-creation.model'
import { ErrorPayload } from '@wizard/models/api.model'

const ServiceOfferingCreation = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [createdServiceData, setCreatedServiceData] =
    useState<CreatedServiceResponseType>()
  const [isCreateServiceLoading, setIsCreateServiceLoading] = useState(false)
  const [activeStep, setActiveStep] = useState<number>(ZERO)
  const [serviceCreationForm, setServiceCreationForm] =
    useState<ServiceOfferingFinalFormPrototype>()
  const stepComponents = [ServiceCreate, RequestLabel, ESign]
  const CurrentStepComponent = stepComponents[activeStep] || null
  const formStepper = auth?.userConfig?.keyStored
    ? [
        {
          label: 'Service details',
          description: '',
        },
        {
          label: 'Request label',
          description: '',
        },
      ]
    : [
        {
          label: 'Service details',
          description: '',
        },
        {
          label: 'Request label',
          description: '',
        },
        {
          label: 'eSign form',
          description: '',
        },
      ]

  const onChangeEvent = (steps: OfferChangeParam) => {
    formStepper.forEach((stepItem, index) => {
      if (stepItem.label === steps.label) setActiveStep(index)
    })
  }
  const handleClickNext = () => {
    setActiveStep((step) => step + 1)
  }
  const handleClickPrev = () => {
    setActiveStep((step) => step - 1)
  }

  const handleSubmitForm = (value?: ServiceCreationThirdStep) => {
    if (isCreateServiceLoading) return
    setIsCreateServiceLoading(true)
    const param = {
      name: serviceCreationForm!.serviceName,
      verificationMethod: value?.verificationMethodId
        ? value?.verificationMethodId
        : null,
      ...(serviceCreationForm?.description
        ? { description: serviceCreationForm?.description }
        : null),
      ...(value?.storeForFuture ? { storeVault: value?.storeForFuture } : null),
      privateKey: value?.signWithPrivateKey ?? null,

      credentialSubject: {
        'gx:termsAndConditions': {
          'gx:URL': serviceCreationForm?.termsUrl,
        },
        'gx:policy': {
          'gx:location': serviceCreationForm?.locationOfService?.map(
            (item) => item.value
          ),
          ...(serviceCreationForm?.othersPolicy &&
          serviceCreationForm?.othersPolicy.length
            ? {
                'gx:customAttribute': JSON.stringify(
                  serviceCreationForm?.othersPolicy
                ),
              }
            : null),
        },
        'gx:dataAccountExport': {
          'gx:requestType': serviceCreationForm?.requestType,
          'gx:accessType': serviceCreationForm?.accessType,
          'gx:formatType': serviceCreationForm?.formateType?.map(
            (item) => item.label
          ),
        },
        'gx:aggregationOf': serviceCreationForm?.vcUrl?.map((item) => ({
          id: item.value,
        })),
        ...(serviceCreationForm?.dependsOn?.length
          ? {
              'gx:dependsOn': serviceCreationForm?.dependsOn?.map((item) => ({
                id: item?.value,
              })),
            }
          : null),
        ...(serviceCreationForm?.supportedStandards?.length
          ? {
              'gx:dataProtectionRegime':
                serviceCreationForm?.supportedStandards.map(
                  (item) => item.value
                ),
            }
          : null),
        'gx:criteria': serviceCreationForm?.labelLevelCs,
        type: 'gx:ServiceOffering',
      },
    }
    // FIXME: NEED TO REMOVE THIS FUNCTION IF GOT ERROR IN API
    const queryParams = removeEmptyFields<typeof param>(param)
    postCreateServiceOffer({ queryParams })
      .then((res) => {
        setCreatedServiceData(res.payload)
        setOpenConfirmation(true)
        if (value?.storeForFuture) {
          getConfigAPI()
            .then((res) => {
              auth?.setConfig(res.payload)
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
      .catch((err: ErrorPayload) => {
        getAlert('error', err?.message)
      })
      .finally(() => {
        setIsCreateServiceLoading(false)
      })
  }
  const handleCloseDialogue = () => {
    navigate(`/${PRIVATE}/${ROUTES_CONST.SERVICE_MANAGEMENT}`)
    setOpenConfirmation(false)
  }

  return (
    <div className="flex">
      <div className={' w-[30rem] pt-[3rem] pl-[2.8rem] border-[1px] bg-white'}>
        <FormStepper
          steps={formStepper}
          activeStep={activeStep}
          onClickLevel={(steps) => onChangeEvent(steps)}
        />
      </div>

      <div
        className={
          ' pt-[3rem] flex-1 px-[4rem] bg-white border-[1px] border-l-0 h-[calc(100vh-20.6rem)] overflow-auto'
        }
      >
        {CurrentStepComponent && (
          <CurrentStepComponent
            onClickNext={handleClickNext}
            onClickPrev={handleClickPrev}
            setServiceCreationForm={setServiceCreationForm}
            serviceCreationForm={serviceCreationForm}
            onSubmitForm={handleSubmitForm}
            isSubmitLoading={isCreateServiceLoading}
            isPrivate={true}
          />
        )}
      </div>
      <DialogCustom
        open={openConfirmation}
        title="Important information"
        children={
          <OfferingCreationSuccessDialogBody
            msg="Save this VC for your personal information. For your convenience, we also store this detail in the Platform"
            title="Service Offering JSON"
            url={createdServiceData?.vcUrl ?? ''}
          />
        }
        onClose={handleCloseDialogue}
        onSubmit={handleCloseDialogue}
        submitText="Proceed"
      />
    </div>
  )
}

export default ServiceOfferingCreation
