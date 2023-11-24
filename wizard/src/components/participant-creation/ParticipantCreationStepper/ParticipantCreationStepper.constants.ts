export enum ParticipantCreationSteps {
  Started,
  SubdomainCreated,
  CertificateCreated,
  IngressCreated,
  DidCreated,
  JsonCreated,
}

export const CERT_PROGRESS = {
  STARTED: 1,
  DOMAIN_CREATED: 2,
  DOMAIN_CREATION_FAILED: 3, //SUBDOMAIN
  CERTIFICATE_CREATED: 4,
  CERTIFICATE_CREATION_FAILED: 5,
  INGRESS_CREATED: 6,
  INGRESS_CREATION_FAILED: 7,
  DID_JSON_CREATED: 8,
  DID_JSON_CREATION_FAILED: 9,
  PARTICIPANT_JSON_CREATED: 10,
  PARTICIPANT_JSON_CREATION_FAILED: 11,
  CERTIFICATE_CREATION_IN_PROCESS: 12,
}

export const STEPS = [
  {
    label: 'Creating your domain',
  },
  {
    label: 'Creating your certificate',
  },
  {
    label: 'Setting up your domain name',
  },
  {
    label: 'Creating your unique identity',
  },
  {
    label: 'On-boarding you on Gaia-X',
  },
]
export const MAX_RETRY = 5
export const RECALL_API = 15000
