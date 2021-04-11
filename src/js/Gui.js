/* eslint-disable class-methods-use-this */
export default class Gui {
  constructor() {
    this.widget = document.querySelector('.widget');
    this.widgetContainer = this.widget.querySelector('.container');
    this.main = this.widget.querySelector('main');
    this.containers = null;
    this.containersP = null;
    // this.input = document.querySelector('input');
    // this.result = document.querySelector('[data-id=result-text]');
    // this.button = document.querySelector('button');
  }

  articleTemplate(title = '', description = '', image = `
  <svg width="50" heigth="50">
    <rect x = "0" y = "0" width = "50" height = "50" fill = "#a7a7a7"/>
  </svg>
  `) {
    // генерятся после записи в класс гуи:
    // 1. получить отдельным запросом.
    return `
    <div class="wrapper">
      <h4>${title}</h4>
      <article>
        ${image}
        <p>${description}</p>
      </article>
    </div>
    `;
  }

  getDOM() {
    this.containers = this.main.querySelectorAll('.wrapper');
    this.containersP = document.querySelectorAll('.wrapper p');
  }
}
