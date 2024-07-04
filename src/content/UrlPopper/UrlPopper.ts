import van from "vanjs-core";
import { prepareContainer } from "../utils/customElementsPolyfill";
import { Content } from "./Content";
import { CopyModeToggler } from "./CopyModeToggler";
import { fetchFromStorage } from "../utils/utils";
import { STOR_KEY, COPY_MODE } from "../../utils/constant";

const { div } = van.tags;

const UrlPopper = (_copyBoth: boolean) => {
  const copyBoth = van.state(_copyBoth);

  return div(
    {
      "data-component-name": "url-popper",
      class:
        "fixed flex flex-row w-[320px] justify-between items-center z-max  transition-all duration-300 scale-0",
    },
    Content(copyBoth),
    CopyModeToggler(copyBoth)
  );
};

const initUrlPopper = async () => {
  const container = prepareContainer("url-popper");
  const currentMode: CopyMode = await fetchFromStorage(STOR_KEY.COPY_MODE);
  container.addElement(UrlPopper(currentMode === COPY_MODE.BOTH));
};

const deinitUrlPopper = () => {
  const container = document.querySelector("url-popper");
  if (container == null) {
    console.warn("UrlPopper doesn't exist.");
  }
  container?.remove();
};
export { initUrlPopper, deinitUrlPopper };
