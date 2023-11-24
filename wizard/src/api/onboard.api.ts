import { ApiResponse } from '@wizard/models/api.model'
import { UserConfig } from '@wizard/models/check-config.model'
import {
  ParticipantCredentials,
  OnBoardParticipantResponse,
} from '@wizard/models/onBoard.model'
import { getAPI, postAPI } from '@wizard/utils/api-manager'
import { API } from '@wizard/utils/constants'
import { parseAPI } from '@wizard/utils/helpers'

export type OnBoardParticipantRequestBody = {
  issuer?: string
  verificationMethod?: string
  privateKey?: string
  store?: boolean
  ownDid: boolean
}
export interface OnBoardParticipantRequest {
  pathParams: {
    participantId: string
  }
  body: OnBoardParticipantRequestBody
}

export const onBoardParticipantAPI = (
  request: OnBoardParticipantRequest
): Promise<ApiResponse<OnBoardParticipantResponse>> =>
  postAPI(
    parseAPI(API.PARTICIPANT.ONBOARD.URL, request.pathParams),
    request.body,
    {},
    false,
    true,
    true
  )

export const getConfigAPI = (): Promise<ApiResponse<UserConfig>> =>
  getAPI(API.CONFIG.GET.URL, {}, false, false, false, false, {})

export interface ResumeDIDRequest {
  pathParams: {
    participantId: string
  }
}

export const resumeDidAPI = (
  request: ResumeDIDRequest
): Promise<ApiResponse<OnBoardParticipantResponse>> =>
  getAPI(
    parseAPI(API.PARTICIPANT.RESUME_DID.URL, request.pathParams),
    {},
    false,
    false,
    false,
    false,
    {}
  )

export interface ResumeParticipantRequest {
  pathParams: {
    participantId: string
  }
}

export const resumeParticipantAPI = (
  request: ResumeParticipantRequest
): Promise<ApiResponse<OnBoardParticipantResponse>> =>
  getAPI(
    parseAPI(API.PARTICIPANT.RESUME_PARTICIPANT.URL, request.pathParams),
    {},
    false,
    false,
    false,
    false,
    {}
  )

export interface ExportParticipantDetailsRequest {
  pathParams: {
    participantId: string
  }
}

export const exportParticipantDetailsAPI = (
  request: ExportParticipantDetailsRequest
): Promise<ApiResponse<ParticipantCredentials>> =>
  getAPI(
    parseAPI(API.PARTICIPANT.EXPORT_DETAILS.URL, request.pathParams),
    {},
    false,
    false,
    false,
    false,
    {}
  )
