import { IconType } from '../type/icon.type'

const ServiceIcon = ({
  width = 24,
  height = 24,
  fill = '#565655',
  ...props
}: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <path
      fill={fill}
      d="M11 17h2l.3-1.5c.2-.083.387-.17.563-.262.175-.092.354-.205.537-.338l1.45.45 1-1.7-1.15-1c.033-.233.05-.45.05-.65s-.017-.417-.05-.65l1.15-1-1-1.7-1.45.45a4.35 4.35 0 0 0-.537-.338A7.084 7.084 0 0 0 13.3 8.5L13 7h-2l-.3 1.5c-.2.083-.387.17-.563.262A4.353 4.353 0 0 0 9.6 9.1l-1.45-.45-1 1.7 1.15 1c-.033.233-.05.45-.05.65s.017.417.05.65l-1.15 1 1 1.7 1.45-.45c.183.133.363.246.537.338.175.091.363.179.563.262L11 17Zm1-3c-.55 0-1.02-.196-1.412-.588A1.926 1.926 0 0 1 10 12c0-.55.196-1.02.588-1.412A1.926 1.926 0 0 1 12 10c.55 0 1.02.196 1.412.588.392.391.588.862.588 1.412 0 .55-.196 1.02-.588 1.412A1.926 1.926 0 0 1 12 14Zm-7 7c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 3 19V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 5 3h14c.55 0 1.02.196 1.413.587C20.803 3.98 21 4.45 21 5v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 19 21H5Zm0-2h14V5H5v14Z"
    />
  </svg>
)
export { ServiceIcon }