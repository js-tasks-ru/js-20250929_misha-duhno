export default class SortableTable {
  element;
  subElements = {};
  sorted;
  isSortLocaly;

  constructor(headerConfig = [], { data = [], sorted = {} } = {}, isSortLocaly = true) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocaly = isSortLocaly;

    this.createTableElement();
    this.initEventListeners();

    if (this.sorted && this.sorted.id) {
      this.sortLocaly(this.sorted.id, this.sorted.order);
    }
  }

  get sortArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`;
  }

  createHeaderCellTemplate({ id, title, sortable }) {
    const orderAttr = (this.sorted && this.sorted.id === id) ? `data-order="${this.sorted.order}"` : '';
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" ${orderAttr}>
        <span>${title}</span>
      </div>`;
  }

  createBodyRowTemplate(item) {
    const cells = this.headerConfig.map(({ id, template }) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');

    return `<a href="/products/${item.id}" class="sortable-table__row">${cells}</a>`;
  }

  createBodyRowsTemplate(data) {
    return data.map(item => this.createBodyRowTemplate(item)).join('');
  }

  createSortArrowElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.sortArrowTemplate.trim();
    return wrapper.firstElementChild;
  }

  createTableElement() {
    const containerElement = document.createElement('div');
    containerElement.classList.add('sortable-table');

    containerElement.innerHTML = `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(item => this.createHeaderCellTemplate(item)).join('')}
      </div>
      <div data-element="body" class="sortable-table__body">
        ${this.createBodyRowsTemplate(this.data)}
      </div>
    `;

    this.element = containerElement;

    this.subElements = this.getSubElements(containerElement);
    if (this.subElements.header) this.subElements.headerElement = this.subElements.header;
    if (this.subElements.body) this.subElements.bodyElement = this.subElements.body;

    const defaultHeaderCell = this.subElements.header ? this.subElements.header.querySelector(`[data-id="${this.sorted?.id}"]`) : null;
    if (defaultHeaderCell) {
      defaultHeaderCell.append(this.createSortArrowElement());
    }
  }

  getSubElements(parentElement) {
    const elements = parentElement.querySelectorAll('[data-element]');
    return [...elements].reduce((acc, sub) => {
      acc[sub.dataset.element] = sub;
      return acc;
    }, {});
  }

  sortLocaly(field, order = 'asc') {
    const columnConfig = this.headerConfig.find(item => item.id === field);
    const sortType = columnConfig ? columnConfig.sortType : 'string';
    const direction = order === 'asc' ? 1 : -1;

    this.data.sort((a, b) => {
      if (sortType === 'number') {
        return direction * (a[field] - b[field]);
      } else {
        return direction * String(a[field]).localeCompare(String(b[field]), ['ru', 'en'], { caseFirst: 'upper' });
      }
    });

    this.sorted = { id: field, order };

    this.updateHeaderElement(field, order);
    this.updateBodyElement();
  }

  sortOnServer(field, order) {
    console.log('sortOnServer not implemented', field, order);
  }

  sort(field, order) {
    if (this.isSortLocaly) {
      this.sortLocaly(field, order);
    } else {
      this.sortOnServer(field, order);
    }
  }

  updateHeaderElement(field, order) {
    const headerRoot = this.subElements.header;
    if (!headerRoot) return;

    const allCells = headerRoot.querySelectorAll('[data-id]');
    allCells.forEach(cell => cell.removeAttribute('data-order'));

    const targetCell = headerRoot.querySelector(`[data-id="${field}"]`);
    if (!targetCell) return;

    targetCell.setAttribute('data-order', order);

    const existingArrow = headerRoot.querySelector('[data-element="arrow"]') || this.createSortArrowElement();
    targetCell.append(existingArrow);
  }

  updateBodyElement() {
    if (!this.subElements.body) return;
    this.subElements.body.innerHTML = this.createBodyRowsTemplate(this.data);
  }

  initEventListeners() {
    const headerRoot = this.subElements.header;
    if (headerRoot) {
      headerRoot.addEventListener('pointerdown', this.onHeaderPointerDown);
    }
  }

  onHeaderPointerDown = (event) => {
    const headerCell = event.target.closest('.sortable-table__cell');
    if (!headerCell) return;
    if (headerCell.dataset.sortable === 'false') return;

    let newOrder;
    if (this.sorted && this.sorted.id === headerCell.dataset.id) {
      newOrder = this.sorted.order === 'asc' ? 'desc' : 'asc';
    } else {
      newOrder = 'desc';
    }

    this.sort(headerCell.dataset.id, newOrder);
  };

  remove() {
    if (this.subElements.header) {
      this.subElements.header.removeEventListener('pointerdown', this.onHeaderPointerDown);
    }
    if (this.element) this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
    this.element = null;
  }
}
