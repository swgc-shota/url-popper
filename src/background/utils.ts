/*export const MSG_TYPE = {
  TOGGLE_APP: "20240519-0",
  TOGGLE_COPYMODE: "20240519-1",
  SUCCESS: "20240519-2",
  FAILED: "20240519-3",
  UNKNOWN: "20240519-4",
  COPY_MODE_BOTH: "20240519-5",
  COPY_MODE_SINGLE: "20240519-6",
} as const;
export const MY_EVT = { ...MSG_TYPE } as const;

export const APP_STATUS = {
  ON: "1",
  OFF: "0",
} as const;

export const COPY_MODE = {
  BOTH: "0",
  SINGLE: "1",
} as const;

export const STOR_KEY = {
  APP_STATUS: "APP_STATUS",
  COPY_MODE: "COPY_MODE",
} as const;

export const BTN_TYPE = {
  URL: "url",
  TEXT: "text",
} as const;
*/
export const getDate = (): string => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
