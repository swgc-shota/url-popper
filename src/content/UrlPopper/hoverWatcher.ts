import { showPopper } from './boundaryWatcher';
import { State } from 'vanjs-core';
import { selectComponent } from '../utils/utils';

const createHoverWatcher = (popperTexts: State<PopperTexts>) => {
  const listener = (e: MouseEvent) => {
    if (e.target == null) {
      return;
    }

    const currentHoverElement = e.target as Element;
    const anchorOrNull = currentHoverElement.closest('a');
    const isImage = currentHoverElement instanceof HTMLImageElement;
    if (!anchorOrNull && !isImage) {
      return;
    }

    selectComponent('url-popper').classList.remove('mono');
    const currentTarget = anchorOrNull
      ? (anchorOrNull as HTMLAnchorElement)
      : (currentHoverElement as HTMLImageElement);
    showPopper(popperTexts, currentTarget);
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
