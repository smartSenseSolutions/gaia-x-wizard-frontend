import { GetMasterRequest, getMaster } from '@wizard/api/auth.api'
import { getDependsVCOptions } from '@wizard/api/serviceCreation.api'
import { AsyncReqParam } from '@wizard/utils/helpers'
import {
  MasterType,
  Operators,
  STANDARD_LIMIT_FOR_PAGINATION,
  ZERO,
} from '@wizard/utils/constants'

export type Item = {
  label: string
  value: string
}
type Options = {
  options: Item[]
  hasMore?: boolean
}

export const onLoadStandardOption = async (
  searchString: string,
  filterParams: AsyncReqParam
): Promise<Options> => {
  try {
    if (searchString) {
      filterParams['criteria'] = [
        {
          column: 'type',
          operator: Operators.Contain,
          values: [searchString],
        },
      ]
      filterParams['page'] = ZERO
      const request: GetMasterRequest = {
        pathParams: {
          dataType: MasterType.Standard,
        },
        queryParams: filterParams,
      }
      const response = await getMaster(request)
      const prepareData = {
        options: response.payload.content.map((item) => {
          return {
            label: item.type,
            value: item.type,
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
          dataType: MasterType.Standard,
        },
        queryParams: filterParams,
      }
      const response = await getMaster(request)
      const prepareData = {
        options: response.payload.content.map((item) => {
          return {
            label: item.type,
            value: item.type,
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

export const onLoadFormatType = async (
  searchString: string,
  filterParams: AsyncReqParam
): Promise<Options> => {
  try {
    if (searchString) {
      filterParams['criteria'] = [
        {
          column: 'type',
          operator: Operators.Contain,
          values: [searchString],
        },
      ]
      filterParams['page'] = ZERO
      const request: GetMasterRequest = {
        pathParams: {
          dataType: MasterType.FormateType,
        },
        queryParams: filterParams,
      }
      const response = await getMaster(request)
      const prepareData = {
        options: response.payload.content.map((item) => {
          return { label: item.type, value: item.id }
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
          dataType: MasterType.FormateType,
        },
        queryParams: filterParams,
      }
      const response = await getMaster(request)
      const prepareData = {
        options: response.payload.content.map((item) => {
          return { label: item.type, value: item.id }
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

export const onLoadDependsVcOption = async (
  searchString: string,
  filterParams: AsyncReqParam
): Promise<Options> => {
  try {
    if (searchString) {
      filterParams['criteria'] = [
        {
          column: 'credential.vcUrl',
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
      const response = await getDependsVCOptions({ queryParams: filterParams })
      const prepareData = {
        options: response.payload.content.map((item) => {
          return { label: item.name, value: item?.credential?.vcUrl }
        }),
      }
      return prepareData
    } else {
      if (Object.hasOwn(filterParams, 'criteria')) {
        delete filterParams.criteria
      }
      filterParams['page'] = filterParams['page'] + 1
      filterParams['size'] = STANDARD_LIMIT_FOR_PAGINATION
      const response = await getDependsVCOptions({ queryParams: filterParams })
      const prepareData = {
        options: response.payload.content.map((item) => {
          return { label: item.name, value: item?.credential?.vcUrl }
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
