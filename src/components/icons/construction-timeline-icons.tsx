import type { ComponentType, SVGProps } from "react";

export type ConstructionTimelineIconProps = SVGProps<SVGSVGElement>;

/** Vertical connector between timeline nodes (Figma stroke #DEEBF2). */
export function DashboardTimelineConnectorIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 2 89"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        stroke="currentColor"
        strokeLinecap="round"
        x1="1"
        x2="1"
        y1="0"
        y2="89"
      />
    </svg>
  );
}

export function DashboardTimelineCtStartIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 20.9995 21.0041"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M13.4795 5.5181C13.4795 5.5181 13.9795 6.0181 14.4795 7.0181C14.4795 7.0181 16.0685 4.5181 17.4795 4.0181M8.49455 0.5231C5.99555 0.4181 4.06555 0.7051 4.06555 0.7051C2.84655 0.7931 0.511548 1.4751 0.511548 5.4671C0.511548 9.4231 0.485548 14.3011 0.511548 16.2461C0.511548 17.4341 1.24655 20.2061 3.79255 20.3541C6.88755 20.5341 12.4625 20.5731 15.0205 20.3541C15.7045 20.3151 17.9845 19.7781 18.2725 17.2981C18.5725 14.7281 18.5125 12.9431 18.5125 12.5181" />
        <path
          d="M5.47955 11.5181H9.47955M5.47955 15.5181H13.4795M20.4995 5.5181C20.4995 8.2791 18.2595 10.5181 15.4945 10.5181C14.8375 10.5188 14.1868 10.3899 13.5796 10.1389C12.9724 9.88795 12.4206 9.51976 11.9558 9.0554C11.491 8.59104 11.1222 8.03963 10.8706 7.43267C10.619 6.82572 10.4895 6.17513 10.4895 5.5181C10.4895 2.7561 12.7305 0.5181 15.4945 0.5181C16.1516 0.517443 16.8023 0.646287 17.4095 0.897267C18.0167 1.14825 18.5685 1.51644 19.0333 1.9808C19.4981 2.44516 19.8669 2.99657 20.1185 3.60353C20.3701 4.21048 20.4995 4.86107 20.4995 5.5181Z"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function DashboardTimelineCtFoundationIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.5 7.5H12.509" />
        <path d="M12.5 4C14.394 4 16 5.613 16 7.57C16 9.559 14.368 10.954 12.86 11.903C12.7505 11.9662 12.6264 11.9995 12.5 11.9995C12.3736 11.9995 12.2495 11.9662 12.14 11.903C10.635 10.945 9 9.565 9 7.57C9 5.613 10.606 4 12.5 4Z" />
        <path d="M0.5 10C0.5 5.522 0.5 3.282 1.891 1.891C3.282 0.5 5.521 0.5 10 0.5C14.478 0.5 16.718 0.5 18.109 1.891C19.5 3.282 19.5 5.521 19.5 10C19.5 14.478 19.5 16.718 18.109 18.109C16.718 19.5 14.479 19.5 10 19.5C5.522 19.5 3.282 19.5 1.891 18.109C0.5 16.718 0.5 14.479 0.5 10Z" />
        <path d="M15 19L1 5M8 12L2 18" />
      </g>
    </svg>
  );
}

export function DashboardTimelineCtWallsIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 20.5 20.5"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0.750001 7.75H11.75M15.75 7.75H19.75" />
        <path d="M7.75 19.75V7.75" />
        <path
          d="M7.75 4.75V0.750001M15.25 15.25C13.25 15.25 11.25 16.872 11.25 19.75H8.75C4.979 19.75 3.093 19.75 1.922 18.578C0.751001 17.406 0.750001 15.521 0.750001 11.75V8.75C0.750001 4.979 0.750001 3.093 1.922 1.922C3.094 0.751001 4.979 0.750001 8.75 0.750001H11.75C15.521 0.750001 17.407 0.750001 18.578 1.922C19.749 3.094 19.75 4.979 19.75 8.75V16.093C19.75 17.0629 19.3647 17.9931 18.6789 18.6789C17.9931 19.3647 17.0629 19.75 16.093 19.75"
          strokeWidth={1.5}
        />
      </g>
    </svg>
  );
}

export function DashboardTimelineCtEngineeringIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 21 14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.5 4.5V10.5M3.5 7.5V9.36C3.5 10.407 3.5 10.931 3.737 11.373C3.973 11.816 4.409 12.106 5.282 12.688L5.492 12.828C5.992 13.162 6.243 13.328 6.526 13.414C6.809 13.5 7.11 13.5 7.711 13.5H10.5C12.386 13.5 13.328 13.5 13.914 12.914C14.5 12.328 14.5 11.386 14.5 9.5H17.5V12C17.5 12.466 17.5 12.699 17.577 12.883C17.6783 13.1277 17.8725 13.3223 18.117 13.424C18.301 13.5 18.534 13.5 19 13.5C19.466 13.5 19.699 13.5 19.883 13.423C20.1277 13.3217 20.3223 13.1275 20.424 12.883C20.5 12.699 20.5 12.466 20.5 12V5C20.5 4.534 20.5 4.301 20.423 4.117C20.3217 3.87227 20.1275 3.67771 19.883 3.576C19.699 3.5 19.466 3.5 19 3.5C18.534 3.5 18.301 3.5 18.117 3.577C17.8723 3.67826 17.6777 3.87246 17.576 4.117C17.5 4.301 17.5 4.534 17.5 5V6.5H14.5C14.5 5.568 14.5 5.102 14.348 4.735C14.2475 4.49218 14.1001 4.27155 13.9143 4.08572C13.7284 3.8999 13.5078 3.75251 13.265 3.652C12.898 3.5 12.432 3.5 11.5 3.5H7.5C5.614 3.5 4.672 3.5 4.086 4.086C3.5 4.672 3.5 5.614 3.5 7.5ZM3.5 7.5H0.5M9 3.5V0.5M5.5 0.5H12.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DashboardTimelineCtFinishingIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 21.0001 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M15.5 1.83801C13.9806 0.958738 12.2555 0.497119 10.5 0.500014C4.977 0.500014 0.5 4.97701 0.5 10.5C0.5 16.023 4.977 20.5 10.5 20.5C16.023 20.5 20.5 16.023 20.5 10.5C20.4987 9.81335 20.432 9.14668 20.3 8.50001" />
        <path
          d="M6.5 11C6.5 11 8 11 10 14.5C10 14.5 15.559 5.33301 20.5 3.50001"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function DashboardTimelineCtLandscapingIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 13.5H15M11.5 13.5H9.5M6 13.5H4" />
        <path d="M10.5 0.5C8.29 0.5 6.5 2.309 6.5 4.54C6.5 5.816 7 6.808 8 7.694C8.705 8.319 9.559 9.357 10.071 10.197C10.317 10.601 10.665 10.601 10.929 10.197C11.467 9.373 12.295 8.319 13 7.695C14 6.808 14.5 5.816 14.5 4.54C14.5 2.31 12.71 0.5 10.5 0.5Z" />
        <path d="M10.5 4.5H10.509" />
        <path d="M17.5 6.5C18.274 6.65 18.859 6.9 19.328 7.317C20.5 8.36 20.5 10.035 20.5 13.388C20.5 16.741 20.5 18.417 19.328 19.458C18.156 20.499 16.271 20.5 12.5 20.5H8.5C4.729 20.5 2.843 20.5 1.672 19.459C0.5 18.417 0.5 16.74 0.5 13.388C0.5 10.036 0.5 8.359 1.672 7.318C2.142 6.9 2.726 6.65 3.5 6.5" />
      </g>
    </svg>
  );
}

export function DashboardTimelinePtWaitlistingIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.5 0.5V3.5M9.5 15.5V18.5M18.5 9.5H15.5M3.5 9.5H0.5M15.864 3.137L13.742 5.258M5.258 13.742L3.137 15.863M15.864 15.864L13.742 13.742M5.258 5.258L3.137 3.137"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DashboardTimelinePtInitialFundingIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 21 17.9981"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 10.5C13 11.163 12.7366 11.7989 12.2678 12.2678C11.7989 12.7366 11.1631 13 10.5 13C9.83698 13 9.20109 12.7366 8.73225 12.2678C8.26341 11.7989 8.00002 11.163 8.00002 10.5C8.00002 9.83696 8.26341 9.20107 8.73225 8.73223C9.20109 8.26339 9.83698 8 10.5 8C11.1631 8 11.7989 8.26339 12.2678 8.73223C12.7366 9.20107 13 9.83696 13 10.5Z" />
        <path d="M16 3.549C17.683 3.662 18.894 3.947 19.633 4.176C20.176 4.344 20.5 4.859 20.5 5.426V15.182C20.5 16.297 19.272 17.136 18.176 16.929C17.236 16.752 16.011 16.609 14.5 16.609C9.75002 16.609 8.61002 18.415 1.64502 16.879C1.31864 16.805 1.02728 16.6219 0.81909 16.3599C0.610899 16.0979 0.49834 15.7727 0.500019 15.438V5.421C0.500019 4.445 1.42002 3.733 2.37802 3.923C3.36602 4.119 4.22902 4.243 5.00002 4.314" />
        <path d="M0.500018 7.5C2.45102 7.5 4.20502 5.905 4.42902 4.254M17 4C17 6.04 18.765 7.969 20.5 7.969M20.5 13.5C18.6 13.5 16.76 14.81 16.602 16.598M4.50002 16.996C4.50002 15.9351 4.07859 14.9177 3.32845 14.1676C2.5783 13.4174 1.56088 12.996 0.500018 12.996M10.5 4.5V0.5M13.5 4.5V2.5M7.50002 4.5V2.5" />
      </g>
    </svg>
  );
}

export function DashboardTimelinePtConstructionFundingIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 18.9989 20.9974"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.2451 11.4975C17.9474 10.4881 18.3713 9.31146 18.4743 8.08609C18.5772 6.86072 18.3556 5.62985 17.8316 4.51738C17.3077 3.4049 16.4999 2.45008 15.4896 1.74902C14.4793 1.04796 13.3022 0.625411 12.0767 0.523896C10.8512 0.422381 9.62063 0.645486 8.50877 1.17075C7.39691 1.69602 6.44304 2.50491 5.74318 3.51601C5.04331 4.52711 4.62214 5.70473 4.52207 6.93034C4.422 8.15595 4.64655 9.3863 5.17313 10.4975" />
        <path d="M11.5001 4.49754C10.3951 4.49754 9.50013 5.16954 9.50013 5.99754C9.50013 6.82554 10.3951 7.49754 11.5001 7.49754C12.6051 7.49754 13.5001 8.16954 13.5001 8.99754C13.5001 9.82554 12.6051 10.4975 11.5001 10.4975M11.5001 4.49754C12.3701 4.49754 13.1121 4.91454 13.3861 5.49754M11.5001 4.49754V3.49754M11.5001 10.4975C10.6301 10.4975 9.88813 10.0805 9.61413 9.49754M11.5001 10.4975V11.4975" />
        <path d="M0.500131 12.4975H2.89513C3.18913 12.4975 3.47913 12.5635 3.74213 12.6915L5.78413 13.6795C6.04713 13.8065 6.33713 13.8725 6.63213 13.8725H7.67413C8.68213 13.8725 9.50013 14.6635 9.50013 15.6395C9.50013 15.6795 9.47313 15.7135 9.43413 15.7245L6.89313 16.4275C6.43718 16.5535 5.951 16.5094 5.52513 16.3035L3.34213 15.2475M9.50013 14.9975L14.0931 13.5865C14.493 13.4638 14.9214 13.4706 15.3172 13.6058C15.713 13.741 16.0559 13.9978 16.2971 14.3395C16.6661 14.8495 16.5161 15.5815 15.9781 15.8915L8.46313 20.2285C8.22815 20.3645 7.96794 20.4512 7.69837 20.4833C7.4288 20.5155 7.1555 20.4924 6.89513 20.4155L0.500131 18.5175" />
      </g>
    </svg>
  );
}

export function DashboardTimelinePtFundedIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 21.0001 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="currentColor">
        <path d="M14.0001 11.5C17.59 11.5 20.5001 10.6046 20.5001 9.5C20.5001 8.39543 17.59 7.5 14.0001 7.5C10.4103 7.5 7.50013 8.39543 7.50013 9.5C7.50013 10.6046 10.4103 11.5 14.0001 11.5Z" />
        <path d="M20.5001 14C20.5001 15.105 17.5901 16 14.0001 16C10.4101 16 7.50013 15.105 7.50013 14" />
        <path d="M20.5001 9.5V18.3C20.5001 19.515 17.5901 20.5 14.0001 20.5C10.4101 20.5 7.50013 19.515 7.50013 18.3V9.5" />
        <path d="M7.00013 4.5C10.59 4.5 13.5001 3.60457 13.5001 2.5C13.5001 1.39543 10.59 0.5 7.00013 0.5C3.41028 0.5 0.500134 1.39543 0.500134 2.5C0.500134 3.60457 3.41028 4.5 7.00013 4.5Z" />
        <path
          d="M4.50013 9.5C2.60813 9.27 0.870134 8.675 0.500134 7.5M4.50013 14.5C2.60813 14.27 0.870134 13.675 0.500134 12.5"
          strokeLinecap="round"
        />
        <path
          d="M4.50013 19.5C2.60813 19.27 0.870134 18.674 0.500134 17.5V2.5M13.5001 4.5V2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function DashboardTimelinePtStrategySelectionIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 21.5 21.5"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M3.75 0.75V6.75M0.75 3.75H6.75" />
        <path d="M10.75 3.75H13.75M10.75 20.75H13.75M16.75 3.75H17.25C18.1783 3.75 19.0685 4.11875 19.7249 4.77513C20.3813 5.4315 20.75 6.32174 20.75 7.25V7.75M20.75 16.75V17.25C20.75 18.1783 20.3813 19.0685 19.7249 19.7249C19.0685 20.3813 18.1783 20.75 17.25 20.75H16.75M7.75 20.75H7.25C6.32174 20.75 5.4315 20.3813 4.77513 19.7249C4.11875 19.0685 3.75 18.1783 3.75 17.25V16.75M20.75 10.75V13.75M3.75 10.75V13.75" />
      </g>
    </svg>
  );
}

export function DashboardTimelinePtStrategyExecutionIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 19 19.25"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15.5 8.5L17.846 6.349C18.282 5.949 18.5 5.749 18.5 5.5M18.5 5.5C18.5 5.251 18.282 5.051 17.846 4.651L15.5 2.5M18.5 5.5C0.5 5.5 0.5 18.5 0.5 18.5" />
        <path d="M3 5.5C4.38071 5.5 5.5 4.38071 5.5 3C5.5 1.61929 4.38071 0.5 3 0.5C1.61929 0.5 0.5 1.61929 0.5 3C0.5 4.38071 1.61929 5.5 3 5.5Z" />
        <path d="M10.5 18.5L15.5 13.5M15.5 18.5L10.5 13.5" strokeWidth={1.5} />
      </g>
    </svg>
  );
}

export function DashboardTimelinePtRentStartedIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 21 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.5 6.5L10.27 2.235C11.566 1.078 12.213 0.5 13 0.5C13.787 0.5 14.435 1.078 15.73 2.235L20.5 6.5M7 5.5V17.5M19 17.5V5.5" />
        <path d="M2 11.5C2.82843 11.5 3.5 10.6046 3.5 9.5C3.5 8.39543 2.82843 7.5 2 7.5C1.17157 7.5 0.5 8.39543 0.5 9.5C0.5 10.6046 1.17157 11.5 2 11.5Z" />
        <path d="M2 11.5V17.5" />
        <path d="M0.5 17.5H20.5M10.5 17.5V13.5C10.5 12.557 10.5 12.086 10.793 11.793C11.086 11.5 11.557 11.5 12.5 11.5H13.5C14.443 11.5 14.914 11.5 15.207 11.793C15.5 12.086 15.5 12.557 15.5 13.5V17.5M12 8.5H14M12 5.5H14" />
      </g>
    </svg>
  );
}

export function DashboardTimelinePtOnSaleIcon(
  props: ConstructionTimelineIconProps,
) {
  return (
    <svg
      fill="none"
      viewBox="0 0 20.9999 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeLinejoin="round">
        <path d="M0.964433 6.344C0.716433 6.344 0.489433 6.142 0.500433 5.879C0.567433 4.337 0.755433 3.333 1.28043 2.539C1.57989 2.08653 1.95544 1.68933 2.39043 1.365C3.55543 0.5 5.20043 0.5 8.49243 0.5H12.5064C15.7984 0.5 17.4434 0.5 18.6104 1.365C19.0414 1.685 19.4174 2.082 19.7194 2.539C20.2444 3.333 20.4324 4.337 20.4994 5.879C20.5104 6.142 20.2834 6.344 20.0344 6.344C18.6484 6.344 17.5254 7.533 17.5254 9C17.5254 10.467 18.6484 11.656 20.0354 11.656C20.2834 11.656 20.5104 11.858 20.4994 12.122C20.4324 13.663 20.2444 14.667 19.7194 15.462C19.4199 15.9141 19.0443 16.311 18.6094 16.635C17.4434 17.5 15.7984 17.5 12.5064 17.5H8.49343C5.20143 17.5 3.55643 17.5 2.38943 16.635C1.9548 16.3106 1.57959 15.9134 1.28043 15.461C0.755433 14.667 0.567433 13.663 0.500433 12.121C0.489433 11.858 0.716433 11.656 0.964433 11.656C2.35043 11.656 3.47443 10.467 3.47443 9C3.47443 7.533 2.35043 6.344 0.964433 6.344Z" />
        <path d="M8.00043 11.5L13.0004 6.5" strokeLinecap="round" />
        <path
          d="M8.00043 6.5H8.01143M12.9894 11.5H13.0004"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export const CONSTRUCTION_TIMELINE_ICON_MAP = {
  "ct-start": DashboardTimelineCtStartIcon,
  "ct-foundation": DashboardTimelineCtFoundationIcon,
  "ct-walls": DashboardTimelineCtWallsIcon,
  "ct-engineering": DashboardTimelineCtEngineeringIcon,
  "ct-finishing": DashboardTimelineCtFinishingIcon,
  "ct-landscaping": DashboardTimelineCtLandscapingIcon,
  "pt-waitlisting": DashboardTimelinePtWaitlistingIcon,
  "pt-initial": DashboardTimelinePtInitialFundingIcon,
  "pt-construction-funding": DashboardTimelinePtConstructionFundingIcon,
  "pt-funded": DashboardTimelinePtFundedIcon,
  "pt-strategy-selection": DashboardTimelinePtStrategySelectionIcon,
  "pt-strategy-execution": DashboardTimelinePtStrategyExecutionIcon,
  "pt-rent-started": DashboardTimelinePtRentStartedIcon,
  "pt-on-sale": DashboardTimelinePtOnSaleIcon,
} as const satisfies Record<
  string,
  ComponentType<ConstructionTimelineIconProps>
>;

export type ConstructionTimelineIconKey =
  keyof typeof CONSTRUCTION_TIMELINE_ICON_MAP;
