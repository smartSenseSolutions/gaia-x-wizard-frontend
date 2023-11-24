import { API, MasterType } from '@wizard/utils/constants'
import { ApiResponse } from '@wizard/models/api.model'
import { AsyncReqParam, parseAPI } from '@wizard/utils/helpers'
import { getAPI, postAPI } from '@wizard/utils/api-manager'
import {
  EntityType,
  RegistrationType,
  SubDivision,
} from '@wizard/models/master-data.model'
import { Pagination } from '@wizard/models/base.model'

export interface CheckRegistrationRequest {
  queryParams: { email: string }
}

export interface CheckRegistrationResponsePayload {
  userRegistered: boolean
  deviceConfigured: boolean
}

export const checkRegistrationAPI = (
  request: CheckRegistrationRequest
): Promise<ApiResponse<CheckRegistrationResponsePayload>> =>
  getAPI(
    API.PUBLIC.CHECK_REGISTRATION.URL,
    {},
    true,
    false,
    true,
    true,
    request.queryParams
  )

export interface GetMasterRequest {
  pathParams: {
    dataType: MasterType
  }
  queryParams: AsyncReqParam
}

export interface GetMasterResponsePayload {
  content: RegistrationType[] | SubDivision[] | EntityType[]
  pageable: Pagination
}

export const getMaster = (
  request: GetMasterRequest
): Promise<ApiResponse<GetMasterResponsePayload>> =>
  postAPI(
    parseAPI(API.PUBLIC.MASTER_DATA.URL, request.pathParams),
    request.queryParams,
    {},
    false,
    false,
    false,
    false
  )

export interface RegisterParticipantRequest {
  body: {
    email: string
    onboardRequest: {
      legalName: string
      shortName: string
      entityType: string
      ownDid: boolean
      acceptedTnC: boolean
      credential: {
        legalParticipant: {
          credentialSubject: {
            'gx:legalName': string
            'gx:headquarterAddress': {
              'gx:countrySubdivisionCode': string
            }
            'gx:legalAddress': {
              'gx:countrySubdivisionCode': string
            }
            'gx:parentOrganization'?: {
              id: string
            }[]
            'gx:subOrganization'?: {
              id: string
            }[]
          }
        }
        legalRegistrationNumber: {
          [key: string]: string
        }
      }
    }
  }
}

export const registerParticipant = (
  request: RegisterParticipantRequest
): Promise<ApiResponse<void>> => postAPI(API.PUBLIC.REGISTER.URL, request.body)

export interface ResendEmailRequest {
  body: { email: string }
}

export const resendEmail = (
  request: ResendEmailRequest,
  showLoader = true,
  showSuccessAlert = true
): Promise<ApiResponse<void>> =>
  postAPI(
    API.PUBLIC.RESEND_EMAIL.URL,
    request.body,
    {},
    showLoader,
    showSuccessAlert
  )
