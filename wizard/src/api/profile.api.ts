import { ApiResponse } from '@wizard/models/api.model'
import {
  ParticipantProfileResponse,
  PathReqParam,
  UploadProfileImageRequest,
} from '@wizard/models/profile.model'
import { deleteAPI, getAPI, putAPI } from '@wizard/utils/api-manager'
import { API } from '@wizard/utils/constants'
import { parseAPI } from '@wizard/utils/helpers'

export const participantProfile = (
  request: PathReqParam
): Promise<ApiResponse<ParticipantProfileResponse>> =>
  getAPI(
    parseAPI(API.PROFILE.GET_DETAILS.URL, request.pathParams),
    {},
    false,
    false,
    false,
    true,
    {}
  )

export const uploadProfileImage = (
  request: UploadProfileImageRequest
): Promise<ApiResponse<{ imageUrl: string }>> =>
  putAPI(
    parseAPI(API.PROFILE.UPLOAD_IMAGE.URL, request.pathParams),
    request.queryParams,
    { 'Content-Type': 'multipart/form-data' },
    true,
    true
  )

export const deleteProfileImage = (
  request: PathReqParam
): Promise<ApiResponse<{ imageUrl: string }>> =>
  deleteAPI(
    parseAPI(API.PROFILE.DELETE_IMAGE.URL, request.pathParams),
    {},
    {},
    true,
    true
  )

export const participantProfileJSON = (
  url: string
): Promise<ApiResponse<ParticipantProfileResponse>> =>
  getAPI(url, {}, true, false, false, true, {})
