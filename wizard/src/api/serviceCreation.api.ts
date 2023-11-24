import { API } from '@wizard/utils/constants'
import { ApiResponse } from '@wizard/models/api.model'
import { parseAPI } from '@wizard/utils/helpers'
import { getAPI, postAPI } from '@wizard/utils/api-manager'
import {
  AggregationOfVcPayload,
  CreateServiceOfferParamType,
  CreatedServiceResponseType,
  DependsVCOptionsRequest,
  PostCreateServiceOfferRequest,
  PostValidateServiceOfferRequest,
  ServiceOfferingDetailsRequest,
  ServiceOfferingListRequest,
} from '@wizard/models/service-creation.model'
import {
  ServiceOfferingDetailsResponse,
  ServicesOfferingResponse,
} from '@wizard/models/service-management.model'

export const getDependsVCOptions = (
  request: DependsVCOptionsRequest
): Promise<ApiResponse<AggregationOfVcPayload>> =>
  postAPI(
    API.PUBLIC.SERVICE_OFFER.LIST.URL,
    request.queryParams,
    {},
    false,
    false,
    false,
    false
  )

export const postValidateServiceOffer = (
  request: PostValidateServiceOfferRequest
): Promise<ApiResponse<unknown>> =>
  postAPI(
    API.PUBLIC.SERVICE_OFFER.VALIDATE.URL,
    request.queryParams,
    {},
    false,
    false,
    false,
    false
  )

export const postCreateServiceOffer = (
  request: PostCreateServiceOfferRequest
): Promise<ApiResponse<CreatedServiceResponseType>> =>
  postAPI(
    API.SERVICE_OFFER.CREATE.URL,
    request.queryParams,
    {},
    false,
    false,
    false,
    false
  )
export const postCreatePublicServiceOffer = (
  param: CreateServiceOfferParamType
): Promise<ApiResponse<CreatedServiceResponseType>> =>
  postAPI(
    API.PUBLIC.SERVICE_OFFER.CREATE.URL,
    param,
    {},
    false,
    false,
    false,
    false
  )

export const postServiceOfferingList = (
  request: ServiceOfferingListRequest
): Promise<ApiResponse<ServicesOfferingResponse>> =>
  postAPI(
    parseAPI(API.SERVICE_OFFER.LIST.URL, request.pathParams),
    request.queryParams,
    {},
    false,
    false,
    false,
    false
  )

export const getServiceOfferingDetails = (
  request: ServiceOfferingDetailsRequest
): Promise<ApiResponse<ServiceOfferingDetailsResponse>> =>
  getAPI(
    parseAPI(API.SERVICE_OFFER.GET_DETAILS.URL, request.pathParams),
    {},
    false,
    false,
    false,
    false
  )
