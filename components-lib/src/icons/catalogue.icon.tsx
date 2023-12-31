import { IconType } from '../type/icon.type'

const CatalogueIcon = ({
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
      d="M3 19c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 1 17V7c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 3 5h10c.55 0 1.02.196 1.412.588.392.391.588.862.588 1.412v10c0 .55-.196 1.02-.588 1.413A1.926 1.926 0 0 1 13 19H3Zm0-3.65a9.783 9.783 0 0 1 2.35-1A9.788 9.788 0 0 1 8 14c.933 0 1.817.117 2.65.35a9.783 9.783 0 0 1 2.35 1V7H3v8.35ZM8 16c-.683 0-1.35.083-2 .25a7.436 7.436 0 0 0-1.85.75h7.7a7.436 7.436 0 0 0-1.85-.75A8.019 8.019 0 0 0 8 16Zm0-2.75c-.75 0-1.396-.27-1.938-.813-.541-.541-.812-1.187-.812-1.937s.27-1.396.813-1.938C6.604 8.021 7.25 7.75 8 7.75s1.396.27 1.938.813c.541.541.812 1.187.812 1.937s-.27 1.396-.813 1.938c-.541.541-1.187.812-1.937.812Zm0-1.85c.25 0 .463-.088.637-.263A.868.868 0 0 0 8.9 10.5a.868.868 0 0 0-.263-.637A.868.868 0 0 0 8 9.6a.868.868 0 0 0-.638.263.868.868 0 0 0-.262.637c0 .25.088.463.263.637A.868.868 0 0 0 8 11.4Zm9 7.6V5h2v14h-2Zm4 0V5h2v14h-2Z"
    />
  </svg>
)
export { CatalogueIcon }
