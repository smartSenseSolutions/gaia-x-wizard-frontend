import { ProgressBar } from '@gaia-x-frontend/components-lib'
import { LoaderProps } from '@wizard/models/comman.model'

const AppLoader = ({ type = 'circular' }: LoaderProps) => {
  return (
    <div>
      {type === 'circular' ? (
        <div className={'flex w-[100%] h-[100vh] justify-center items-center'}>
          <ProgressBar type={type} />
        </div>
      ) : (
        <div className={'absolute z-[9] w-[100%]'}>
          <ProgressBar type={type} />
        </div>
      )}
    </div>
  )
}

export { AppLoader }
