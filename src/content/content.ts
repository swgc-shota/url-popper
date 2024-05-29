import { initUrlPopper, deinitUrlPopper } from "./UrlPopper/UrlPopper";
import { fireCustomEvent, fetchFromStorage } from "./utils/utils";
import {
  MY_EVT,
  MSG_TYPE,
  STOR_KEY,
  APP_STATUS,
} from "../content/utils/constant";

const initAppStateToggler = async (): Promise<void> => {
  chrome.runtime.onMessage.addListener(messageListener);
  const currentStatus = await fetchFromStorage(STOR_KEY.APP_STATUS);
  if (currentStatus === APP_STATUS.OFF) {
    return;
  }

  initUrlPopper();
};

const messageListener = (
  message: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): boolean => {
  switch (message.type) {
    case MSG_TYPE.TOGGLE_APP:
      const isOn = message.newStatus === APP_STATUS.ON;
      if (isOn) {
        initUrlPopper();
        break;
      }
      fireCustomEvent(MY_EVT.TOGGLE_APP);
      deinitUrlPopper();
      break;

    case MSG_TYPE.TOGGLE_COPYMODE:
      fireCustomEvent(MY_EVT.TOGGLE_COPYMODE);
      break;
  }

  sendResponse();
  return true;
  /**
   * Reference:
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#sending_an_asynchronous_response_using_sendresponse
   */
};

initAppStateToggler();

export {};
