import {
  StarBorderOutlinedIcon,
  StarIcon,
} from '@gaia-x-frontend/components-lib'
import { ONE, STAR_MAX_LEVEL } from '@wizard/utils/constants'

type RenderStarProps = { level: string }
const RenderStar = ({ level }: RenderStarProps) => {
  const serviceLevel = parseInt(level?.charAt(ONE))
  return Array.from({ length: STAR_MAX_LEVEL }, (_, index) => (
    <div key={index}>
      {serviceLevel >= index + ONE ? (
        <StarIcon />
      ) : (
        <StarBorderOutlinedIcon sx={{ fontSize: '2.2rem', color: '#f5d14f' }} />
      )}
    </div>
  ))
}
export { RenderStar }
