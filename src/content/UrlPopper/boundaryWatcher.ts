import van, { State } from 'vanjs-core';
import { createCallbackTimer, selectComponent } from '../utils/utils';
import { cursorWatcher } from '../cursorWatcher/cursorWatcher';

import { getOptimalPosition } from '../utils/utils';
import { updatePopperTexts } from './getPopperTexts';

const createBoundaryWatcher = (popperTexts: State<PopperTexts>) => {
  van.derive(() => {
    const { top, right, left, bottom } = positionalState.val;
    const isFirstTime = !top && !right && !bottom && !left;
    if (isFirstTime) {
      return;
    }

    const container = selectComponent('url-popper') as HTMLElement;
    if (!container) {
      console.warn("The container doesn't exist.");
      return;
    }
    container.style.top = top;
    container.style.left = left;
    container.style.bottom = bottom;
    container.style.right = right;
  });

  const boundaryToTopListener = (cursorMov: CursorMovement) => {
    const BOUNDARY_Y = 25;
    const nowCrossed = cursorMov.y.current < BOUNDARY_Y;
    const lastNotCrossed = cursorMov.y.prev >= BOUNDARY_Y;
    if (nowCrossed && lastNotCrossed) {
      selectComponent('url-popper').classList.add('mono');
      showPopper(popperTexts, document);
    }
  };

  const on = () => {
    cursorWatcher.addListener(boundaryToTopListener);
    cursorWatcher.on();
  };
  const off = () => {
    cursorWatcher.removeListener(boundaryToTopListener);
    cursorWatcher.off();
  };

  return {
    on,
    off,
  };
};

const positionalState = van.state({
  top: '',
  right: '',
  left: '',
  bottom: '',
}) as State<PositionalProps>;

const _hidePopper = () => {
  const container = selectComponent('url-popper') as HTMLElement;
  container.classList.remove('scale-100');
  container.classList.remove('animate-bounce-once');
};
const hideTimer = createCallbackTimer(_hidePopper);

const visiblePopper = () => {
  const container = selectComponent('url-popper') as HTMLElement;
  container.classList.add('scale-100');
  container.classList.add('animate-bounce-once');
};

const updatePositionalState = () => {
  const container = selectComponent('url-popper') as HTMLElement;
  const positionalProps = getOptimalPosition(container);
  positionalState.val = {
    ...positionalProps,
  };
};

const showPopper = (popperTexts: State<PopperTexts>, source: PopSource) => {
  /**
   * If updating the position in real time,
   * it is sometimes difficult to keep up with the cursor movement,
   * so it is delayed a little.
   */
  const timerId: NodeJS.Timeout = setTimeout(() => {
    updatePositionalState();
  }, 100);
  updatePopperTexts(popperTexts, source, timerId);
  visiblePopper();
  hideTimer.set(2000);
};

export { createBoundaryWatcher, hideTimer, showPopper };
