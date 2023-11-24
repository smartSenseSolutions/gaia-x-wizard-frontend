import { AsyncReqParam } from '@wizard/utils/helpers'
import {
  Operators,
  STANDARD_LIMIT_FOR_PAGINATION,
  ZERO,
} from '@wizard/utils/constants'
import { getSpdxLicenseFilter } from '@wizard/api/resourceCreation.api'

export const onLoadLicenseOption = async (
  searchString: string,
  filterParams: AsyncReqParam
): Promise<unknown> => {
  try {
    if (searchString) {
      filterParams['criteria'] = [
        {
          column: 'name',
          operator: Operators.Contain,
          values: [searchString],
        },
        {
          column: 'active',
          operator: Operators.True,
        },
      ]
      filterParams['page'] = ZERO
      const response = await getSpdxLicenseFilter({ queryParams: filterParams })
      const prepareData = {
        options: response.payload.content.map((item) => {
          return {
            label: item.name,
            value: item.reference,
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
      const response = await getSpdxLicenseFilter({ queryParams: filterParams })
      const prepareData = {
        options: response.payload.content.map((item) => {
          return {
            label: item.name,
            value: item.reference,
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
