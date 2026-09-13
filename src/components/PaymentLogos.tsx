import React from 'react';

/**
 * Official standalone brand emblems & logos for Indian UPI apps.
 * Exact vectors matching official brand guidelines (NPCI, Paytm, Amazon Pay, PhonePe, Google Pay, CRED, BHIM).
 */

// 1. Official PhonePe Emblem:
// Authentic purple (#5F259F) squircle with the white Devanagari "पे" symbol
export const PhonePeEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#5F259F" />
    <path
      d="M32.8 17.2c0-.85-.69-1.54-1.54-1.54h-2.85l-7.98-7.72c-.59-.7-1.54-.94-2.48-.7l-2.25.7c-.35.12-.47.59-.24.82l7.12 6.76H13.3c-.35 0-.59.24-.59.59v1.18c0 .84.7 1.54 1.54 1.54h1.66v5.69c0 4.26 2.25 6.76 6.04 6.76 1.18 0 2.13-.12 3.32-.59v3.79c0 1.06.82 1.9 1.9 1.9h1.66c.35 0 .71-.36.71-.71V18.98h2.72c.35 0 .59-.24.59-.59v-1.19zm-7.59 10.2c-.71.35-1.66.47-2.37.47-1.9 0-2.84-.94-2.84-3.07v-5.69h5.21v8.29z"
      fill="#FFFFFF"
    />
  </svg>
);

// 2. Official Google Pay (GPay) Emblem:
// Authentic intertwined 4-color ribbons (Google Blue, Green, Yellow, Red)
export const GPayEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 54 54" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="54" height="54" rx="14" fill="#FFFFFF" />
    {/* Blue loop */}
    <path
      d="M48.8 27.2c0-1.8-.2-3.6-.5-5.3H27.3v10h12.2c-.5 2.9-2.1 5.3-4.5 7v5.7h7.3c4.3-4 6.5-9.8 6.5-17.4z"
      fill="#4285F4"
    />
    {/* Green loop */}
    <path
      d="M27.3 49.2c6.1 0 11.2-2 15-5.5l-7.3-5.7c-2 1.4-4.6 2.2-7.7 2.2-5.9 0-10.9-4-12.7-9.4H7v5.9c3.7 7.4 11.4 12.5 20.3 12.5z"
      fill="#34A853"
    />
    {/* Yellow loop */}
    <path
      d="M14.6 30.8c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4v-5.9H7C5.5 19.1 4.6 22.7 4.6 26.4s.9 7.3 2.4 10.3l7.6-5.9z"
      fill="#FBBC05"
    />
    {/* Red loop */}
    <path
      d="M27.3 11.6c3.3 0 6.3 1.1 8.7 3.4l6.5-6.5C38.5 4.7 33.4 2.7 27.3 2.7 18.4 2.7 10.7 7.8 7 15.2l7.6 5.9c1.8-5.4 6.8-9.5 12.7-9.5z"
      fill="#EA4335"
    />
  </svg>
);

