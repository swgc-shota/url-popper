import { STOR_KEY, APP_STATUS, COPY_MODE, MSG_TYPE } from "./utils";

const loadApp = async () => {
  chrome.runtime.onInstalled.addListener(reloadAllTabs);
  chrome.runtime.onStartup.addListener(reloadAllTabs);
  /**
   * When the extension is installed, all tabs are reloaded.
   * However, When the extension is toggled on or off, tabs are not automatically reloaded.
   * Therefore, initApp() and reloadAllTabs() are explicitly called here.
   */
  await initApp();
  reloadAllTabs();
};

const reloadAllTabs = async () => {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    // Filter out non-HTTP content such as chrome://, file://, etc.
    const isHttpOrHttps =
      tab.url &&
      (tab.url.startsWith("http://") || tab.url.startsWith("https://"));
    if (tab.id && isHttpOrHttps) {
      chrome.tabs.reload(tab.id);
    }
  }
};

const initApp = async () => {
  await initStorage();
  await initBadge();
};

const initStorage = async (): Promise<void> => {
  const currentStatus = await getAppStatus();
  if (currentStatus === undefined) {
    await chrome.storage.local.set({
      [STOR_KEY.APP_STATUS]: APP_STATUS.ON,
    });
    await chrome.storage.local.set({
      [STOR_KEY.COPY_MODE]: COPY_MODE.BOTH,
    });
  }
};

const getAppStatus = async (): Promise<AppStatus> => {
  const { APP_STATUS } = await chrome.storage.local.get(STOR_KEY.APP_STATUS);
  return APP_STATUS;
};

const initBadge = async (): Promise<void> => {
  const appStatus = await getAppStatus();
  updateBadge(appStatus);
};

const updateBadge = (newStatus: AppStatus) => {
  const isNewStatusOff = newStatus === APP_STATUS.OFF;
  const iconName = isNewStatusOff ? "icon16_off.png" : "icon16_on.png";
  chrome.action.setIcon({ path: `images/${iconName}` });
};

const initListeners = (): void => {
  chrome.action.onClicked.addListener(clickListener);
  chrome.runtime.onMessage.addListener(messageListener);
};

const clickListener = async (): Promise<void> => {
  const currentStatus: AppStatus = await getAppStatus();
  const isOn = currentStatus === APP_STATUS.ON;
  const newStatus = isOn ? APP_STATUS.OFF : APP_STATUS.ON;
  const message: Message = {
    type: MSG_TYPE.TOGGLE_APP,
    newStatus: newStatus,
  };
  toggleApp(message);
};

const messageListener = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  const _tabId = sender.tab?.id;
  const exceptTabIds = _tabId === undefined ? [] : [_tabId];

  switch (message.type) {
    case MSG_TYPE.TOGGLE_APP:
      toggleApp(message, exceptTabIds);
      break;
    case MSG_TYPE.TOGGLE_COPYMODE:
      toggleCopyMode(message, exceptTabIds);
      break;

    default:
      sendResponse({ type: MSG_TYPE.UNKNOWN });
  }

  sendResponse({ type: MSG_TYPE.SUCCESS });
};

const toggleApp = async (message: Message, exceptTabIds: number[] = []) => {
  await sendMessageToAllTabs(message, exceptTabIds);
  await chrome.storage.local.set({
    [STOR_KEY.APP_STATUS]: message.newStatus,
  });
  updateBadge(message.newStatus as AppStatus);
};

const toggleCopyMode = async (
  message: Message,
  exceptTabIds: number[] = []
) => {
  await sendMessageToAllTabs(message, exceptTabIds);
  await chrome.storage.local.set({
    [STOR_KEY.COPY_MODE]: message.newCopyMode,
  });
};

const sendMessageToAllTabs = async (
  message: Message,
  exceptTabIds: number[] = []
): Promise<void> => {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || !tab.url) {
      continue;
    }
    if (exceptTabIds.includes(tab.id)) {
      continue;
    }
    sendMessageToValidTab(tab.id, tab.url, message);
  }
};

const sendMessageToValidTab = async (
  tabId: number,
  url: string,
  message: Message
) => {
  // Filter out non-HTTP content such as chrome://, file://, etc.
  const isHttpOrHttps = url.startsWith("http://") || url.startsWith("https://");
  if (!isHttpOrHttps) {
    return;
  }

  try {
    const messageResponse = await chrome.tabs.sendMessage(tabId, message);
    if (messageResponse === MSG_TYPE.FAILED) {
      console.warn("Message was received correctly, but processing failed.");
    }
  } catch (error) {
    console.warn(
      `Could not send a message to tab ${url} at ${new Date().toISOString()}:`,
      error
    );
  }
};

self.addEventListener("install", async () => loadApp());

/**
 * Since manifest v3,
 * background.js has become a service worker and is disabled when not in use.
 * To deal with this, run only initListener() here.
 */

initListeners();

export {};
