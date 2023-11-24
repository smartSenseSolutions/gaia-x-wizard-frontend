import DidFormStyle from './DidForm.module.scss'
import { DidFormValue } from '@wizard/models/participant.model'
import { Field, Form } from 'react-final-form'
import { HttpStatus } from '@wizard/utils/constants'
import { useAuth } from '@wizard/hooks'
import { useState } from 'react'
import {
  OnBoardParticipantRequest,
  getConfigAPI,
  onBoardParticipantAPI,
} from '@wizard/api/onboard.api'
import {
  Button,
  Checkbox,
  Divider,
  InputField,
} from '@gaia-x-frontend/components-lib'
import {
  validationCheck,
  removeEmptyFields,
  validateRequired,
  validatePrivateKey,
} from '@wizard/utils/helpers'

const DidForm = () => {
  const [disable, setDisable] = useState(false)
  const auth = useAuth()
  const [ownDID, setOwnDID] = useState<boolean>(true)
  const initialFormState = {
    verificationMethod: '',
    privateKey: '',
    issuer: '',
    store: false,
  }

  const validate = (values: DidFormValue) => {
    const params = {
      verificationMethod: validateRequired(
        values['verificationMethod'],
        'Verification Method'
      ),
      privateKey: validatePrivateKey(values['privateKey']),
      issuer: validateRequired(values['issuer'], 'Issuer'),
    }
    if (ownDID) {
      return validationCheck(params)
    }
    return {}
  }

  const onSubmit = (values: DidFormValue) => {
    setDisable(true)
    if (ownDID) {
      const params = removeEmptyFields<DidFormValue>({
        ...values,
        ownDid: true,
      })
      const request: OnBoardParticipantRequest = {
        pathParams: { participantId: auth.userConfig.id },
        body: params,
      }
      onBoardParticipantAPI(request)
        .then((res) => {
          if (res.status == HttpStatus.Success) {
            getConfigAPI()
              .then((res) => {
                auth?.setConfig(res.payload)
              })
              .catch(() => {
                // Log error
              })
          }
        })
        .catch(() => {
          // Log error
        })
    } else {
      const request: OnBoardParticipantRequest = {
        pathParams: { participantId: auth.userConfig.id },
        body: { ownDid: false },
      }
      onBoardParticipantAPI(request)
        .then((res) => {
          if (res.status == HttpStatus.Success) {
            getConfigAPI()
              .then((res) => {
                auth?.setConfig(res.payload)
              })
              .catch(() => {
                // Log error
              })
          }
        })
        .catch(() => {
          // Log error
        })
    }
  }

  return (
    <div className={DidFormStyle.container}>
      <Form
        initialValues={{ ...initialFormState }}
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <Field
                name="verificationMethod"
                render={({ input, meta }) => (
                  <InputField
                    {...input}
                    variant="standard"
                    label="Verification Method Id"
                    fullWidth
                    placeholder="Enter Verification Method ID"
                    error={meta.touched && meta.error}
                    helperText={
                      meta.touched && meta.error && <span>{meta.error}</span>
                    }
                    disabled={!ownDID}
                  />
                )}
              />
            </div>
            <div className="mb-[2rem]">
              <Field
                name="privateKey"
                render={({ input, meta }) => (
                  <InputField
                    {...input}
                    variant="standard"
                    label="Private Key"
                    fullWidth
                    placeholder="Enter Private Key"
                    error={meta.touched && meta.error}
                    helperText={
                      meta.touched && meta.error && <span>{meta.error}</span>
                    }
                    multiline
                    rows={3}
                    disabled={!ownDID}
                  />
                )}
              />
            </div>
            <div>
              <Field
                name="issuer"
                render={({ input, meta }) => (
                  <InputField
                    {...input}
                    variant="standard"
                    label="Issuer (DID)"
                    fullWidth
                    placeholder="Enter Issuer DID"
                    error={meta.touched && meta.error}
                    helperText={
                      meta.touched && meta.error && <span>{meta.error}</span>
                    }
                    disabled={!ownDID}
                  />
                )}
              />
            </div>
            <div>
              <Field
                name="store"
                type="checkbox"
                render={({ input }) => (
                  <label>
                    <Checkbox
                      {...input}
                      label={
                        'Store my Private Key with encryption for future use'
                      }
                      disabled={!ownDID}
                    />
                  </label>
                )}
              />
            </div>
            <div
              className={
                DidFormStyle.container__Divider +
                ' mt-[4rem] mb-[4rem] text-[1.8rem] font-[400]'
              }
            >
              <Divider text={'or'} />
            </div>
            <div>
              <p className={DidFormStyle.container__Message + ' text-[2rem]'}>
                Did you just realise that you don't have the above information
                and would like us to create your DID solution? Select the
                following option and proceed.
              </p>
            </div>
            <div className="mt-[3rem]">
              <label>
                <Checkbox
                  onChange={(event) => {
                    const value = event.target.checked
                    setOwnDID(!value)
                    if (value) {
                      form.restart()
                    }
                  }}
                  label={"We don't already have DID and Private Key"}
                />
              </label>
            </div>

            <div className="flex justify-center mt-[3rem]">
              <Button
                variant="contained"
                type="submit"
                color="primary"
                className="mt-[2rem]"
                disabled={disable}
              >
                Proceed
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  )
}
export { DidForm }