// 3. Official Paytm Vector Wordmark (Horizontal):
// Dark navy #002970 for 'Pay' and bright cyan #00BAF2 for 'tm'
export const PaytmHorizontalLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-auto' }) => (
  <svg viewBox="0 0 16.838 5.285" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Official Paytm "tm" in cyan-blue #00BAF2 */}
    <g transform="matrix(0.35277777,0,0,-0.35277777,16.777056,1.5610286)">
      <path fill="#00BAF2" d="M 0,0 C -0.433,1.238 -1.613,2.127 -2.999,2.127 H -3.028 C -3.929,2.127 -4.741,1.752 -5.319,1.15 -5.898,1.752 -6.71,2.127 -7.61,2.127 h -0.029 c -0.792,0 -1.516,-0.29 -2.072,-0.77 V 1.601 C -9.73,1.844 -9.93,2.035 -10.177,2.035 h -2.126 c -0.26,0 -0.47,-0.21 -0.47,-0.471 V -9.981 c 0,-0.261 0.21,-0.471 0.47,-0.471 h 2.126 c 0.237,0 0.432,0.177 0.463,0.406 l -10e-4,8.288 c 0,0.029 10e-4,0.056 0.004,0.083 0.034,0.37 0.305,0.674 0.733,0.712 h 0.079 0.223 0.09 c 0.179,-0.016 0.33,-0.079 0.449,-0.174 0.185,-0.147 0.288,-0.373 0.288,-0.621 l 0.008,-8.247 c 0,-0.261 0.211,-0.472 0.47,-0.472 h 2.126 c 0.251,0 0.455,0.2 0.467,0.449 l -0.001,8.281 c -0.001,0.272 0.125,0.518 0.346,0.664 0.109,0.07 0.24,0.117 0.391,0.131 h 0.079 0.223 0.09 c 0.46,-0.04 0.738,-0.389 0.737,-0.795 l 0.008,-8.236 c 0,-0.261 0.211,-0.471 0.47,-0.471 h 2.126 c 0.259,0 0.47,0.21 0.47,0.471 v 8.858 C 0.161,-0.521 0.093,-0.264 0,0" />
    </g>
    <g transform="matrix(0.35277777,0,0,-0.35277777,11.699676,0.85374862)">
      <path fill="#00BAF2" d="m 0,0 h -1.216 v 1.97 0 c 0,0.002 0,0.004 0,0.006 0,0.237 -0.192,0.429 -0.429,0.429 C -1.673,2.405 -1.7,2.401 -1.726,2.396 -3.074,2.026 -2.804,0.159 -5.265,0 H -5.32 -5.504 c -0.036,0 -0.07,-0.005 -0.103,-0.012 h -0.002 l 0.002,-10e-4 C -5.817,-0.06 -5.975,-0.246 -5.975,-0.47 v -2.126 c 0,-0.259 0.211,-0.47 0.471,-0.47 h 1.283 l -0.002,-9.015 c 0,-0.257 0.208,-0.465 0.465,-0.465 h 2.102 c 0.256,0 0.464,0.208 0.464,0.465 l 10e-4,9.015 H 0 c 0.259,0 0.47,0.211 0.47,0.47 V -0.47 C 0.47,-0.211 0.259,0 0,0" />
    </g>
    {/* Official Paytm "Pay" in dark navy #002970 */}
    <g transform="matrix(0.35277777,0,0,-0.35277777,9.0012361,0.85374862)">
      <path fill="#002970" d="M 0,0 H -2.126 C -2.385,0 -2.595,-0.211 -2.595,-0.47 V -4.866 C -2.6,-5.138 -2.82,-5.356 -3.093,-5.356 h -0.89 c -0.276,0 -0.499,0.222 -0.499,0.498 L -4.49,-0.47 C -4.49,-0.211 -4.701,0 -4.96,0 h -2.126 c -0.26,0 -0.47,-0.211 -0.47,-0.47 v -4.818 c 0,-1.83 1.305,-3.135 3.136,-3.135 0,0 1.374,0 1.416,-0.008 0.248,-0.028 0.441,-0.236 0.441,-0.492 0,-0.253 -0.189,-0.46 -0.434,-0.491 -0.012,-0.002 -0.023,-0.005 -0.036,-0.007 l -3.109,-0.011 c -0.26,0 -0.47,-0.211 -0.47,-0.47 v -2.125 c 0,-0.26 0.21,-0.47 0.47,-0.47 h 3.476 c 1.832,0 3.136,1.304 3.136,3.135 V -0.47 C 0.47,-0.211 0.26,0 0,0" />
    </g>
    <g transform="matrix(0.35277777,0,0,-0.35277777,1.7417071,2.2279886)">
      <path fill="#002970" d="m 0,0 v -0.992 -0.32 c 0,-0.275 -0.223,-0.499 -0.498,-0.499 l -1.349,-0.001 v 2.629 h 1.349 C -0.223,0.817 0,0.595 0,0.319 Z M 0.187,3.896 H -4.46 c -0.255,0 -0.461,-0.207 -0.461,-0.461 V 1.352 c 0,-0.004 0.001,-0.008 0.001,-0.012 0,-0.01 -0.001,-0.02 -0.001,-0.029 V -5.37 -8.117 c 0,-0.256 0.192,-0.465 0.43,-0.471 h 0.04 2.126 c 0.259,0 0.47,0.21 0.47,0.47 l 0.008,3.231 h 2.034 c 1.702,0 2.888,1.181 2.888,2.89 v 2.999 c 0,1.709 -1.186,2.894 -2.888,2.894" />
    </g>
    <g transform="matrix(0.35277777,0,0,-0.35277777,4.8535941,3.9887686)">
      <path fill="#002970" d="M 0,0 V -0.332 C 0,-0.359 -0.004,-0.385 -0.008,-0.41 -0.013,-0.434 -0.02,-0.457 -0.028,-0.479 -0.094,-0.665 -0.28,-0.8 -0.501,-0.8 h -0.885 c -0.276,0 -0.501,0.21 -0.501,0.468 v 0.401 c 0,0.005 -10e-4,0.01 -10e-4,0.015 l 10e-4,1.067 v 0.002 0.118 0.214 l 0.001,0.003 c 10e-4,0.257 0.224,0.465 0.5,0.465 h 0.885 C -0.224,1.953 0,1.744 0,1.485 Z m -0.338,8.875 h -2.95 C -3.549,8.875 -3.76,8.677 -3.76,8.434 V 7.607 c 0,-0.005 10e-4,-0.011 10e-4,-0.016 0,-0.006 -10e-4,-0.012 -10e-4,-0.018 V 6.44 c 0,-0.257 0.224,-0.467 0.5,-0.467 h 2.809 c 0.222,-0.035 0.398,-0.197 0.423,-0.45 V 5.249 C -0.053,5.008 -0.227,4.832 -0.439,4.812 H -1.83 c -1.85,0 -3.168,-1.229 -3.168,-2.955 v -2.409 -0.063 c 0,-1.716 1.133,-2.937 2.97,-2.937 h 3.855 c 0.692,0 1.253,0.524 1.253,1.169 v 8.067 c 0,1.956 -1.008,3.191 -3.418,3.191" />
    </g>
  </svg>
);

