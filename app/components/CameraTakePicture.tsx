"use client"

type CameraTakePictureProps = {
  onClick: () => void
}

export default function CameraTakePicture({
  onClick,
}: CameraTakePictureProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Take picture"
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="169"
        height="62"
        viewBox="0 0 169 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="138.001" cy="31" r="27.5556" fill="#FCFCFC" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M134.073 20.4013C133.598 20.5719 132.2 21.7484 131.674 22.4205C131.521 22.6159 131.265 22.6593 130.269 22.6593C127.405 22.6593 125.832 23.4755 124.912 25.4401L124.521 26.2747V32.2093C124.521 37.4902 124.547 38.2079 124.758 38.7253C125.336 40.1466 126.417 41.1454 127.823 41.5577C128.848 41.8579 147.151 41.8579 148.176 41.5577C149.172 41.2658 150.066 40.6275 150.621 39.8118C151.483 38.5465 151.478 38.5872 151.478 32.1411V26.2747L151.076 25.4164C150.59 24.3777 149.504 23.3395 148.545 22.9986C148.123 22.8482 147.285 22.738 146.225 22.6934L144.566 22.6237L143.555 21.6524C142.999 21.1182 142.377 20.589 142.172 20.4764C141.634 20.1794 134.865 20.1165 134.073 20.4013Z"
          fill="#A0A4AB"
        />
        <circle
          cx="138"
          cy="31"
          r="30"
          stroke="#FCFCFC"
          strokeWidth="2"
        />
        <path
          opacity="0.7"
          d="M4.942 37V28.796H7.896V27.2H0.126V28.796H3.094V37H4.942Z"
          fill="#FCFCFC"
        />
        <path
          opacity="0.7"
          d="M15.8126 37L12.0326 27.2H10.2966L6.53056 37H8.43456L9.27456 34.718H13.0546L13.8946 37H15.8126Z"
          fill="#FCFCFC"
        />
        <path
          opacity="0.7"
          d="M24.9398 37L20.9778 31.092L24.5758 27.2H22.2658L18.3318 31.47V27.2H16.4698V37H18.3318V33.948L19.7038 32.464L22.6438 37H24.9398Z"
          fill="#FCFCFC"
        />
        <path
          opacity="0.7"
          d="M32.3698 37V35.39H27.5398V32.772H31.2917V31.176H27.5398V28.796H32.2158V27.2H25.6917V37H32.3698Z"
          fill="#FCFCFC"
        />
        <path
          opacity="0.7"
          d="M38.1773 37V33.276H40.2493C42.2933 33.276 43.5113 32.016 43.5113 30.238C43.5113 28.46 42.2933 27.2 40.2493 27.2H36.3153V37H38.1773Z"
          fill="#FCFCFC"
        />
      </svg>
    </button>
  )
}
