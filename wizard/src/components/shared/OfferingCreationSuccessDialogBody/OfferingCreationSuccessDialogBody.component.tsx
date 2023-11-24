import { CopyIcon } from '@gaia-x-frontend/components-lib'
import { handleCopy } from '@wizard/utils/helpers'
import { OfferCreationSuccessProps } from '@wizard/models/service-creation.model'
import ServiceCreationStyled from './OfferingCreationSuccessDialogBody.module.scss'

const OfferingCreationSuccessDialogBody = ({
  url,
  title,
  msg,
}: OfferCreationSuccessProps) => {
  return (
    <>
      <div className="mb-[3rem] ">
        <div className="pt-[5rem] flex justify-between">
          <h3
            className={ServiceCreationStyled.dialogSubtitle + ' text-[2.2rem]'}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={() => handleCopy(url)}
            className=" cursor-pointer"
          >
            <CopyIcon />
          </button>
        </div>
        <p className=" text-[1.8rem] pt-[1.6rem]  w-[100%] border-b-[1px]">
          {url ?? null}
        </p>
      </div>
      <p className=" mb-[3rem]  text-[2.2rem]">{msg}</p>
    </>
  )
}
export { OfferingCreationSuccessDialogBody }