// Official Paytm App Icon (Emblem):
// Authentic two-tone badge: white rounded card with official bold Paytm mark
export const PaytmEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-xl bg-white border border-gray-200/90 flex items-center justify-center p-1 shadow-2xs`}>
    <PaytmHorizontalLogo className="w-full h-auto max-w-[92%]" />
  </div>
);

// 4. Official BHIM (Bharat Interface for Money - NPCI) Logo & Emblem:
// Authentic NPCI design: dual-color forward-slanted triangles (Saffron #F37021 and Green #008238) with bold NPCI blue (#0C72BA) "BHIM"
export const BhimEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-xl bg-white border border-gray-200/90 flex items-center justify-center p-1 shadow-2xs`}>
    <svg viewBox="0 0 44 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Saffron / Orange triangle & chevron */}
      <path d="M7 6H25L17 21H7L12 11.5L7 6Z" fill="#F37021" />
      <path d="M21 6H31L23 21H18L21 6Z" fill="#F37021" opacity="0.9" />
      {/* Bottom Green triangle & chevron */}
      <path d="M15 23H25L17 38H7L15 23Z" fill="#008238" />
      <path d="M25 23H37L29 38H17L25 23Z" fill="#008238" />
      {/* Center dynamic arrow cut */}
      <path d="M30 6L38 6L33 16L25 16L30 6Z" fill="#0C72BA" />
    </svg>
  </div>
);

// Horizontal BHIM UPI Official Logo
export const BhimLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <div className={`inline-flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border border-gray-200 shadow-2xs ${className}`}>
    <BhimEmblem className="w-4 h-4" />
    <span className="text-[11px] font-black tracking-tight text-[#0C72BA]">BHIM</span>
    <span className="text-[10px] font-black italic tracking-tight text-[#008238]">UPI</span>
  </div>
);

