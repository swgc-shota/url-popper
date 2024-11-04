import { State } from 'vanjs-core';

const updatePopperTexts = (
  popperTexts: State<PopperTexts>,
  source: PopSource,
  timerId: NodeJS.Timeout
): void => {
  let newTexts = null as null | PopperTexts;
  if (source instanceof Document) {
    newTexts = getPageUrlAndTitle(source);
  } else if (source instanceof HTMLAnchorElement) {
    newTexts = extractHrefAndText(source);
  } else if (source instanceof HTMLImageElement) {
    newTexts = extractSrcAndAlt(source);
  } else {
    throw new Error('Invalid source type');
  }

  if (
    newTexts.text === popperTexts.val.text &&
    newTexts.url === popperTexts.val.url
  ) {
    clearTimeout(timerId);
    return;
  }

  popperTexts.val = { ...(newTexts as PopperTexts) };
};
const isEmpty = (target: string) => /^\s*$/.test(target);
const getPageUrlAndTitle = (doc: Document): PopperTexts => {
  const titleElement =
    doc.querySelector('title') ||
    doc.querySelector('h1') ||
    doc.querySelector('h2');

  const isTitleExist =
    titleElement &&
    titleElement.textContent &&
    !isEmpty(titleElement.textContent);
  const text = isTitleExist ? titleElement.textContent : 'No title';

  return {
    text: text as string,
    url: window.location.href,
  };
};

const extractHrefAndText = (dom: HTMLAnchorElement): PopperTexts => {
  const isTextExist = dom.textContent && !isEmpty(dom.textContent);
  const text = (isTextExist ? dom.textContent : 'No text content') as string;

  const isUrlExist = dom.href && !isEmpty(dom.href);
  const url = isUrlExist ? dom.href : 'No href attribute';
  return {
    text: text as string,
    url,
  };
};

const extractSrcAndAlt = (dom: HTMLImageElement): PopperTexts => {
  const isAltExist = dom.alt && !isEmpty(dom.alt);
  const text = isAltExist ? dom.alt : 'No alt attribute';

  const isUrlExist = dom.src && !isEmpty(dom.src);
  const url = isUrlExist ? dom.src : 'No src attribute';

  return {
    text,
    url,
  };
};

export { updatePopperTexts };
