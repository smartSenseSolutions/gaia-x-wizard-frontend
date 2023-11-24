import { ParticipantCredentials } from '@wizard/models/onBoard.model'
import { useAuth } from '@wizard/hooks'
import { useEffect, useState } from 'react'
import {
  ExportParticipantDetailsRequest,
  exportParticipantDetailsAPI,
} from '@wizard/api/onboard.api'
import {
  ExportParticipantInformation,
  ParticipantCreationStepper,
  ProvideDIDInformation,
} from '@wizard/components'

const ParticipantCreationPage = () => {
  const auth = useAuth()

  const lp = auth?.userConfig?.legalParticipantUrl
  const ownDid = auth?.userConfig?.ownDidSolution
  const [apiResponse, setApiResponse] = useState<
    ParticipantCredentials | undefined
  >()

  useEffect(() => {
    if (lp) {
      const request: ExportParticipantDetailsRequest = {
        pathParams: {
          participantId: auth.userConfig.id,
        },
      }
      exportParticipantDetailsAPI(request)
        .then((res) => {
          setApiResponse(res.payload)
        })
        .catch(() => {
          // Log error
        })
    }
  }, [auth])

  return (
    <div>
      {lp ? (
        <ExportParticipantInformation apiResponse={apiResponse} />
      ) : ownDid ? (
        <ProvideDIDInformation />
      ) : (
        <ParticipantCreationStepper />
      )}
    </div>
  )
}

export default ParticipantCreationPage
