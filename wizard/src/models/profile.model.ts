export interface ParticipantProfileResponse {
  id: string
  legalName: string
  shortName: string
  email: string
  credential: {
    id: string
    vcUrl: string
  }
  headquarterAddress: string
  legalAddress: string
  legalRegistrationNumber: {
    'gx:EORI': string
    'gx:leiCode': string
    'gx:vatID': string
  }
  profileImage: string
  parentOrganization: string[]
  subOrganization: string[]
  entityType: {
    id: string
    type: string
  }
}
export interface PathReqParam {
  pathParams: {
    participantId: string
  }
}
export interface UploadProfileImageRequest {
  pathParams: {
    participantId: string
  }
  queryParams: FormData
}
