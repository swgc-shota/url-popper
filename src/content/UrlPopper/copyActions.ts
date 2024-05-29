import { State } from "vanjs-core";
import { selectComponent } from "../utils/utils";

const copyAndAnimate = (
  e: MouseEvent,
  copyBoth: State<boolean>,
  BTN_TYPE: BtnType,
  PopperTexts: State<PopperTexts>
) => {
  copyPopperTexts(copyBoth, BTN_TYPE, PopperTexts);
  bouncePopperTexts(copyBoth, e.target as HTMLElement);
};

const bouncePopperTexts = (copyBoth: State<boolean>, target: HTMLElement) => {
  if (copyBoth.val) {
    const buttonsContainer = selectComponent("copy-buttons-container");
    bounceOnce(buttonsContainer);
  } else {
    bounceOnce(target);
  }
};

const bounceOnce = (target: Element) => {
  target.classList.add("animate-text-bounce");
  setTimeout(() => {
    target.classList.remove("animate-text-bounce");
  }, 400);
};

const copyPopperTexts = (
  copyBoth: State<boolean>,
  buttonType: BtnType,
  PopperTexts: State<PopperTexts>
) => {
  if (copyBoth.val) {
    copyText(PopperTexts.val.text + "\n" + PopperTexts.val.url);
  } else {
    copyText(PopperTexts.val[buttonType]);
  }
};

const copyText = async (text: string) => {
  if (!navigator.clipboard) {
    console.warn("Clipboard API not supported");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.warn("Failed to copy text: ", err);
  }
};
export { copyAndAnimate, copyPopperTexts };
