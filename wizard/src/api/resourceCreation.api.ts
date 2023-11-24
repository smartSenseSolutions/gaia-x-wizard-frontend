import { AggregationOfVcPayload } from '@wizard/models/service-creation.model'
import { API } from '@wizard/utils/constants'
import { ApiResponse } from '@wizard/models/api.model'
import { parseAPI } from '@wizard/utils/helpers'
import { postAPI } from '@wizard/utils/api-manager'
import {
  CreateResourceCreationRequest,
  ResourceCreationParamType,
  ResourceCreationResponseType,
  ResourceFilterRequest,
  ResourceListRequest,
  ResourceListResponse,
  SpdxLicenseFilterRequest,
  SpdxLicenseResponsePayload,
  ValidateResourceCreationRequest,
} from '@wizard/models/resource-creation.model'

export const getResourceFilter = (
  request: ResourceFilterRequest
): Promise<ApiResponse<AggregationOfVcPayload>> => {
  return postAPI(
    API.PUBLIC.RESOURCE.LIST.URL,
    request.queryParams,
    {},
    false,
    false,
    false,
    false
  )
}

export const postCreateResourceCreation = (
  request: CreateResourceCreationRequest
): Promise<ApiResponse<ResourceCreationResponseType>> => {
  return postAPI(
    parseAPI(API.RESOURCE.CREATE.URL, request.pathParams),
    request.queryParams,
    {},
    false
  )
}
export interface CreatePublicResourceCreationRequest {
  queryParams: ResourceCreationParamType
}
export const postCreatePublicResourceCreation = (
  request: CreatePublicResourceCreationRequest
): Promise<ApiResponse<ResourceCreationResponseType>> =>
  postAPI(API.PUBLIC.RESOURCE.CREATE.URL, request.queryParams, {}, false)

export const postResourceList = (
  request: ResourceListRequest
): Promise<ApiResponse<ResourceListResponse>> =>
  postAPI(
    parseAPI(API.RESOURCE.LIST.URL, request.pathParams),
    request.queryParams
  )

export const getSpdxLicenseFilter = (
  request: SpdxLicenseFilterRequest
): Promise<ApiResponse<SpdxLicenseResponsePayload>> =>
  postAPI(
    API.PUBLIC.SPDX_LICENSE_LIST.URL,
    request.queryParams,
    {},
    false,
    false
  )

export const postValidateResourceCreation = (
  request: ValidateResourceCreationRequest
): Promise<ApiResponse<unknown>> =>
  postAPI(
    API.PUBLIC.RESOURCE.VALIDATE.URL,
    request.queryParams,
    {},
    false,
    false,
    true,
    false
  )
