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

function createModal(): Element {
  const modal = document.createElement("div");
  modal.setAttribute("class", "SelectMenu-modal");

  const header = node
    .querySelector(".SelectMenu-header")
    .cloneNode(true) as Element;
  header.querySelector(".SelectMenu-title").innerHTML = "Filter by";
  header.querySelector(".SelectMenu-closeButton").id =
    "GitHubFilter-closeButton";

  const body = document.createElement("div");
  body.setAttribute("class", "SelectMenu-filter");
  const startInput = createInput(
    "GitHubFilter-startDate",
    "Start date (YYYY-MM-DD): ",
  );
  startInput.style.setProperty("margin-bottom", "16px");
  const endInput = createInput(
    "GitHubFilter-endDate",
    "End date (YYYY-MM-DD): ",
  );
  body.append(startInput, endInput);

  modal.append(header, body);
  return modal;
}

function updateFilter(key: string, value: string) {
  const current = input.value;
  const next = value.length > 0 ? `${key}:${value}` : "";
  if (current.indexOf(`${key}:`) > 0) {
    input.value = current.replace(RegExp(`${key}:[\\w\.]+`), next);
    return;
  }
  input.value += current.endsWith(" ") ? next : ` ${next}`;
}

function onDateChanged(start: string, end: string) {
  let q: string;
  if (start.length <= 0 && end.length <= 0) {
    q = "";
  } else if (start.length <= 0) {
    q = end;
  } else if (end.length <= 0) {
    q = start;
  } else {
    q = `${start}..${end}`;
  }
  updateFilter("opened", q);
  form.submit();
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

const startDate: HTMLInputElement = document.querySelector(
  "#GitHubFilter-startDate",
);
const endDate: HTMLInputElement = document.querySelector(
  "#GitHubFilter-endDate",
);
startDate.addEventListener("change", (e) => {
  const value = (e.target as HTMLInputElement).value;
  onDateChanged(value, endDate.value);
});
endDate.addEventListener("change", (e) => {
  const value = (e.target as HTMLInputElement).value;
  onDateChanged(startDate.value, value);
});
