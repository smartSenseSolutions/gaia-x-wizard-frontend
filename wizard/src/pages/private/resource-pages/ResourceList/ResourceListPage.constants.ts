export enum AllResourceTypeFilter {
  PHYSICAL = 'gx:PhysicalResource',
  VIRTUAL_SOFTWARE = 'gx:VirtualSoftwareResource',
  VIRTUAL_DATA = 'gx:VirtualDataResource',
}

export const ALL_RESOURCE_TYPE_FILTER_MAP = {
  [AllResourceTypeFilter.PHYSICAL]: {
    text: 'Physical',
    value: AllResourceTypeFilter.PHYSICAL,
  },
  [AllResourceTypeFilter.VIRTUAL_SOFTWARE]: {
    text: 'Virtual (Software)',
    value: AllResourceTypeFilter.VIRTUAL_SOFTWARE,
  },
  [AllResourceTypeFilter.VIRTUAL_DATA]: {
    text: 'Virtual (Data)',
    value: AllResourceTypeFilter.VIRTUAL_DATA,
  },
}

export const ALL_RESOURCES_TYPE_FILTER_LIST = Object.values(
  ALL_RESOURCE_TYPE_FILTER_MAP
)
