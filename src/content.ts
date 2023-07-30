const filterName = "date-select-menu";

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

function createInput(id: string, label: string): HTMLElement {
  const container = document.createElement("div");
  const input = document.createElement("input");
  input.setAttribute("class", "SelectMenu-input form-control");
  input.type = "text";
  input.id = id;
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
  const closed = createItem("GitHubFilter-closed", "Closed");
  const merged = createItem("GitHubFilter-merged", "Merged");
  list.append(closed, merged);

  const divider = document.createElement("div");
  divider.append(document.createTextNode("Date (YYYY-MM-DD)"));
  divider.setAttribute("class", "SelectMenu-divider");

  const filter = document.createElement("div");
  filter.setAttribute("class", "SelectMenu-filter");
  const startInput = createInput("GitHubFilter-startDate", "Start: ");
  startInput.style.setProperty("margin-bottom", "8px");
  const endInput = createInput("GitHubFilter-endDate", "End: ");
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

function onChanged(
  start: string,
  end: string,
  closed: boolean,
  merged: boolean,
) {
  let key: string;
  if (closed) {
    key = "closed";
  } else if (merged) {
    key = "merged";
  } else {
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
  const closed = document.querySelector("#GitHubFilter-closed");
  const merged = document.querySelector("#GitHubFilter-merged");
  const startDate: HTMLInputElement = document.querySelector(
    "#GitHubFilter-startDate",
  );
  const endDate: HTMLInputElement = document.querySelector(
    "#GitHubFilter-endDate",
  );
  closed.addEventListener("click", (_) => {
    const checked = closed.ariaChecked;
    if (checked === "true") {
      closed.ariaChecked = "false";
      onChanged(startDate.value, endDate.value, false, false);
      return;
    }
    closed.ariaChecked = "true";
    merged.ariaChecked = "false";
    onChanged(startDate.value, endDate.value, true, false);
  });
  merged.addEventListener("click", (_) => {
    const checked = merged.ariaChecked;
    if (checked === "true") {
      merged.ariaChecked = "false";
      onChanged(startDate.value, endDate.value, false, false);
      return;
    }
    merged.ariaChecked = "true";
    closed.ariaChecked = "false";
    onChanged(startDate.value, endDate.value, false, true);
  });
  startDate.addEventListener("change", (_) => {
    onChanged(
      startDate.value,
      endDate.value,
      closed.ariaChecked === "true",
      merged.ariaChecked === "true",
    );
  });
  endDate.addEventListener("change", (_) => {
    onChanged(
      startDate.value,
      endDate.value,
      closed.ariaChecked === "true",
      merged.ariaChecked === "true",
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
