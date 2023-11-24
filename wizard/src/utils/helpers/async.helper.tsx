import { getMaster, GetMasterRequest } from '@wizard/api/auth.api'
import { getResourceFilter } from '@wizard/api/resourceCreation.api'
import { SortingType } from '@wizard/models/base.model'
import { SubDivision } from '@wizard/models/master-data.model'
import {
  MasterType,
  Operators,
  STANDARD_LIMIT_FOR_PAGINATION,
  ZERO,
} from '../constants'

export type Item = {
  label: string
  value: string
}

type Options = {
  options: Item[]
  hasMore?: boolean
}

export type SortOrderType = 'asc' | 'desc' | ''

export type AsyncReqParam = {
  page: number
  size: number
  criteriaOperator?: string
  criteria?: { column: string; operator: string; values?: number | string[] }[]
  sort?: SortingType
}

export const onLoadSubDivisions = async (
  searchString: string,
  filterParams: AsyncReqParam
): Promise<Options> => {
  try {
    if (searchString) {
      filterParams['criteria'] = [
        {
          column: 'subdivisionCode',
          operator: Operators.Contain,
          values: [searchString],
        },
        {
          column: 'name',
          operator: Operators.Contain,
          values: [searchString],
        },
      ]
      filterParams['page'] = ZERO
      const request: GetMasterRequest = {
        pathParams: {
          dataType: MasterType.SubDivision,
        },
        queryParams: filterParams,
      }
      const response = await getMaster(request)
      const prepareData = {
        options: (response.payload.content as SubDivision[]).map((item) => {
          return {
            label: `${item.name} (${item.subdivisionCode})`,
            value: item.subdivisionCode,
          }
        }),
      }
      return prepareData
    } else {
      if (Object.hasOwn(filterParams, 'criteria')) {
        delete filterParams.criteria
      }
      filterParams['page'] = filterParams['page'] + 1
      filterParams['size'] = STANDARD_LIMIT_FOR_PAGINATION
      const request: GetMasterRequest = {
        pathParams: {
          dataType: MasterType.SubDivision,
        },
        queryParams: filterParams,
      }
      const response = await getMaster(request)
      const prepareData = {
        options: (response.payload.content as SubDivision[]).map((item) => {
          return {
            label: `${item.name} (${item.subdivisionCode})`,
            value: item.subdivisionCode,
          }
        }),
        hasMore:
          response.payload.content.length >= STANDARD_LIMIT_FOR_PAGINATION,
      }

      return prepareData
    }
  } catch (e) {
    return { options: [], hasMore: false }
  }
}

export const onLoadVcOption = async (
  searchString: string,
  filterParams: AsyncReqParam
): Promise<Options> => {
  try {
    if (searchString) {
      filterParams['criteria'] = [
        {
          column: 'name',
          operator: Operators.Contain,
          values: [searchString],
        },
      ]
      filterParams['page'] = ZERO
      const response = await getResourceFilter({ queryParams: filterParams })
      const prepareData = {
        options: response.payload.content.map((item) => {
          return { label: item.name, value: item.selfDescription }
        }),
      }
      return prepareData
    } else {
      if (Object.hasOwn(filterParams, 'criteria')) {
        delete filterParams.criteria
      }
      filterParams['page'] = filterParams['page'] + 1
      filterParams['size'] = STANDARD_LIMIT_FOR_PAGINATION
      const response = await getResourceFilter({ queryParams: filterParams })
      const prepareData = {
        options: response.payload.content.map((item) => {
          return { label: item.name, value: item.selfDescription }
        }),
        hasMore:
          response.payload.content.length >= STANDARD_LIMIT_FOR_PAGINATION,
      }

      return prepareData
    }
  } catch (e) {
    return { options: [], hasMore: false }
  }
}
