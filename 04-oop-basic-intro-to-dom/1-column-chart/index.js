export default class ColumnChart {
  element;
  chartHeight;

  constructor({data, label, value, link, formatHeading, chartHeight} = {}) {
    this.data = data || [];
    this.label = label || '';
    this.value = value || 0;
    this.link = link || '';
    this.formatHeading = formatHeading || ((data) => data);
    this.chartHeight = chartHeight || 50;

    this.element = this.renderTemplate();
  }

  createLinkElement(link) {
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.classList.add('column-chart__link');
    linkElement.textContent = 'View all';

    return linkElement;
  }

  createTitleTemplate() {
    const titleElement = document.createElement('div');
    titleElement.classList.add('column-chart__title');
    titleElement.textContent = this.label;

    if (this.link) {
      const linkElement = this.createLinkElement(this.link);
      titleElement.appendChild(linkElement);
    }

    return titleElement;
  }

  createHeaderElement() {
    const titleElement = document.createElement('div');
    titleElement.classList.add('column-chart__header');
    titleElement.setAttribute('data-element', 'header');
    titleElement.textContent = this.formatHeading(this.value);

    return titleElement;
  }

  createColumnElement({value, maxValue, scale}) {
    const columnElement = document.createElement('div');

    columnElement.setAttribute('style', `--value: ${Math.floor(value * scale)}`);
    columnElement.setAttribute('data-tooltip', `${(value / maxValue * 100).toFixed(0)}%`);

    return columnElement;
  }

  createBodyElement() {
    const bodyElement = document.createElement('div');
    bodyElement.setAttribute('data-element', 'body');
    bodyElement.classList.add('column-chart__chart');

    return bodyElement;
  }

  createChartTemplate() {
    const bodyElement = this.createBodyElement();

    if (this.data.length) {
      const maxValue = Math.max(...this.data);
      const scale = 50 / maxValue;

      for (const item of this.data) {
        const columnElement = this.createColumnElement({value: item, maxValue, scale});
        bodyElement.appendChild(columnElement);
      }
    }

    return bodyElement;
  }

  createDataVisualisationTemplate() {
    const containerElement = document.createElement('div');
    containerElement.classList.add('column-chart__container');

    const headerElement = this.createHeaderElement();
    const chartTemplate = this.createChartTemplate();

    containerElement.appendChild(headerElement);
    containerElement.appendChild(chartTemplate);

    return containerElement;
  }

  renderTemplate() {
    const containerElement = document.createElement('div');
    containerElement.classList.add('column-chart');

    if (!this.data.length) {
      containerElement.classList.add('column-chart_loading');
    }

    containerElement.setAttribute('style', `--chart-height: ${this.chartHeight}`);

    const titleTemplate = this.createTitleTemplate();
    const dataVisualisationTemplate = this.createDataVisualisationTemplate();

    containerElement.appendChild(titleTemplate);
    containerElement.appendChild(dataVisualisationTemplate);

    return containerElement;
  }

  update(data) {
    this.data = data;
    this.element.querySelector('[data-element="body"]').replaceWith(this.createChartTemplate());
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
