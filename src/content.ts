const filterName = "date-select-menu";
const filterValues = ["merged", "closed"];

const node = document.querySelector("#author-select-menu");

const input: HTMLInputElement = document.querySelector("#js-issues-search");
const form = input.parentNode as HTMLFormElement;

function createSummary(): Element {
  const summary = document.createElement("summary");
  summary.setAttribute("class", "btn-link");
  const caret = document.createElement("span");
  caret.setAttribute("class", "dropdown-caret hide-sm");
  summary.append(document.createTextNode(" Date "), caret);
  return summary;
}

function createInput(
  id: string,
  label: string,
  value: string | undefined,
): HTMLElement {
  const container = document.createElement("div");
  const input = document.createElement("input");
  input.setAttribute("class", "SelectMenu-input form-control");
  input.type = "text";
  input.id = id;
  if (value) {
    input.value = value;
  }
  container.append(document.createTextNode(label), input);
  return container;
}

function createItem(id: string, label: string): HTMLElement {
  const item = document.createElement("a");
  item.setAttribute("class", "SelectMenu-item");
  const icon = node.querySelector(".SelectMenu-icon").cloneNode(true);
  item.append(icon, label);
  item.id = id;
  return item;
}

function createModal(): Element {
  const current = input.value;
  let defaultStart = "",
    defaultEnd = "",
    defaultValues: boolean[] = [];
  const matches = current.match(
    RegExp(`(${filterValues.join("|")}):([\\w.]+)`),
  );
  if (matches?.length > 0) {
    const values = matches.pop().split("..");
    defaultStart = values[0];
    defaultEnd = values[1];
    const key = matches.pop();
    filterValues.forEach((e) => {
      defaultValues.push(key == e);
    });
  }

  const modal = document.createElement("div");
  modal.setAttribute("class", "SelectMenu-modal");

  const header = node
    .querySelector(".SelectMenu-header")
    .cloneNode(true) as Element;
  header.querySelector(".SelectMenu-title").innerHTML = "Filter by";
  header.querySelector(".SelectMenu-closeButton").id =
    "GitHubFilter-closeButton";

  const list = document.createElement("div");
  list.setAttribute("class", "SelectMenu-list");
  filterValues.forEach((e, i) => {
    const item = createItem(`GitHubFilter-${e}`, e);
    item.ariaChecked = String(defaultValues[i]);
    list.appendChild(item);
  });

  const divider = document.createElement("div");
  divider.append(document.createTextNode("Date (YYYY-MM-DD)"));
  divider.setAttribute("class", "SelectMenu-divider");

  const filter = document.createElement("div");
  filter.setAttribute("class", "SelectMenu-filter");
  const startInput = createInput(
    "GitHubFilter-startDate",
    "Start: ",
    defaultStart,
  );
  startInput.style.setProperty("margin-bottom", "8px");
  const endInput = createInput("GitHubFilter-endDate", "End: ", defaultEnd);

  filter.append(startInput, endInput);

  modal.append(header, list, divider, filter);

  return modal;
}

function updateFilter(key: string, value: string): boolean {
  const current = input.value;
  const next = value.length > 0 ? `${key}:${value}` : "";
  if (current.indexOf(`${key}:`) >= 0) {
    input.value = current.replace(RegExp(`${key}:[\\w\.]+`), next);
    return true;
  }
  if (next) {
    input.value += current.endsWith(" ") ? next : ` ${next}`;
    return true;
  }
  return false;
}

function onChanged(start: string, end: string, index: number) {
  const key = filterValues[index];
  if (!key) {
    return;
  }
  let value: string;
  if (start.length <= 0 && end.length <= 0) {
    value = "";
  } else if (start.length <= 0) {
    value = end;
  } else if (end.length <= 0) {
    value = start;
  } else {
    value = `${start}..${end}`;
  }
  if (updateFilter(key, value)) {
    form.submit();
  }
}

function observe() {
  const startDate: HTMLInputElement = document.querySelector(
    "#GitHubFilter-startDate",
  );
  const endDate: HTMLInputElement = document.querySelector(
    "#GitHubFilter-endDate",
  );
  const elements = filterValues.map((e) =>
    document.querySelector(`#GitHubFilter-${e}`),
  );
  elements.forEach((el) => {
    el.addEventListener("click", (_) => {
      const checked = el.ariaChecked;
      if (checked === "true") {
        el.ariaChecked = "false";
        onChanged(startDate.value, endDate.value, -1);
        return;
      }
      let idx = 0;
      elements.forEach((e, i) => {
        e.ariaChecked = String(e.id === el.id);
        idx = i;
      });
      onChanged(startDate.value, endDate.value, idx);
    });
  });
  startDate.addEventListener("change", (_) => {
    onChanged(
      startDate.value,
      endDate.value,
      elements.findIndex((e) => e.ariaChecked === "true"),
    );
  });
  endDate.addEventListener("change", (_) => {
    onChanged(
      startDate.value,
      endDate.value,
      elements.findIndex((e) => e.ariaChecked === "true"),
    );
  });
}

const container = node.parentNode;
const filter = node.cloneNode() as Element;

const summary = createSummary();
const details = document.createElement("details-menu");
details.setAttribute("class", "SelectMenu SelectMenu--hasFilter right-0");
const modal = createModal();
details.appendChild(modal);

filter.id = filterName;
filter.append(summary, details);

container.appendChild(filter);
container
  .querySelector("#GitHubFilter-closeButton")
  .setAttribute("data-toggle-for", filterName);

observe();
