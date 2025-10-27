export default class NotificationMessage {
  static lastNotification = null;
  static timeoutId = null;
  element;

  constructor(message = '', opt) {
    this.message = message;
    this.duration = opt?.duration || 1000;
    this.type = opt?.type || 'success';
    this.element = this.createNotificationTemplate();
  }

  createMessageElement() {
    return `<div class="notification-body">${this.message}</div>`;
  }

  createNotificationTemplate() {
    const container = document.createElement('div');
    container.classList.add('notification');
    container.classList.add(this.type);
    container.setAttribute('style', `--value:${this.duration / 1000}s`);

    container.innerHTML = `
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          ${this.createMessageElement()}
        </div>
    `;

    return container;
  }

  show(target) {
    if (NotificationMessage.lastNotification) {
      this.remove();
      clearTimeout(NotificationMessage.lastNotification.timeoutId);
    }
    NotificationMessage.lastNotification = this;

    if (target) {
      target.appendChild(this.element);
    } else {
      document.body.appendChild(this.element);
    }

    this.timeoutId = setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    const notificationsArr = document.getElementsByClassName('notification');
    for (const notification of notificationsArr) {
      notification.remove();
    }
  }

  destroy() {
    this.element.remove();
  }
}
