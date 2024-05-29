const createCursorWatcher = (): CursorWatcher => {
  const cursorMov: CursorMovement = {
    x: { current: -1, prev: -1, dir: "" },
    y: { current: -1, prev: -1, dir: "" },
  };
  const listeners: ((prop: CursorMovement) => void)[] = [];

  const saveCursorMovement = (e: MouseEvent) => {
    if (cursorMov.x.current !== e.clientX) {
      cursorMov.x.prev = cursorMov.x.current;
      cursorMov.x.current = e.clientX;
      cursorMov.x.dir =
        cursorMov.x.current - cursorMov.x.prev > 0 ? "toRight" : "toLeft";
    }

    if (cursorMov.y.current !== e.clientY) {
      cursorMov.y.prev = cursorMov.y.current;
      cursorMov.y.current = e.clientY;
      cursorMov.y.dir =
        cursorMov.y.current - cursorMov.y.prev > 0 ? "toBottom" : "toTop";
    }

    listeners.forEach((listener) => listener(cursorMov));
  };

  const on = () => {
    document.addEventListener("mousemove", saveCursorMovement);
  };

  const off = () => {
    document.removeEventListener("mousemove", saveCursorMovement);
  };

  const getState = (): CursorMovement => {
    return {
      x: { ...cursorMov.x },
      y: { ...cursorMov.y },
    };
  };

  const addListener = (callback: (prop: CursorMovement) => void) => {
    listeners.push(callback);
  };

  const removeListener = (callback: (prop: CursorMovement) => void) => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };

  return {
    on,
    off,
    addListener,
    removeListener,
    getState,
  };
};

const cursorWatcher = createCursorWatcher();
export { cursorWatcher, createCursorWatcher };
