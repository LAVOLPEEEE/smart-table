import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  Object.keys(indexes).forEach((elementName) => {
    elements[elementName].append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      }),
    );
  });

  return (data, state, action) => {
    if (action && action.name === "clear") {
      const input = action.parentElement.querySelector("input");
      input.value = "";
      state[action.dataset.field] = "";
    }

    const filterState = { ...state };

    const totalFrom = filterState.totalFrom;
    const totalTo = filterState.totalTo;

    delete filterState.totalFrom;
    delete filterState.totalTo;

    filterState.total = [
      totalFrom === "" || totalFrom === undefined ? null : Number(totalFrom),
      totalTo === "" || totalTo === undefined ? null : Number(totalTo),
    ];

    return data.filter((row) => compare(row, filterState));
  };
}
