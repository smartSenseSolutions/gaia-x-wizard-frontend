import ResourceCreationStyled from './ResourceCreation.module.scss'
import { AuthContextType } from '@wizard/contexts/AuthContext'
import { DialogCustom, FormStepper } from '@gaia-x-frontend/components-lib'
import { getConfigAPI } from '@wizard/api/onboard.api'
import { KeyValueType } from '@wizard/models/base.model'
import { postCreateResourceCreation } from '@wizard/api/resourceCreation.api'
import { removeEmptyFields } from '@wizard/utils/helpers'
import { ROUTES_CONST } from '@wizard/routes/routes'
import { ServiceCreationThirdStep } from '@wizard/models/service-creation.model'
import { useAuth } from '@wizard/hooks'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ZERO } from '@wizard/utils/constants'
import {
  ResourceCreationStep,
  ESign,
  OfferingCreationSuccessDialogBody,
} from '@wizard/components'
import {
  ResourceCreationParamType,
  ResourceCreationResponseType,
  ResourceFormValue,
} from '@wizard/models/resource-creation.model'

type StepProps = {
  label: string
  description?: string
}

const ResourceCreationPage = () => {
  const auth: AuthContextType = useAuth()
  const navigate = useNavigate()
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [createdResourceData, setCreatedResourceData] =
    useState<ResourceCreationResponseType>()
  const [isCreateResourceLoading, setIsCreateResourceLoading] = useState(false)
  const [activeStep, setActiveStep] = useState<number>(ZERO)
  const [resourceCreationForm, setResourceCreationForm] =
    useState<ResourceFormValue>()
  const [resourceParams, setResourceParams] =
    useState<ResourceCreationParamType>()
  const stepComponents = [ResourceCreationStep, ESign]
  const CurrentStepComponent = stepComponents[activeStep] || null

  const formStepper = auth?.userConfig?.keyStored
    ? [
        {
          label: 'Resource details',
          description: '',
        },
      ]
    : [
        {
          label: 'Resource details',
          description: '',
        },
        {
          label: 'eSign form',
          description: '',
        },
      ]

  const onChangeEvent = (steps: StepProps) => {
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

  const handleSubmitForm = (
    value?: ServiceCreationThirdStep | KeyValueType
  ) => {
    if (isCreateResourceLoading) return
    setIsCreateResourceLoading(true)
    let params = {}
    if (value)
      if (auth?.userConfig?.keyStored) {
        params = value
      } else {
        params = {
          participantJsonUrl: value.participantJson,
          verificationMethod: value.verificationMethodId,
          privateKey: value.signWithPrivateKey,
          storeVault: value?.storeForFuture,
          ...resourceParams,
        }
      }
    params = removeEmptyFields<typeof params>(params)
    postCreateResourceCreation({
      pathParams: { participantId: auth?.userConfig?.id || '' },
      queryParams: params as ResourceCreationParamType,
    })
      .then((response) => {
        setCreatedResourceData(response.payload)
        setOpenConfirmation(true)
        if (value?.storeForFuture) {
          getConfigAPI()
            .then((res) => {
              auth?.setConfig(res.payload)
            })
            .catch((err) => {
              throw new err()
            })
        }
      })
      .catch(() => {
        setActiveStep(ZERO)
      })
      .finally(() => {
        setIsCreateResourceLoading(false)
      })
  }

  const handleCloseDialogue = () => {
    navigate(`/${ROUTES_CONST.PRIVATE}/${ROUTES_CONST.RESOURCE_MANAGEMENT}`)
    setOpenConfirmation(false)
  }

  return (
    <div className="flex mt-[3rem] bg-white">
      <div
        className={
          ResourceCreationStyled.ResourceCreationStepper +
          ' w-[30rem] pt-[3rem] pl-[2.8rem] h-[calc(100vh-20rem)]'
        }
      >
        <FormStepper
          steps={formStepper}
          activeStep={activeStep}
          onClickLevel={(steps) => onChangeEvent(steps)}
        ></FormStepper>
      </div>

      <div
        className={
          'h-[calc(100vh-20.7rem)] overflow-auto border-[1px] border-l-0 w-[100%]'
        }
      >
        {CurrentStepComponent && (
          <CurrentStepComponent
            isSubmitLoading={isCreateResourceLoading}
            setCreateResourceLoading={setIsCreateResourceLoading}
            onClickNext={handleClickNext}
            onClickPrev={handleClickPrev}
            setServiceCreationForm={setResourceCreationForm}
            setResourceParams={setResourceParams}
            resourceCreationForm={resourceCreationForm}
            onSubmitForm={handleSubmitForm}
            isPrivate={true}
          />
        )}
      </div>
      <DialogCustom
        open={openConfirmation}
        title="Resource Created Successfully"
        children={
          <OfferingCreationSuccessDialogBody
            msg="Save this VC for your personal information. For your convenience, we also store this detail in the Platform"
            url={createdResourceData?.vcUrl ? createdResourceData?.vcUrl : ''}
            title="Resource JSON"
          />
        }
        onClose={handleCloseDialogue}
        onSubmit={handleCloseDialogue}
        submitText="Proceed"
      />
    </div>
  )
}

export default ResourceCreationPage
