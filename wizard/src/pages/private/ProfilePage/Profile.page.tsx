import { ProfileDetails, ProfileHeader } from '@wizard/components'
import { useAuth } from '@wizard/hooks'
import { useEffect, useState } from 'react'
import { participantProfile } from '@wizard/api/profile.api'
import { ParticipantProfileResponse } from '@wizard/models/profile.model'

const ProfilePage = () => {
  const [response, setResponse] = useState<ParticipantProfileResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const participantId = auth?.userConfig?.id

  useEffect(() => {
    getParticipantApi()
  }, [participantId])

  const getParticipantApi = async () => {
    setIsLoading(true)
    try {
      if (participantId) {
        const res = await participantProfile({ pathParams: { participantId } })
        setResponse(res.payload)
        setIsLoading(false)
      }
    } catch (e) {
      setIsLoading(false)
    }
  }

  return (
    <div className="pl-[1rem] pr-[1rem]">
      <ProfileHeader
        response={response}
        participantId={participantId}
        isLoading={isLoading}
      />
      <ProfileDetails response={response} isLoading={isLoading} />
    </div>
  )
}

export default ProfilePage
