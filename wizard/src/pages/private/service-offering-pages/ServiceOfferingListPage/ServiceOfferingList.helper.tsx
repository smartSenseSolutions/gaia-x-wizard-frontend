import { Link } from 'react-router-dom'
import { CopyIcon } from '@gaia-x-frontend/components-lib'
import { RenderStar } from '@wizard/components'
import { handleCopy } from '@wizard/utils/helpers'
import { GridColumnNode } from '@wizard/models/service-management.model'

export const renderServiceName = ({
  renderedCellValue,
  row,
}: GridColumnNode) => (
  <Link
    to={row?.original?.id}
    className="hover:underline capitalize font-[600]"
    style={{ color: 'inherit' }}
  >
    {renderedCellValue}
  </Link>
)

export const renderLabelLevel = ({
  renderedCellValue,
  row,
}: GridColumnNode) => (
  <div className="flex items-center gap-[1.2rem]">
    <RenderStar level={row?.original?.labelLevel} />
    {renderedCellValue}
  </div>
)

export const renderSelfDescription = ({
  renderedCellValue,
  row,
}: GridColumnNode) => (
  <div className="flex justify-between max-w-[42rem]">
    <span className=" whitespace-nowrap overflow-hidden overflow-ellipsis underline max-w-[38rem] cursor-pointer">
      <Link
        to={row?.original?.credential?.vcUrl}
        rel="noopener"
        target="_blank"
        style={{ color: 'inherit' }}
      >
        {renderedCellValue}
      </Link>
    </span>
    <button
      className="pl-[1rem] cursor-pointer"
      type="button"
      onClick={() => handleCopy(row?.original?.credential?.vcUrl)}
    >
      <CopyIcon />
    </button>
  </div>
)
