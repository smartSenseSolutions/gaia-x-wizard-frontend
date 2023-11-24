function Location() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="23"
      fill="none"
      viewBox="0 0 24 23"
    >
      <path fill="#F5F5F5" d="M0 0H24V23H0z"></path>
      <g clipPath="url(#clip0_1_3)">
        <path
          fill="#ECECEC"
          d="M0 0H1920V1040H0z"
          transform="translate(-981 -299)"
        ></path>
        <path fill="#FAFAFA" d="M-981 -299H939V741H-981z"></path>
        <g filter="url(#filter0_d_1_3)">
          <rect
            width="910"
            height="110"
            x="-580"
            y="-24"
            fill="#fff"
            rx="10"
          ></rect>
          <rect
            width="909"
            height="109"
            x="-579.5"
            y="-23.5"
            stroke="#465AFF"
            rx="9.5"
          ></rect>
        </g>
        <path
          fill="url(#paint0_linear_1_3)"
          d="M11.886 15.631c1.68-1.316 2.95-2.584 3.81-3.802.86-1.219 1.29-2.351 1.29-3.398 0-.923-.175-1.706-.524-2.349-.35-.643-.78-1.167-1.29-1.57a5.065 5.065 0 00-1.655-.882c-.594-.184-1.137-.276-1.629-.276-.496 0-1.041.092-1.634.275a5.038 5.038 0 00-1.655.881c-.51.405-.94.929-1.29 1.573-.348.643-.523 1.427-.523 2.35 0 1.045.43 2.177 1.29 3.396.86 1.218 2.13 2.486 3.81 3.802zm0 2.073c-2.297-1.672-4.003-3.268-5.116-4.79C5.656 11.392 5.1 9.9 5.1 8.438c0-1.104.205-2.074.615-2.91a6.617 6.617 0 011.593-2.106 6.71 6.71 0 012.184-1.278 7.133 7.133 0 012.393-.428c.79 0 1.587.143 2.393.428a6.708 6.708 0 012.185 1.278 6.615 6.615 0 011.593 2.106c.41.837.616 1.81.616 2.915 0 1.465-.557 2.957-1.67 4.476-1.114 1.518-2.82 3.113-5.116 4.785zm.002-7.641c.507 0 .939-.174 1.296-.52.357-.348.536-.766.536-1.257 0-.492-.18-.911-.538-1.258a1.8 1.8 0 00-1.299-.52c-.506 0-.938.174-1.296.522a1.696 1.696 0 00-.535 1.26c0 .493.179.911.538 1.256.358.344.791.517 1.298.517zM5.099 21.278v-1.632h13.573v1.632H5.1z"
        ></path>
      </g>
      <defs>
        <filter
          id="filter0_d_1_3"
          width="940"
          height="140"
          x="-595"
          y="-37"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="2"></feOffset>
          <feGaussianBlur stdDeviation="7.5"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1_3"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_1_3"
            result="shape"
          ></feBlend>
        </filter>
        <linearGradient
          id="paint0_linear_1_3"
          x1="19.502"
          x2="2.366"
          y1="19.974"
          y2="18.853"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#46DAFF"></stop>
          <stop offset="0.5" stopColor="#000094"></stop>
          <stop offset="1" stopColor="#B900FF"></stop>
        </linearGradient>
        <clipPath id="clip0_1_3">
          <path
            fill="#fff"
            d="M0 0H1920V1040H0z"
            transform="translate(-981 -299)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  )
}

export { Location }
