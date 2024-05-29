import van, { State } from "vanjs-core";
import { copyAndAnimate } from "./copyActions";
import { createBoundaryWatcher, hideTimer } from "./boundaryWatcher";
import { createHoverWatcher } from "./hoverWatcher";
import { MY_EVT, BTN_TYPE } from "../utils/constant";

const { div, button } = van.tags;

const createOuterListenerInitializer = (
  boundaryWatcher: EventWatcher,
  hoverWatcher: EventWatcher
) => {
  const init = () => {
    setTimeout(() => {
      boundaryWatcher.on();
      hoverWatcher.on();
    });
    document.addEventListener(MY_EVT.TOGGLE_APP, deinit);
  };

  const deinit = () => {
    boundaryWatcher.off();
    hoverWatcher.off();
    document.removeEventListener(MY_EVT.TOGGLE_APP, deinit);
    /**
     * Apart from this listener,
     * there is an event to delete the DOM,
     * so the timer is cleared here.
     */
    hideTimer.clear();
  };
  return {
    init,
    deinit,
  };
};

const Content = (copyBoth: State<boolean>) => {
  const popperTexts = van.state({
    text: "",
    url: "",
  }) as State<PopperTexts>;
  const boundaryWatcher = createBoundaryWatcher(popperTexts);
  const hoverWatcher = createHoverWatcher(popperTexts);
  const outerListeners = createOuterListenerInitializer(
    boundaryWatcher,
    hoverWatcher
  );
  outerListeners.init();

  return div(
    {
      "data-component-name": "url-popper-inner",
      class: () =>
        `w-[300px] shadow bg-white text-stone-900 mono:bg-stone-700 mono:text-stone-200 mono:hover:bg-stone-600 mono:hover:text-stone-100 border border-stone-300 rounded-[6px] text-[14px] leading-[16px] ${
          copyBoth.val ? "hover:animate-border-blink hover:bg-stone-50" : ""
        }`,
      onmouseenter: () => {
        boundaryWatcher.off();
        hideTimer.clear();
      },
      onmouseleave: () => {
        boundaryWatcher.on();
        hideTimer.set(1000);
      },
    },
    div(
      {
        "data-component-name": "copy-buttons-container",
      },
      div(
        {
          class: () =>
            `rounded-t-[6px] ${
              copyBoth.val ? "" : "hover:animate-border-blink"
            }`,
        },
        button(
          {
            "data-component-name": "copy-button",
            class: () =>
              `w-full block p-[8px] pb-[4px] max-h-[6em] overflow-y-scroll break-words text-left scrollbar-invisible rounded-t-[6px]  font-bold`,
            onclick: (e: MouseEvent) =>
              copyAndAnimate(e, copyBoth, BTN_TYPE.TEXT, popperTexts),
          },
          () => popperTexts.val.text
        )
      ),
      div(
        {
          class: () =>
            `rounded-b-[6px] ${
              copyBoth.val ? "" : "hover:animate-border-blink"
            }`,
        },
        button(
          {
            "data-component-name": "copy-button",
            class: () =>
              `w-full block p-[8px] pt-[4px] max-h-[6em] overflow-y-scroll break-words text-left scrollbar-invisible rounded-b-[6px]`,
            onclick: (e: MouseEvent) =>
              copyAndAnimate(e, copyBoth, BTN_TYPE.URL, popperTexts),
          },
          () => popperTexts.val.url
        )
      )
    )
  );
};
export { Content };
