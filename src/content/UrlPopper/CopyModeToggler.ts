import van, { State } from "vanjs-core";
import { sendMessageToBackground } from "../utils/utils";
import { MY_EVT, MSG_TYPE, COPY_MODE } from "../../utils/constant";

const { svg, g, path } = van.tags("http://www.w3.org/2000/svg");
const { div, button } = van.tags;

const createOuterListenerInitializer = (copyBoth: State<boolean>) => {
  const init = () => {
    const toggleCopyMode = () => (copyBoth.val = copyBoth.val ? false : true);
    document.addEventListener(MY_EVT.TOGGLE_COPYMODE, toggleCopyMode);
    document.addEventListener(MY_EVT.TOGGLE_APP, denit);
  };

  const denit = () => {
    document.removeEventListener(MY_EVT.TOGGLE_COPYMODE, init);
    document.removeEventListener(MY_EVT.TOGGLE_APP, denit);
  };
  return {
    init,
    denit,
  };
};

const CopyModeToggler = (copyBoth: State<boolean>) => {
  const outerListners = createOuterListenerInitializer(copyBoth);
  outerListners.init();
  return div(
    {
      "data-component-name": "copy-mode-toggler",
      class: "hover:opacity-90",
    },
    button(
      {
        class: () => `size-[16px] ${copyBoth.val ? "block" : "hidden"}`,
        onclick: async () => {
          copyBoth.val = false;
          await sendMessageToBackground({
            type: MSG_TYPE.TOGGLE_COPYMODE,
            newCopyMode: COPY_MODE.SINGLE,
          });
        },
      },
      svg(
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "100%",
          height: "100%",
          viewBox: "0 0 80 84.99",
        },
        g(
          { fill: "#ffa600" },
          path({
            d: "M68 79.99H12c-3.86 0-7-3.14-7-7v-26c0-1.862.723-3.615 2.035-4.935a6.954 6.954 0 0 1 4.918-2.066l4.966-.032v.032h46.16v-.032l4.968.032a6.954 6.954 0 0 1 4.918 2.066A6.957 6.957 0 0 1 75 46.99v26c0 3.86-3.14 7-7 7Zm-4.92-47.907c-.01-3.54-.578-6.98-1.691-10.229-1.1-3.213-2.688-6.116-4.719-8.624-2.088-2.579-4.542-4.617-7.295-6.06 2.534 1.234 4.826 2.945 6.817 5.088a25.377 25.377 0 0 1 5.027 8.036 27.07 27.07 0 0 1 1.86 9.94v1.849Zm-46.16-.199v-1.65c0-3.452.627-6.797 1.861-9.94a25.376 25.376 0 0 1 5.027-8.036c1.987-2.138 4.27-3.844 6.795-5.077-2.743 1.441-5.19 3.475-7.273 6.048-2.031 2.51-3.62 5.411-4.72 8.627a31.692 31.692 0 0 0-1.69 10.028Z",
          }),
          path({
            d: "M68 74.99c1.103 0 2-.898 2-2v-26c0-1.096-.89-1.994-1.985-2h-56.03a2.004 2.004 0 0 0-1.985 2v26c0 1.102.897 2 2 2h56m0 10H12c-6.627 0-12-5.373-12-12v-26c0-6.602 5.33-11.958 11.921-12v-4.756c0-4.081.742-8.04 2.206-11.768 1.414-3.6 3.438-6.833 6.018-9.61 2.578-2.776 5.582-4.956 8.926-6.48A26.2 26.2 0 0 1 40 0c3.788 0 7.466.799 10.93 2.376 3.343 1.524 6.347 3.704 8.924 6.48 2.58 2.777 4.604 6.01 6.018 9.61a32.047 32.047 0 0 1 2.207 11.768v4.755c6.59.043 11.92 5.4 11.92 12v26c0 6.628-5.373 12-12 12ZM40 9.835c-2.44 0-4.807.59-7.038 1.755-2.152 1.124-4.085 2.735-5.747 4.786-1.66 2.05-2.964 4.439-3.874 7.1-.944 2.752-1.421 5.677-1.421 8.692v2.821h36.16v-2.821c0-3.015-.478-5.94-1.421-8.693-.91-2.658-2.213-5.047-3.875-7.099-1.661-2.052-3.595-3.662-5.746-4.786-2.231-1.165-4.6-1.755-7.038-1.755Z",
          })
        )
      )
    ),
    button(
      {
        class: () => `size-[16px] ${copyBoth.val ? "hidden" : "block"}`,
        onclick: async () => {
          copyBoth.val = true;
          await sendMessageToBackground({
            type: MSG_TYPE.TOGGLE_COPYMODE,
            newCopyMode: COPY_MODE.BOTH,
          });
        },
      },
      svg(
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "100%",
          height: "100%",
          viewBox: "0 0 80 87.99",
        },
        g(
          { fill: "#707070" },
          path({
            d: "M68 82.99H12a6.953 6.953 0 0 1-4.95-2.05A6.955 6.955 0 0 1 5 75.99v-26c0-1.862.723-3.614 2.035-4.935a6.955 6.955 0 0 1 4.919-2.065l4.966-.032v.032h24.072V43H68.38a6.961 6.961 0 0 1 4.664 2.137A6.964 6.964 0 0 1 75 49.99v26c0 1.87-.728 3.628-2.05 4.95A6.955 6.955 0 0 1 68 82.99ZM16.92 31.885v-1.651c0-3.452.627-6.797 1.861-9.94a25.377 25.377 0 0 1 5.027-8.035c1.984-2.136 4.266-3.841 6.79-5.075-2.74 1.44-5.185 3.474-7.268 6.045-2.03 2.507-3.618 5.41-4.72 8.627a31.701 31.701 0 0 0-1.69 10.03ZM52.474 9h-.188a22.103 22.103 0 0 0-2.91-1.83A22.473 22.473 0 0 1 52.473 9Z",
          }),

          path({
            d: "M68 77.99c.55 0 1.025-.197 1.414-.586.389-.389.586-.865.586-1.414v-26c0-.535-.188-1.001-.558-1.386-.37-.385-.826-.591-.95-.604l-56.526-.01a1.933 1.933 0 0 0-1.384.59A1.935 1.935 0 0 0 10 49.99v26c0 .55.197 1.026.586 1.415.388.388.864.585 1.414.585h56m0 10H12a11.92 11.92 0 0 1-8.486-3.515A11.923 11.923 0 0 1 0 75.99v-26c0-3.192 1.24-6.196 3.49-8.46a11.924 11.924 0 0 1 8.431-3.54v-7.755c0-4.081.742-8.04 2.206-11.769 1.414-3.6 3.439-6.833 6.018-9.61 2.577-2.775 5.58-4.955 8.926-6.48A26.196 26.196 0 0 1 40 0c3.79 0 7.466.8 10.93 2.376 3.345 1.525 6.348 3.705 8.924 6.48A30.129 30.129 0 0 1 63.695 14H50.519a17.467 17.467 0 0 0-3.481-2.41c-4.463-2.33-9.617-2.328-14.076 0-2.151 1.124-4.084 2.734-5.747 4.786-1.66 2.05-2.963 4.438-3.874 7.1-.943 2.752-1.422 5.677-1.422 8.692v5.822H46V38h22.497a11.94 11.94 0 0 1 8.151 3.67A11.941 11.941 0 0 1 80 49.99v26c0 3.205-1.248 6.219-3.515 8.485A11.922 11.922 0 0 1 68 87.99Z",
          })
        )
      )
    )
  );
};
export { CopyModeToggler };
