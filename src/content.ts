const node = document.querySelector('#sort-select-menu')
const container = node.parentNode

const filter = node.cloneNode() as Element
const summary = node.querySelector('summary').cloneNode(true)

const details = document.createElement('details-menu')
const modal = document.createElement('div')
details.appendChild(modal)

filter.id = 'date-select-menu'
filter.appendChild(summary)
filter.appendChild(details)

container.appendChild(filter)