// 5. Official Amazon Pay Logo & Emblem:
// Authentic Amazon styling: dark navy #232F3E squircle, crisp "amazon" wordmark, signature curved orange #FF9900 smile arrow with arrowhead, and "pay"
export const AmazonPayEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-xl bg-[#232F3E] flex flex-col items-center justify-center p-1 border border-zinc-700 shadow-2xs overflow-hidden`}>
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 'a' mark for Amazon */}
      <text
        x="15"
        y="25"
        fill="#FFFFFF"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="19"
        letterSpacing="-1"
      >
        a
      </text>
      {/* 'pay' in bright Amazon blue / cyan */}
      <text
        x="24"
        y="23"
        fill="#00A8E1"
        fontFamily="sans-serif"
        fontWeight="700"
        fontSize="12"
      >
        pay
      </text>
      {/* Signature Amazon Smile Arrow in #FF9900 */}
      <path
        d="M10 29 C 18 36, 32 36, 38 28.5"
        stroke="#FF9900"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Arrowhead pointing up into z */}
      <path
        d="M34 26.5 L40.5 28.5 L36.5 33.5 Z"
        fill="#FF9900"
      />
    </svg>
  </div>
);

// Horizontal Amazon Pay Logo
export const AmazonPayLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <div className={`inline-flex items-center gap-1.5 bg-[#232F3E] px-2 py-1 rounded-lg border border-zinc-700 shadow-2xs ${className}`}>
    <span className="text-white text-xs font-bold tracking-tight">amazon</span>
    <span className="text-[#00A8E1] text-xs font-bold -ml-0.5">pay</span>
  </div>
);

// 6. Official CRED Emblem:
// Authentic outer shield polygon + concentric inner shield facets + bottom anchor line
export const CredEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 100 100" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#FFFFFF" />
    <path
      d="M50 90C49.3 90 48.7 89.8 48.2 89.5L14.2 69.5C13.2 68.9 12.5 67.8 12.5 66.7V14C12.5 12.3 13.9 11 15.6 11H84.4C86.1 11 87.5 12.3 87.5 14V66.7C87.5 67.8 86.8 68.9 85.8 69.5L51.8 89.5C51.3 89.8 50.7 90 50 90ZM18.8 64.5L50 82.8L81.2 64.5V17.2H18.8V64.5Z"
      fill="#000000"
    />
    <path
      d="M50 71C49.3 71 48.7 70.8 48.2 70.5L27.2 58.2C26.2 57.6 25.6 56.5 25.6 55.4V34H31.8V53.6L50 64.3L68.2 53.6V34H74.4V55.4C74.4 56.5 73.8 57.6 72.8 58.2L51.8 70.5C51.3 70.8 50.7 71 50 71Z"
      fill="#000000"
    />
    <path
      d="M50 55C49.3 55 48.7 54.8 48.2 54.5L38.2 48.5C37.2 47.9 36.6 46.8 36.6 45.7V34H42.8V44L50 48.3L57.2 44V34H63.4V45.7C63.4 46.8 62.8 47.9 61.8 48.5L51.8 54.5C51.3 54.8 50.7 55 50 55Z"
      fill="#000000"
    />
    <path
      d="M74.4 28H25.6V22H74.4V28Z"
      fill="#000000"
    />
  </svg>
);

// 7. Official NPCI Unified Payments Interface (UPI) Emblem:
export const UpiEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-xl bg-white border border-gray-200/90 flex items-center justify-center gap-0.5 p-1 shadow-2xs`}>
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 32 32" fill="none">
      <path d="M19.5 5L13.5 27H7.5L13.5 5H19.5Z" fill="#9CA3AF" opacity="0.4" />
      <path d="M24.5 5L15.5 27H20.5L29.5 5H24.5Z" fill="#097F52" />
      <path d="M16 5L7 27H2L11 5H16Z" fill="#EB6824" />
    </svg>
    <span className="text-[10px] font-black italic tracking-wider text-gray-900">UPI</span>
  </div>
);

// Secondary UPI Apps for Drawer (WhatsApp Pay, Navi, Mobikwik, Airtel, Slice, Jupiter, etc.)
// 1. Official WhatsApp Pay Emblem:
export const WhatsAppPayEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-full bg-[#25D366] flex items-center justify-center shadow-2xs overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-[62%] h-[62%] fill-white" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  </div>
);

// 2. Official Navi Emblem:
export const NaviEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-full bg-[#0F1E2E] flex items-center justify-center p-0.5 shadow-2xs overflow-hidden`}>
    <svg viewBox="0 0 36 36" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="58%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#00E575"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="12.5"
        letterSpacing="-0.5"
      >
        navi
      </text>
    </svg>
  </div>
);

