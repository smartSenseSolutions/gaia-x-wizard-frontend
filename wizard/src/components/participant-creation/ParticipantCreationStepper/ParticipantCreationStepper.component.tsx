import { ContainerCard } from '@wizard/components'
import { getAlert } from '@wizard/hooks/useAlert.hooks'
import { ParticipantCreationContainerTwo } from '../ParticipantCreationContainerTwo'
import { Stepper } from '@gaia-x-frontend/components-lib'
import { useAuth } from '@wizard/hooks'
import { useEffect, useState } from 'react'
import { UserConfig } from '@wizard/models/check-config.model'
import {
  OnBoardParticipantRequest,
  ResumeDIDRequest,
  ResumeParticipantRequest,
  getConfigAPI,
  onBoardParticipantAPI,
  resumeDidAPI,
  resumeParticipantAPI,
} from '@wizard/api/onboard.api'
import { ZERO } from '@wizard/utils/constants'
import {
  CERT_PROGRESS,
  STEPS,
  ParticipantCreationSteps,
  MAX_RETRY,
  RECALL_API,
} from './ParticipantCreationStepper.constants'

const ParticipantCreationStepper = () => {
  const auth = useAuth()
  const [activeStep, setActiveStep] = useState<undefined | number>()
  const [showButton, setShowButton] = useState<boolean>(false)
  const [config, setConfig] = useState<UserConfig | undefined>()
  const [maxRetry, setMaxRetry] = useState<number>(ZERO)
  const [errorStep, setErrorStep] = useState<number | undefined>()

  useEffect(() => {
    if (!showButton) {
      getConfig()
    }
  }, [auth])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showButton && maxRetry <= MAX_RETRY) {
        getConfig()
      }
    }, RECALL_API)
    return () => {
      clearInterval(interval)
    }
  }, [setActiveStep, showButton, maxRetry])

  const onBoardParticipant = async (participantId: string) => {
    const request: OnBoardParticipantRequest = {
      pathParams: { participantId },
      body: { ownDid: false },
    }
    await onBoardParticipantAPI(request)
  }

  const resumeDid = async (participantId: string) => {
    const request: ResumeDIDRequest = {
      pathParams: { participantId },
    }
    await resumeDidAPI(request)
  }

  const resumeParticipantJson = async (participantId: string) => {
    const request: ResumeParticipantRequest = {
      pathParams: { participantId },
    }
    await resumeParticipantAPI(request)
  }

  const getConfig = () => {
    if (!showButton) {
      getConfigAPI().then((res) => {
        // setStatus(res.payload.status)
        switch (res.payload.status) {
          case 0:
            if (auth?.userConfig?.id !== '')
              onBoardParticipant(auth?.userConfig?.id)
            setActiveStep(ParticipantCreationSteps.Started)
            break

          case CERT_PROGRESS.STARTED:
            setActiveStep(ParticipantCreationSteps.Started)
            break

          case CERT_PROGRESS.DOMAIN_CREATED:
            setActiveStep(ParticipantCreationSteps.SubdomainCreated)
            break

          case CERT_PROGRESS.DOMAIN_CREATION_FAILED:
            setActiveStep(ParticipantCreationSteps.Started)
            getAlert('error', 'Domain Creation failed')
            setErrorStep(ParticipantCreationSteps.SubdomainCreated)
            setMaxRetry(5)
            break

          case CERT_PROGRESS.CERTIFICATE_CREATED:
            setActiveStep(ParticipantCreationSteps.CertificateCreated)
            break

          case CERT_PROGRESS.CERTIFICATE_CREATION_FAILED:
            setActiveStep(ParticipantCreationSteps.SubdomainCreated)
            setErrorStep(ParticipantCreationSteps.CertificateCreated)
            getAlert('error', 'Certificate Creation failed')
            setMaxRetry(5)
            break

          case CERT_PROGRESS.INGRESS_CREATED:
            setActiveStep(ParticipantCreationSteps.IngressCreated)
            break

          case CERT_PROGRESS.INGRESS_CREATION_FAILED:
            setActiveStep(ParticipantCreationSteps.CertificateCreated)
            setErrorStep(ParticipantCreationSteps.IngressCreated)
            getAlert('error', 'Ingress Creation failed')
            setMaxRetry(5)
            break

          case CERT_PROGRESS.DID_JSON_CREATION_FAILED:
            if (auth?.userConfig?.id !== '') resumeDid(auth?.userConfig?.id)
            setActiveStep(ParticipantCreationSteps.IngressCreated)
            setMaxRetry((prev) => prev + 1)
            if (maxRetry >= MAX_RETRY) {
              setErrorStep(ParticipantCreationSteps.IngressCreated)
              getAlert('error', 'Did Creation Failed')
            }
            break

          case CERT_PROGRESS.DID_JSON_CREATED:
            setActiveStep(ParticipantCreationSteps.DidCreated)
            setMaxRetry(0)
            break

          case CERT_PROGRESS.PARTICIPANT_JSON_CREATION_FAILED:
            if (auth?.userConfig?.id !== '')
              resumeParticipantJson(auth?.userConfig.id)
            setActiveStep(ParticipantCreationSteps.DidCreated)
            setMaxRetry((prev) => prev + 1)
            if (maxRetry >= MAX_RETRY) {
              setErrorStep(ParticipantCreationSteps.DidCreated)
              getAlert('error', 'Legal Participant Creation Failed')
            }
            break

          case CERT_PROGRESS.PARTICIPANT_JSON_CREATED:
            setActiveStep(ParticipantCreationSteps.JsonCreated)
            setMaxRetry(0)
            setShowButton(true)
            setConfig(res.payload)
            break

          case CERT_PROGRESS.CERTIFICATE_CREATION_IN_PROCESS:
            setActiveStep(ParticipantCreationSteps.SubdomainCreated)
            break

          default:
            // Handle any other status cases
            break
        }
      })
    }
  }

  return (
    <div>
      <ParticipantCreationContainerTwo
        title={`Please wait\nwhile we set things up for you`}
      >
        <ContainerCard headerTitle={'🏗️ API at work. Please wait...'}>
          <div className="pl-[9.9rem] pt-[6.7rem] pb-[5rem] max-2xl:pl-[5rem]">
            <Stepper
              steps={STEPS}
              activeStep={activeStep ? activeStep : 0}
              handleButton={() => {
                if (config) auth?.setConfig(config)
              }}
              buttonText={'Proceed'}
              showButton={showButton}
              errorStep={errorStep}
            />
          </div>
        </ContainerCard>
      </ParticipantCreationContainerTwo>
    </div>
  )
}

export { ParticipantCreationStepper }
