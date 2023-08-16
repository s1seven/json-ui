import { TemplateResult, html } from "lit";

export type IconName =
  | "ARROW_RIGHT"
  | "ARROW_LEFT"
  | "CHEVRON_RIGHT"
  | "ADD"
  | "REMOVE"
  | "ERROR"
  | "DONE"
  | "EXPAND_ALL";
export type Icon = () => TemplateResult;

export const icons: Record<IconName, Icon> = {
  ARROW_RIGHT: () =>
    html`<svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path
        fill="currentColor"
        d="m560-242-43-42 168-168H160v-60h525L516-681l43-42 241 241-240 240Z"
      />
    </svg>`,
  ARROW_LEFT: () => html` <svg
    class="w-6 h-6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
  >
    <path
      fill="currentColor"
      d="M400-240 160-480l241-241 43 42-169 169h526v60H275l168 168-43 42Z"
    />
  </svg>`,
  CHEVRON_RIGHT: () =>
    html`<svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path
        fill="currentColor"
        d="M530-481 332-679l43-43 241 241-241 241-43-43 198-198Z"
      />
    </svg>`,
  ADD: () => html`
    <svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path
        fill="currentColor"
        d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z"
      />
    </svg>
  `,
  REMOVE: () =>
    html`<svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path fill="currentColor" d="M200-450v-60h560v60H200Z" />
    </svg>`,
  ERROR: () =>
    html`<svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path
        fill="currentColor"
        d="M479.982-280q14.018 0 23.518-9.482 9.5-9.483 9.5-23.5 0-14.018-9.482-23.518-9.483-9.5-23.5-9.5-14.018 0-23.518 9.482-9.5 9.483-9.5 23.5 0 14.018 9.482 23.518 9.483 9.5 23.5 9.5ZM453-433h60v-253h-60v253Zm27.266 353q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"
      />
    </svg>`,
  DONE: () =>
    html`<svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path
        fill="currentColor"
        d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"
      />
    </svg>`,
  EXPAND_ALL: () =>
    html`<svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path
        d="M480-80 240-320l44-44 196 196 196-196 44 44L480-80ZM284-596l-44-44 240-240 240 240-44 44-196-196-196 196Z"
      />
    </svg>`,
};
