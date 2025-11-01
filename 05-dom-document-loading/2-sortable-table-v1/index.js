export default class SortableTable {
  element;
  subElements;
  sortedColumn;
  sortType;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createTableTemplate();
  }

  createSortArrowElement() {
    return '<span data-element="arrow" class="sortable-table__sort-arrow"> <span class="sort-arrow"></span></span>';
  }

  createHeaderCellElement({id, title, sortable}) {
    return `
      <div class="sortable-table__cell"
      data-id="${id}"
      data-sortable="${sortable}"
      ${this.sortedColumn === id ? 'data-order="' + this.sortType + '"' : ''}>
          <span>${title}</span>
          ${sortable ? this.createSortArrowElement() : ''}
      </div>
    `;
  }

  createTableHeaderTemplate() {
    let headerTemplate = document.createElement('div');

    headerTemplate.setAttribute('data-element', 'header');
    headerTemplate.classList.add('sortable-table__header');
    headerTemplate.classList.add('sortable-table__row');

    let cellsTemplate = '';

    for (const cell of this.headerConfig) {
      cellsTemplate += this.createHeaderCellElement(cell);
    }

    headerTemplate.innerHTML = cellsTemplate;

    return headerTemplate;
  }

  createBodyCustomCellElement(data, template) {
    return template(data);
  }

  createBodyCellElement(data) {
    return `<div class="sortable-table__cell">${data}</div>`;
  }

  createTableRowElement(rowData) {
    let rowElement = `<a href="/products/3d-ochki-optoma-zd301" class="sortable-table__row">`;

    for (const cell of this.headerConfig) {
      switch (cell.sortType) {
      case 'string':
        rowElement += this.createBodyCellElement(rowData[cell.id]);
        break;
      case 'number':
        rowElement += this.createBodyCellElement(rowData[cell.id]);
        break;
      default:
        if (cell.template) {
          rowElement += this.createBodyCustomCellElement(rowData[cell.id], cell.template);
        } else {
          rowElement += this.createBodyCellElement(rowData[cell.id]);
        }
        break;
      }
    }
    rowElement += '</a>';

    return rowElement;
  }

  createTableBodyTemplate() {
    let tableBodyTemplate = document.createElement('div');
    tableBodyTemplate.setAttribute('data-element', 'body');
    tableBodyTemplate.classList.add('sortable-table__body');

    let cellsTemplate = '';

    for (const rowData of this.data) {
      cellsTemplate += this.createTableRowElement(rowData);
    }
    tableBodyTemplate.innerHTML = cellsTemplate;

    return tableBodyTemplate;
  }

  createTableTemplate() {
    const container = document.createElement('div');
    container.classList.add('sortable-table');

    const headerTemplate = this.createTableHeaderTemplate();
    const bodyTemplate = this.createTableBodyTemplate();
    this.subElements = {body: bodyTemplate};

    container.appendChild(headerTemplate);
    container.appendChild(bodyTemplate);

    return container;
  }

  update() {
    const table = document.querySelector('.sortable-table');
    const tableTemplate = this.createTableTemplate();
    this.element = tableTemplate;

    table.replaceWith(tableTemplate);
  }

  sort(field, type = 'asc') {
    const sortType = this.headerConfig.find((cell) => cell.id === field)?.sortType;
    const k = type === 'asc' ? 1 : -1;

    this.sortedColumn = field;
    this.sortType = type;

    this.data.sort((a, b) => {
      if (sortType === 'string') {
        return k * a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'});
      } else {
        return k * (a[field] - b[field]);
      }
    });

    this.update();
  }

  destroy() {
    this.element.remove();
    this.subElements = {};
    this.sortedColumn = '';
    this.sortType = '';
  }
}

