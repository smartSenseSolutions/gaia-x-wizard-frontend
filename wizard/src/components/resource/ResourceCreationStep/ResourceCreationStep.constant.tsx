import { ResourceSubType, ResourceType } from '@wizard/utils/constants'

export const LEGAL_BASIS_LIST = [
  { label: 'GDPR2018 Article 6.1.[a-f]', value: '6.1.[a-f]' },
  { label: 'GDPR2018 Article 6.1.4', value: '6.1.4' },
  { label: 'GDPR2018 Article 7', value: '7' },
  { label: 'GDPR2018 Article 9.2.[a-j]', value: '9.2.[a-j]' },
]
export const RESOURCE_SUB_TYPE_MAP = {
  [ResourceSubType.Software]: {
    label: 'Software',
    value: ResourceSubType.Software,
  },
  [ResourceSubType.Data]: {
    label: 'Data',
    value: ResourceSubType.Data,
  },
}

export const RESOURCE_SUB_TYPE_LIST = Object.values(RESOURCE_SUB_TYPE_MAP)

export const RESOURCE_TYPE_MAP = {
  [ResourceType.Physical]: {
    label: 'Physical',
    value: ResourceType.Physical,
  },
  [ResourceType.Virtual]: {
    label: 'Virtual',
    value: ResourceType.Virtual,
  },
}

export const RESOURCE_TYPE_LIST = Object.values(RESOURCE_TYPE_MAP)
