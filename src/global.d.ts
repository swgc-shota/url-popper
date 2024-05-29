//background.ts / content.ts

declare const MSG_TYPE: {
  readonly TOGGLE_APP: "20240519-0";
  readonly TOGGLE_COPYMODE: "20240519-1";
  readonly SUCCESS: "20240519-2";
  readonly FAILED: "20240519-3";
  readonly UNKNOWN: "20240519-4";
};

type MessageType = (typeof MSG_TYPE)[keyof typeof MSG_TYPE];

type Message = {
  readonly type: MessageType;
  readonly newStatus?: AppStatus;
  readonly newCopyMode?: CopyMode;
};

declare const COPY_MODE: {
  readonly BOTH: "1";
  readonly SINGLE: "0";
};
type CopyMode = (typeof COPY_MODE)[keyof typeof COPY_MODE];

declare const APP_STATUS: {
  readonly ON: "1";
  readonly OFF: "0";
};
type AppStatus = (typeof APP_STATUS)[keyof typeof APP_STATUS];

declare const MY_EVT = MSG;
type PopperEvent = (typeof MY_EVT)[keyof typeof MY_EVT];

//backgrount.ts
declare const STOR_KEY: {
  readonly APP_STATUS: "APP_STATUS";
  readonly COPY_MODE: "COPY_MODE";
};
type StorKey = (typeof STOR_KEY)[keyof typeof STOR_KEY];

//content.ts
declare const BTN_TYPE: {
  readonly URL: "url";
  readonly TEXT: "text";
};
type BtnType = (typeof BTN_TYPE)[keyof typeof BTN_TYPE];

type PopperTexts = {
  [BTN_TYPE.TEXT]: string;
  [BTN_TYPE.URL]: string;
};

type PositionalProps = {
  top: string;
  left: string;
  right: string;
  bottom: string;
};

type Coord = {
  x: number;
  y: number;
};

type PopSource = Document | HTMLAnchorElement | HTMLImageElement;

type CursorDirX = "toLeft" | "toRight";
type CursorDirY = "toTop" | "toBottom";
type CusorDirection = (CursorDirX & CursorDirX) | "";

type CursorMovementProp = {
  current: number;
  prev: number;
  dir: CursorDirection;
};

type CursorMovement = {
  x: CursorMovementProp;
  y: CursorMovementProp;
};

interface EventWatcher {
  on: () => void;
  off: () => void;
}

interface CursorWatcher extends EventWatcher {
  getState: () => CursorMovement;
  addListener: (callback: (prop: CursorMovement) => void) => void;
  removeListener: (callback: (prop: CursorMovement) => void) => void;
}

interface OuterListenerInitializer {
  init: () => void;
  denit: () => void;
}
