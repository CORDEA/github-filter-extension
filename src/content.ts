const filterName = 'date-select-menu'

const node = document.querySelector('#author-select-menu')
const container = node.parentNode

const filter = node.cloneNode() as Element

const summary = createSummary()
const details = document.createElement('details-menu')
details.setAttribute('class', 'SelectMenu SelectMenu--hasFilter right-0')
const modal = createModal()
details.appendChild(modal)

filter.id = filterName
filter.append(summary, details)

container.appendChild(filter)
container.querySelector('#GitHubFilter-closeButton').setAttribute('data-toggle-for', filterName)

function createSummary(): Element {
    const summary = document.createElement('summary')
    summary.setAttribute('class', 'btn-link')
    const caret = document.createElement('span')
    caret.setAttribute('class', 'dropdown-caret hide-sm')
    summary.append(document.createTextNode(' Date '), caret)
    return summary
}

function createInput(id: string, label: string): HTMLElement {
    const container = document.createElement('div')
    const input = document.createElement('input')
    input.setAttribute('class', 'SelectMenu-input form-control')
    input.id = id
    container.append(document.createTextNode(label), input)
    return container
}

function createModal(): Element {
    const modal = document.createElement('div')
    modal.setAttribute('class', 'SelectMenu-modal')

    const header = node.querySelector('.SelectMenu-header').cloneNode(true) as Element
    header.querySelector('.SelectMenu-title').innerHTML = 'Filter by'
    header.querySelector('.SelectMenu-closeButton').id = 'GitHubFilter-closeButton'

    const body = document.createElement('div')
    body.setAttribute('class', 'SelectMenu-filter')
    const startInput = createInput('GitHubFilter-startDate', 'Start date (YYYY-MM-DD): ')
    startInput.style.setProperty('margin-bottom', '16px')
    const endInput = createInput('GitHubFilter-endDate', 'End date (YYYY-MM-DD): ')
    body.append(startInput, endInput)

    modal.append(header, body)
    return modal
}
