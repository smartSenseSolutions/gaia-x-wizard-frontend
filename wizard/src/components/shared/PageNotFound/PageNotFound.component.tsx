import { useNavigate } from 'react-router-dom'
import { Button, theme } from '@gaia-x-frontend/components-lib'

const PageNotFound = () => {
  const navigation = useNavigate()

  const handleNavigation = () => {
    navigation('/')
  }

  return (
    <div className={'bg-[#FAFAFF] h-[100vh]'}>
      <div>
        <img
          style={{ opacity: 0 }}
          src="/gaia-x_blue_logo.png"
          alt="Gaia-X Blue Logo"
        />
      </div>

      <div className="text-center mt-[9rem]">
        <h1
          className={`text-[7rem] text-[${theme.palette.primary.main}] m-0 p-0 font-[600]`}
        >
          404 Error
        </h1>
        <img src="/404-line.png" alt="404 Line" />
      </div>

      <div className="flex mt-[3rem]">
        <div className="w-[35%]">
          <img src="/404-left-line.png" alt="404 Left Line" />
        </div>

        <div className="w-[30%]">
          <p
            className={`text-[3rem] text-[${theme.palette.primary.main}] leading-[1.2] relative top-[-0.9rem]`}
          >
            Oops, Looks like you don’t have access or the page you are looking
            for is not available
          </p>

          <div className="text-center mt-[8rem]">
            <Button
              variant="contained"
              onClick={handleNavigation}
              type="submit"
              color="primary"
            >
              Back to Home
            </Button>
          </div>
        </div>

        <div className="w-[35%]">
          <img src="/404-right-line.png" alt="404 Right Line" />
        </div>
      </div>
    </div>
  )
}

export { PageNotFound }
