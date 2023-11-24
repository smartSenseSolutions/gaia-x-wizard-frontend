import { useLoaderData } from 'react-router-dom'
import {
  ParticipantCreationContainerOne,
  RegisterParticipantForm,
} from '@wizard/components'
import { OnBoardingFormProps } from '@wizard/models/onBoard.model'

const RegisterParticipantPage = () => {
  const data = useLoaderData()

  return (
    <div>
      <ParticipantCreationContainerOne>
        <RegisterParticipantForm
          registrationTypes={(data as OnBoardingFormProps).registrationTypes}
          entityTypes={(data as OnBoardingFormProps).entityTypes}
        />
      </ParticipantCreationContainerOne>
    </div>
  )
}

export default RegisterParticipantPage