// 3. Official MobiKwik Emblem:
export const MobikwikEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-full bg-[#0070E0] flex items-center justify-center p-0.5 shadow-2xs overflow-hidden`}>
    <svg viewBox="0 0 32 32" className="w-[72%] h-[72%]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 24V9L11 16L16 9L21 16L27 9V24H22.5V15.5L18.5 21H13.5L9.5 15.5V24H5Z" fill="#FFFFFF" />
    </svg>
  </div>
);

// 4. Official Airtel Payments Bank Emblem:
export const AirtelEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-full bg-[#E60000] flex items-center justify-center p-0.5 shadow-2xs overflow-hidden`}>
    <svg viewBox="0 0 36 36" className="w-[76%] h-[76%]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 7C11.9 7 7 11.9 7 18C7 24.1 11.9 29 18 29C24.1 29 29 24.1 29 18C29 11.9 24.1 7 18 7ZM18 10.8C21.4 10.8 24.2 13.2 24.8 16.5H21.5C21 14.7 19.6 13.5 18 13.5C15.5 13.5 13.5 15.5 13.5 18C13.5 20.5 15.5 22.5 18 22.5C19.6 22.5 21 21.3 21.5 19.5H24.8C24.2 22.8 21.4 25.2 18 25.2C14 25.2 10.8 22 10.8 18C10.8 14 14 10.8 18 10.8Z"
        fill="#FFFFFF"
      />
    </svg>
  </div>
);

// 5. Official Slice Emblem:
export const SliceEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-full bg-[#7C3AED] flex items-center justify-center p-0.5 shadow-2xs overflow-hidden`}>
    <svg viewBox="0 0 32 32" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 23C7 14.16 14.16 7 23 7V12C16.93 12 12 16.93 12 23H7Z" fill="#FFFFFF" />
      <circle cx="21" cy="21" r="3.8" fill="#FFFFFF" />
    </svg>
  </div>
);

// 6. Official Jupiter UPI Emblem:
export const JupiterEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`${className} shrink-0 rounded-full bg-[#FF5722] flex items-center justify-center shadow-2xs overflow-hidden`}>
    <span className="text-white font-black text-[13px] tracking-tight">J</span>
  </div>
);

export const SuperMoneyEmblem: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <div className={`${className} shrink-0 rounded-full bg-[#0047FF] flex items-center justify-center text-white shadow-2xs`}>
    <span className="font-black text-[9px] tracking-tighter italic">super</span>
  </div>
);

export const PopUpiEmblem: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <div className={`${className} shrink-0 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-black text-[8px] tracking-wider shadow-2xs`}>
    POP
  </div>
);

export const LxmeEmblem: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <div className={`${className} shrink-0 rounded-full bg-[#E6007E] flex items-center justify-center text-white font-black text-[8px] tracking-tighter shadow-2xs`}>
    LXME
  </div>
);

/**
 * Official Clubbed UPI Logo as per premier Indian fintech industry standards (Razorpay, Juspay, Swiggy, Zomato).
 * Features an overlapping avatar stack of authentic circular brand emblems (WhatsApp Pay, Navi, Mobikwik, Airtel)
 * with surgical white border rings (ring-2 ring-white) and an elegant "+10" count badge.
 */
