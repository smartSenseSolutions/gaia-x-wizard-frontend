import { AsyncReqParam, Item } from '@wizard/utils/helpers'
import { ListApiParamType, Pagination } from './base.model'
import { ResourceSubType, ResourceType } from '@wizard/utils/constants'

export interface ResourceCreationParamType {
  verificationMethod?: string
  participantJsonUrl?: string
  privateKey?: string
  credentialSubject: {
    type: ResourceType
    subType?: ResourceSubType
    'gx:name': string
    'gx:description': string
    'gx:aggregationOf'?: { id: string }[]
    'gx:maintainedBy'?: { id: string }[]
    'gx:copyrightOwnedBy'?: { id: string }[]
    'gx:ownedBy'?: { id: string }[]
    'gx:manufacturedBy'?: { id: string }[]
    'gx:license'?: string[]
    'gx:policy'?: { 'gx:customAttribute': string } | null
    'gx:locationAddress'?: { 'gx:countryCode': string }[]
    'gx:location'?: { 'gx:gps': string }[]
    'gx:producedBy'?: { id: string }
    'gx:exposedThrough'?: string[]
    'gx:containsPII'?: boolean
    'gx:legalBasis'?: string
    'gx:obsoleteDateTime'?: string
    'gx:expirationDateTime'?: string
    'gx:email'?: string
    'gx:url'?: string
    publishToKafka?: boolean
  }
}

export interface ResourceFormValue {
  DateOfExpiry: string
  DateOfDeletion: string
  policy: string[]
  locationCoordinates: string[]
  resourceName: string
  description: string
  aggregation: Item[]
  locationAddress: Item[]
  maintainedBy: string[]
  ownedBy: string[]
  manufacturedBy: string[]
  copyrightOwner: string[]
  license: Item[]
  producedBy: string
  exposedThrough: string
  legalBasis: string
  contactEmail: string
  contactUrl: string
  resourceType: ResourceType
  resourceSubType: ResourceSubType
  containsPII: boolean
}

export type ResourceCreationResponseType = {
  id: string
  createdAt: string
  credentialId: string
  credential: CredentialType
  name: string
  description: string
  type: string
  participantId: string
  participant: ParticipantType
  publishToKafka: boolean
  obsoleteDate: string
  expiryDate: string
  typeLabel: string
  vcUrl: string
}

export type CredentialType = {
  id: string
  vcUrl: string
  vcJson: string
  credentialType: string
  participantId: string
  metadata: string
  participant: ParticipantType
}

export type ParticipantType = {
  id: string
  email: string
  did: string
  legalName: string
  shortName: string
  entityTypeId: string
  entityType: EntityType
  domain: string
  privateKeyId: string
  participantType: string
  status: number
  credentialRequest: string
  ownDidSolution: boolean
  keyStored: boolean
}

export type EntityType = {
  id: string
  type: string
  active: boolean
}

export type ResourceListType = {
  id: string
  name: string
  typeLabel: string
  type: string
  selfDescription: string
  createdAt: number
  credential: {
    id: string
    vcUrl: string
  }
}

export interface ResourceListResponse {
  content: ResourceListType[]
  pageable: Pagination
}

export interface SpdxLicenseResponsePayload {
  content: SpdxLicenseListResponse[]
  pageable: Pagination
}

export interface SpdxLicenseListResponse {
  active: boolean
  id: string
  licenseId: string
  name: string
  reference: string
}
export interface ResourceFilterRequest {
  queryParams: AsyncReqParam
}
export interface CreateResourceCreationRequest {
  pathParams: {
    participantId: string
  }
  queryParams: ResourceCreationParamType
}
export interface ResourceListRequest {
  pathParams: {
    participantId: string
  }
  queryParams: ListApiParamType
}
export interface SpdxLicenseFilterRequest {
  queryParams: AsyncReqParam
}
export interface ValidateResourceCreationRequest {
  queryParams: ResourceCreationParamType
}
