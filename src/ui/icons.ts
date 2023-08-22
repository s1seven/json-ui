import { TemplateResult, html } from "lit";

export type IconName =
  | "ARROW_RIGHT"
  | "ARROW_LEFT"
  | "CHEVRON_RIGHT"
  | "ADD"
  | "REMOVE"
  | "ERROR"
  | "DONE"
  | "EXPAND_ALL"
  | "TREE"
  | "DATA"
  | "CLOSE";

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
        fill="currentColor"
        d="M480-80 240-320l44-44 196 196 196-196 44 44L480-80ZM284-596l-44-44 240-240 240 240-44 44-196-196-196 196Z"
      />
    </svg>`,
  TREE: () =>
    html`<svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path
        fill="currentColor"
        d="M604-120v-125H450v-410h-93v130H80v-315h277v125h247v-125h276v315H604v-130h-94v350h94v-130h276v315H604ZM140-780v195-195Zm524 405v195-195Zm0-405v195-195Zm0 195h156v-195H664v195Zm0 405h156v-195H664v195ZM140-585h157v-195H140v195Z"
      />
    </svg>`,
  DATA: () =>
    html`<svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path
        fill="currentColor"
        d="M570-160v-60h120q21 0 35.5-14.375T740-270v-100q0-37 22.5-66t57.5-40v-8q-35-10-57.5-39.5T740-590v-100q0-21.25-14.375-35.625T690-740H570v-60h120q46 0 78 32.083 32 32.084 32 77.917v100q0 21.25 14.375 35.625T850-540h30v120h-30q-21.25 0-35.625 14.375T800-370v100q0 45.833-32.083 77.917Q735.833-160 690-160H570Zm-300 0q-46 0-78-32.083-32-32.084-32-77.917v-100q0-21.25-14.375-35.625T110-420H80v-120h30q21.25 0 35.625-14.375T160-590v-100q0-45.833 32.083-77.917Q224.167-800 270-800h120v60H270q-21 0-35.5 14.375T220-690v100q0 37-22.5 66.5T140-484v8q35 11 57.5 40t22.5 66v100q0 21.25 14.375 35.625T270-220h120v60H270Z"
      />
    </svg>`,
  CLOSE: () =>
    html`<svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path
        fill="currentColor"
        d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"
      />
    </svg>`,
};
