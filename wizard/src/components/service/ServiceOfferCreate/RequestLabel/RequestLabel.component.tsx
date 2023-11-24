import { useEffect, useState } from 'react'
import RequestLabelStyled from './RequestLabel.module.scss'
import { AppLoader } from '@wizard/components/shared/AppLoader'
import { Button } from '@gaia-x-frontend/components-lib'
import { getAlert, useAuth } from '@wizard/hooks'
import {
  LabelLevelCs,
  ServiceCreationComponentProps,
  ServiceOfferingFinalFormPrototype,
} from '@wizard/models/service-creation.model'
import { LABEL_LEVEL_RULE } from './RequestLabel.constants'

const RequestLabel = ({
  setServiceCreationForm,
  serviceCreationForm,
  onClickNext,
  onClickPrev,
  onSubmitForm,
  isSubmitLoading,
}: ServiceCreationComponentProps) => {
  const auth = useAuth()
  const [isIFrameLoaded, setIsIFrameLoaded] = useState(false)
  useEffect(() => {
    window.addEventListener(
      'message',
      ({ data, origin }: { data: string; origin: string }) => {
        if (data && origin === 'https://label.gxfs.dev') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          generateLabelLevelVC(JSON.parse(data))
        }
      }
    )
  }, [])
  const calcLabelLevel = (criteria: any) => {
    // Label level response by user
    // const criteria = credentialSubject['gx:criteria']

    // Constant Rules
    const dirtyData = []

    const levelRules = LABEL_LEVEL_RULE.BC
    for (const rulePoint of levelRules) {
      // eslint-disable-next-line no-prototype-builtins
      if (criteria.hasOwnProperty(rulePoint)) {
        const gxResponseObj = criteria[rulePoint]
        const response = gxResponseObj['gx:response']
        // Loop will break if any single response found not confirmed and will return last label level
        if (response !== 'Confirm') {
          dirtyData.push(criteria[rulePoint])
        }
      } else {
        console.log(
          __filename,
          'LabelLevel',
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          'Rule point key not found in criteria json - ' + rulePoint,
          ''
        )
        getAlert(
          'error',
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          'Rule point key not found in criteria json - ' + rulePoint
        )
        return false
      }
    }
    // }
    if (dirtyData.length > 0) {
      getAlert(
        'error',
        `Your service does not fulfil the criteria for basic conformity `
      )
      if (setServiceCreationForm) {
        setServiceCreationForm((state: ServiceOfferingFinalFormPrototype) => ({
          ...state,
          labelLevelCs: null,
        }))
      }
      return false
    }
    return true
  }

  const generateLabelLevelVC = (data: { ui: { datagroup_s: any } }) => {
    const {
      ui: { datagroup_s },
    } = data
    const labelLevelCS = extractLabelLevelData(datagroup_s)

    if (calcLabelLevel(labelLevelCS) && setServiceCreationForm) {
      setServiceCreationForm((state: ServiceOfferingFinalFormPrototype) => ({
        ...state,
        labelLevelCs: labelLevelCS,
      }))
    }
  }

  const extractLabelLevelData = (data: any): LabelLevelCs => {
    const labelLevelCS: any = {}
    for (const { dataset_s } of data) {
      for (const {
        form: { element_s },
      } of dataset_s) {
        const evidence = { 'gx:website': '', 'gx:pdf': '', 'gx:vc': '' }
        const labelLevel = {
          'gx:evidence': {},
          'gx:response': '',
          'gx:reason': '',
        }
        let llKey = ''
        for (const element_key in element_s) {
          const { type, value } = element_s[element_key]
          switch (type) {
            case 'label':
              // eslint-disable-next-line no-case-declarations
              const {
                options: { title },
              } = element_s[element_key]
              llKey = `gx:P${title.split(' ')[0]}`
              break

            case 'radio':
              labelLevel['gx:response'] = value.trim()
              break

            case 'textarea':
              labelLevel['gx:reason'] = value
              break

            case 'advanceInput':
              evidence['gx:website'] = value
              break

            case 'advanceUpload': {
              const {
                options: { uploadname },
              } = element_s[element_key]
              if (uploadname === 'Attestation PDF') {
                // TODO: Upload to S3 code here.
                evidence['gx:pdf'] = value
              } else if (uploadname === 'Verifiable Credential') {
                // TODO: Upload to S3 code here.
                evidence['gx:vc'] = value
              }
              break
            }

            case 'formSeparator':
              labelLevel['gx:evidence'] = { ...evidence }
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              labelLevelCS[llKey] = { ...labelLevel }
              break

            default:
              break
          }
        }
      }
    }
    return labelLevelCS
  }

  return (
    <div
      className={
        RequestLabelStyled.LLContainer + ' p-0 m-0 overflow-hidden relative'
      }
    >
      {(isSubmitLoading || !isIFrameLoaded) && (
        <div className=" absolute w-[100%] bg-white/60 h-[100%] z-10 ">
          <AppLoader />
        </div>
      )}
      <iframe
        id="mainframe"
        src="https://label.gxfs.dev/clone-wizard/"
        onLoad={() => {
          setIsIFrameLoaded(true)
        }}
      />
      <div className="mt-[3rem] w-[100%] text-right pb-[3rem] justify-end  flex gap-[2rem]">
        <Button
          variant="outlined"
          type="button"
          color="primary"
          className="mt-[2rem]"
          size="medium"
          onClick={onClickPrev}
        >
          Back
        </Button>
        {auth?.userConfig?.keyStored ? (
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className="mt-[2rem]"
            onClick={() => onSubmitForm()}
            disabled={!serviceCreationForm?.labelLevelCs || isSubmitLoading}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className="mt-[2rem]"
            onClick={onClickNext}
            disabled={!serviceCreationForm?.labelLevelCs}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}

export { RequestLabel }
