import { showPopper } from './boundaryWatcher';
import { State } from 'vanjs-core';
import { selectComponent } from '../utils/utils';

const createHoverWatcher = (popperTexts: State<PopperTexts>) => {
  let prevHoverElement = null as null | Element;
  const listener = (e: MouseEvent) => {
    if (e.target == null || prevHoverElement == e.target) {
      return;
    }
    prevHoverElement = e.target as Element;

    const currentHoverElement = e.target as Element;
    const target = currentHoverElement.closest(
      'a, h1, h2, h3, h4, h5 ,h6,img'
    ) as PopSource | null;
    if (
      target === null ||
      (target instanceof HTMLHeadingElement &&
        target.id === '' &&
        target.parentElement!.id === '')
    ) {
      return;
    }

    selectComponent('url-popper').classList.remove('mono');
    showPopper(popperTexts, target);
  };

  const on = () => {
    document.addEventListener('mouseover', listener);
  };

  const off = () => {
    document.removeEventListener('mouseover', listener);
  };
  return {
    on,
    off,
  };
};

export { createHoverWatcher };
