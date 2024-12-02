/**
 * The Rollup feature mentioned below,
 * I placed the same utils.ts in both the background and content directories.
 *
 * > Notice how both entry points import the same shared chunk. Rollup will
 * never duplicate code and instead create additional chunks to only ever load
 * the bare minimum necessary.
 * Tutorial | Rollup | https://rollupjs.org/tutorial/
 */
import type { Message } from '../../utils/constant';
import { cursorWatcher } from '../cursorWatcher/cursorWatcher';

let timerId: NodeJS.Timeout | undefined = undefined;
export const createCallbackTimer = (callback: () => void) => {
  const set = (ms: number) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(callback, ms);
  };
  const clear = () => clearTimeout(timerId);

  return {
    set,
    clear,
  };
};

export const getDate = (): string => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const selectComponent = (compName: string) =>
  document
    .querySelector('url-popper')
    ?.shadowRoot?.querySelector(
      `[data-component-name="${compName}"]`
    ) as HTMLElement;

export const selectComponentAll = (compName: string) =>
  document
    .querySelector('url-popper')
    ?.shadowRoot?.querySelectorAll(
      `[data-component-name="${compName}"]`
    ) as NodeList;

export const selectInShadowRoot = (selector: string) =>
  document.querySelector('url-popper')?.shadowRoot?.querySelector(selector);

export const selectAllInShadowRoot = (selector: string) =>
  document.querySelector('url-popper')?.shadowRoot?.querySelectorAll(selector);

export const getOptimalPosition = (targetDom: HTMLElement): PositionalProps => {
  const cursorMov: CursorMovement = cursorWatcher.getState();
  const _rect = targetDom.getBoundingClientRect();
  const popperWidth = _rect.width === 0 ? 300 : _rect.width;
  const popperHeight = _rect.height === 0 ? 75 : _rect.height;
  const leftWidth = cursorMov.x.current;
  const rightWidth = window.innerWidth - cursorMov.x.current;
  const topHeight = cursorMov.y.current;
  const bottomHeight = window.innerHeight - cursorMov.y.current;

  const optimalPosition: PositionalProps = {
    top: '',
    left: '',
    bottom: '',
    right: '',
  };

  if (cursorMov.x.dir === 'toRight') {
    if (leftWidth >= popperWidth) {
      optimalPosition.right = `${rightWidth - 36}px`;
    } else {
      optimalPosition.left = `${leftWidth}px`;
    }
  } else if (cursorMov.x.dir === 'toLeft') {
    if (rightWidth >= popperWidth) {
      optimalPosition.left = `${leftWidth}px`;
    } else {
      optimalPosition.right = `${rightWidth}px`;
    }
  }

  if (cursorMov.y.dir === 'toTop') {
    if (bottomHeight >= popperHeight) {
      optimalPosition.top = `${topHeight}px`;
    } else {
      optimalPosition.bottom = `${bottomHeight}px`;
    }
  } else if (cursorMov.y.dir === 'toBottom') {
    if (topHeight >= popperHeight) {
      optimalPosition.bottom = `${bottomHeight}px`;
    } else {
      optimalPosition.top = `${topHeight}px`;
    }
  }

  return optimalPosition;
};

export const fireCustomEvent = (
  customEventName: string,
  detail: any = {},
  element: Element | Document = document
) => {
  const event = new CustomEvent(customEventName, {
    detail: detail,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
};

export const sendMessageToBackground = async (message: Message) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
};

export const fetchFromStorage = async (key: StorKey) => {
  const _temp = await chrome.storage.local.get(key);
  return _temp[key];
};
