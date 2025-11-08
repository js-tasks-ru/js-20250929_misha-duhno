export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : [];

    this.renderElement();
  }

  createHeaderCellTemplate({ id, title, sortable }) {
    return `
      <div class="sortable-table__cell"
        data-id="${id}"
        data-sortable="${sortable}">
        <span>${title}</span>
      </div>
    `;
  }

  createHeaderTemplate() {
    const headerElement = document.createElement('div');
    headerElement.classList.add('sortable-table__header', 'sortable-table__row');
    headerElement.setAttribute('data-element', 'header');

    headerElement.innerHTML = this.headerConfig
      .map(item => this.createHeaderCellTemplate(item))
      .join('');

    this.subElements.header = headerElement;
    return headerElement;
  }

  createBodyRowTemplate(item) {
    const link = `<a href="/products/${item.id}" class="sortable-table__row">`;

    const cells = this.headerConfig.map(({ id, template }) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');

    return link + cells + '</a>';
  }

  createBodyTemplate() {
    const bodyElement = document.createElement('div');
    bodyElement.classList.add('sortable-table__body');
    bodyElement.setAttribute('data-element', 'body');

    bodyElement.innerHTML = this.data
      .map(item => this.createBodyRowTemplate(item))
      .join('');

    this.subElements.body = bodyElement;
    return bodyElement;
  }

  createTableTemplate() {
    const wrapperElement = document.createElement('div');
    wrapperElement.classList.add('sortable-table');

    wrapperElement.append(this.createHeaderTemplate());
    wrapperElement.append(this.createBodyTemplate());

    return wrapperElement;
  }

  renderElement() {
    const tableElement = this.createTableTemplate();
    this.element = tableElement;
  }

  sort(field, order = 'asc') {
    const column = this.headerConfig.find(item => item.id === field);
    if (!column || !column.sortable) return;

    const direction = order === 'asc' ? 1 : -1;
    const sortType = column.sortType;

    const sortedData = [...this.data].sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);
      case 'string':
        return direction * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' });
      default:
        return 0;
      }
    });

    this.data = sortedData;

    this.subElements.body.innerHTML = this.data
      .map(item => this.createBodyRowTemplate(item))
      .join('');

    // Обновляем визуальный порядок
    this.updateHeaderSortState(field, order);
  }

  updateHeaderSortState(field, order) {
    const allColumns = this.subElements.header.querySelectorAll('[data-id]');
    for (const column of allColumns) {
      column.removeAttribute('data-order');
    }

    const currentColumn = this.subElements.header.querySelector(`[data-id="${field}"]`);
    if (currentColumn) {
      currentColumn.setAttribute('data-order', order);
    }
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
