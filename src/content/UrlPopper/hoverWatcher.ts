import { showPopper } from './boundaryWatcher';
import { State } from 'vanjs-core';
import { selectComponent } from '../utils/utils';

const createHoverWatcher = (popperTexts: State<PopperTexts>) => {
  let prevPopTarget: PopSource | null = null;

  const handleMouseover = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (!target) return;

    const popTarget = findPopTarget(target);
    if (!popTarget || popTarget === prevPopTarget) return;

    updatePopper(popTarget);
    prevPopTarget = popTarget;
  };
  const findPopTarget = (element: Element): PopSource | null => {
    const anchor = element.closest('a');
    if (anchor) return anchor;

    const imgOrHeading = element.closest(
      'h1, h2, h3, h4, h5, h6, img'
    ) as PopSource | null;
    if (!imgOrHeading) return null;

    if (
      imgOrHeading instanceof HTMLHeadingElement &&
      !isValidHeading(imgOrHeading)
    ) {
      return null;
    }

    return imgOrHeading;
  };

  const isValidHeading = (element: HTMLHeadingElement) => {
    return element.id !== '' || element.parentElement!.id !== '';
  };

  const updatePopper = (target: PopSource) => {
    selectComponent('url-popper').classList.remove('mono');
    showPopper(popperTexts, target);
  };

  const on = () => {
    document.addEventListener('mouseover', handleMouseover);
  };

  const off = () => {
    document.removeEventListener('mouseover', handleMouseover);
  };
  return {
    on,
    off,
  };
};

export { createHoverWatcher };
