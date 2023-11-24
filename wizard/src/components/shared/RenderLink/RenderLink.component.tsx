import { ONE, ZERO } from '@wizard/utils/constants'

const RenderLink = ({
  linkArray,
}: {
  linkArray: { name: string; credentialSubjectId: string }[]
}) => {
  return (
    <div className=" ">
      {linkArray.length === ZERO ? 'N/A' : null}
      {linkArray.map((IndividualLink, index) => {
        return (
          <span key={IndividualLink.credentialSubjectId} className={''}>
            <a
              className={
                'text-[#000094] text-[1.8rem] font-[400] hover:underline'
              }
              href={IndividualLink.credentialSubjectId}
              target="_blank"
              referrerPolicy="no-referrer"
            >
              {IndividualLink.name}
            </a>

            {index < linkArray.length - ONE && ', '}
          </span>
        )
      })}
    </div>
  )
}
export { RenderLink }
