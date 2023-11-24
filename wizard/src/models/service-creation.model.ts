import { AsyncReqParam } from '@wizard/utils/helpers'
import { ListApiParamType, Pagination } from './base.model'
type OptionItem = {
  label: string
  value: string
}
export interface AggregationOfVc {
  id: string
  name: string
  typeLabel: string
  credential: {
    id: string
    vcUrl: string
  }
  selfDescription: string
  createdAt: string | number
}

export interface AggregationOfVcOption {
  type: string
  selfDescription: string
  label: string
  value: string
}

export interface AggregationOfVcPayload {
  content: AggregationOfVc[]
  pageable: Pagination
}

interface Criterion {
  column?: string
  operator?: string
  values?: string[]
}

export interface GetMasterParams {
  page: number
  size: number
  criteriaOperator?: string
  criteria?: Criterion[]
}
export interface SelectInputValue {
  label: string
  value: string
}

export interface ServiceFormValues {
  serviceName: string
  othersPolicy: string[]
  termsUrl: string
  description: string
  dependsOn: SelectInputValue[]
  supportedStandards: SelectInputValue[]
  locationOfService: SelectInputValue[]
  vcUrl: SelectInputValue[]
  requestType: SelectInputValue
  accessType: SelectInputValue
  formateType: SelectInputValue[]
}

export interface ServiceCreationThirdStep {
  participantJson: string
  verificationMethodId: string
  signWithPrivateKey: string
  storeForFuture: boolean
}

export interface ServiceOfferingFinalFormPrototype
  extends ServiceFormValues,
    ServiceCreationThirdStep {
  labelLevelCs: object
}

export interface ServiceOfferValidateParams {
  name: string
  description: string
  credentialSubject: object
}

export interface ServiceCreationComponentProps {
  onClickNext: () => void
  setServiceCreationForm?: React.Dispatch<
    React.SetStateAction<ServiceOfferingFinalFormPrototype | any>
  >
  serviceCreationForm?: ServiceOfferingFinalFormPrototype | any
  onClickPrev: () => void
  isSubmitLoading: boolean
  onSubmitForm: (value?: ServiceCreationThirdStep) => void
  isPrivate?: boolean
}

export interface FormOptionInterface {
  requestType: OptionItem[]
  accessType: OptionItem[]
}

export interface CreateServiceOfferParamType {
  name: string
  verificationMethod?: string | null
  description?: string
  participantJsonUrl?: string
  privateKey?: string | null
  credentialSubject: object | null
}
export interface CreatedServiceResponseType {
  description: string
  name: string
  vcJson: object
  vcUrl: string
}

export type OfferChangeParam = {
  id?: string | number | undefined
  label: string
  description?: string | undefined
}

export interface LabelLevelCs {
  [key: string]: {
    evidence: {
      website: string
      pdf: Record<string, any>
      vc: Record<string, any>
    }
    response: string
    reason: string
  }
}
export interface OfferCreationSuccessProps {
  url: string
  title: string
  msg: string
}

export interface DependsVCOptionsRequest {
  queryParams: AsyncReqParam
}
export interface PostValidateServiceOfferRequest {
  queryParams: ServiceOfferValidateParams
}
export interface PostCreateServiceOfferRequest {
  queryParams: CreateServiceOfferParamType
}

export interface ServiceOfferingListRequest {
  pathParams: {
    participantId: string
  }
  queryParams: ListApiParamType
}
export interface ServiceOfferingDetailsRequest {
  pathParams: {
    participantId: string
    serviceOfferId: string
  }
}
