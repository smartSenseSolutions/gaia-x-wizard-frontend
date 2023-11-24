import { ProgressBar } from '@gaia-x-frontend/components-lib'
import { LoaderProps } from '@wizard/models/comman.model'

const ApiLoader = ({ type = 'linear' }: LoaderProps) => {
  return (
    <div className={' apiLoader hidden'}>
      <div className={'absolute z-[9] w-[100%]'}>
        <ProgressBar type={type} />
      </div>
    </div>
  )
}

export { ApiLoader }