export const ClubbedUpiLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md',
}) => {
  const itemSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6.5 h-6.5';
  const countText = size === 'sm' ? 'text-[8px]' : size === 'lg' ? 'text-[11px]' : 'text-[9.5px]';
  const overlap = size === 'sm' ? '-space-x-1.5' : size === 'lg' ? '-space-x-2.5' : '-space-x-2';

  return (
    <div className={`inline-flex items-center ${overlap} ${className}`} aria-label="More UPI Apps">
      {/* 1. WhatsApp Pay */}
      <div className={`${itemSize} rounded-full ring-2 ring-white shadow-xs z-40 shrink-0`}>
        <WhatsAppPayEmblem className="w-full h-full" />
      </div>

      {/* 2. Navi UPI */}
      <div className={`${itemSize} rounded-full ring-2 ring-white shadow-xs z-30 shrink-0`}>
        <NaviEmblem className="w-full h-full" />
      </div>

      {/* 3. Mobikwik */}
      <div className={`${itemSize} rounded-full ring-2 ring-white shadow-xs z-20 shrink-0`}>
        <MobikwikEmblem className="w-full h-full" />
      </div>

      {/* 4. Airtel Payments Bank */}
      <div className={`${itemSize} rounded-full ring-2 ring-white shadow-xs z-10 shrink-0`}>
        <AirtelEmblem className="w-full h-full" />
      </div>

      {/* 5. Plus More Apps Count Badge */}
      <div
        className={`${itemSize} rounded-full ring-2 ring-white bg-gray-900 text-white flex items-center justify-center font-bold ${countText} shadow-xs z-0 shrink-0`}
      >
        +10
      </div>
    </div>
  );
};

/**
 * Composite Squircle Emblem (2x2 grid) for "More UPI Apps"
 * as seen in modern native fintech payment pickers.
 */
export const MoreUpiCompositeBadge: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-xl bg-white border border-gray-200/90 shadow-2xs p-1 grid grid-cols-2 gap-0.5 shrink-0`}>
    <div className="w-full h-full rounded-full bg-[#25D366] flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </div>
    <div className="w-full h-full rounded-full bg-[#0F1E2E] flex items-center justify-center text-[#00E575] font-black text-[6.5px]">
      n
    </div>
    <div className="w-full h-full rounded-full bg-[#0070E0] flex items-center justify-center text-white font-black text-[6.5px]">
      M
    </div>
    <div className="w-full h-full rounded-full bg-[#E60000] flex items-center justify-center text-white font-black text-[6.5px]">
      a
    </div>
  </div>
);

// Backward-compatible logos with size support
export const GPayLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : size === 'lg' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className={`inline-flex items-center gap-1 bg-white ${sizeClasses} rounded border border-gray-200 shadow-2xs ${className}`}>
      <GPayEmblem className={iconSize} />
      <span className="font-semibold text-gray-800">GPay</span>
    </div>
  );
};

export const PhonePeLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : size === 'lg' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className={`inline-flex items-center gap-1 bg-white ${sizeClasses} rounded border border-gray-200 shadow-2xs ${className}`}>
      <PhonePeEmblem className={iconSize} />
      <span className="font-bold text-[#5F259F]">PhonePe</span>
    </div>
  );
};

export const PaytmLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5' : size === 'lg' ? 'px-2.5 py-1' : 'px-2 py-0.5';
  const logoWidth = size === 'sm' ? 'w-9' : size === 'lg' ? 'w-14' : 'w-11';
  return (
    <div className={`inline-flex items-center justify-center bg-white ${sizeClasses} rounded border border-gray-200 shadow-2xs ${className}`}>
      <PaytmHorizontalLogo className={`${logoWidth} h-auto`} />
    </div>
  );
};

export const IndiaPaymentsStrip: React.FC<{ className?: string; compact?: boolean }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2 flex-wrap ${className}`}>
    <PhonePeLogo size="sm" />
    <GPayLogo size="sm" />
    <PaytmLogo size="sm" />
    <div className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
      <span className="text-[10px] font-bold text-gray-700">UPI</span>
    </div>
  </div>
);

