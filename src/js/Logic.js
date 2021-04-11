/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import Worker from './web.worker.js';
import './service.worker.js';

export default class Logic {
  constructor(gui) {
    this.gui = gui;
    // this.url = 'http://localhost:7070';
    this.url = 'https://npeplov-ahj-workers.herokuapp.com/';
  }

  init() {
    this.showMain();
    this.sendXHR();
    this.listenServiceWorker();
  }

  async sendXHR() {
    // пока загрузка - класс заглушка
    this.gui.getDOM();
    this.gui.containers.forEach((container) => container.classList.add('stub'));
    const response = await fetch(this.url);
    const articles = await response.json();
    // после загрузки - снять
    this.gui.containers.forEach((container) => container.classList.remove('stub'));
    // перерисовка wrappers
    this.gui.main.innerHTML = '';
    articles.forEach((article) => {
      this.gui.main.innerHTML += this.gui.articleTemplate(
        article.title, article.description, `<img src="${article.image}">`,
      );
    });
  }

  listenServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service.worker.js', { scope: './' })
        .then((reg) => {
          console.log(`Registration succeeded. Scope is ${reg.scope}`);
        }).catch((error) => {
          console.log(`Registration failed with ${error}`);
        });
    }
  }

  async showFile(evt) {
    const file = (evt.target.files[0]);
    const content = await this.readFile(file);

    const worker = new Worker();
    worker.addEventListener('message', ({ data: result }) => {
      this.gui.result.textContent = result.length;
      console.log(result);
      worker.terminate();
    });
    worker.postMessage(content);
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (evt) => {
        resolve(evt.target.result);
      });
      reader.addEventListener('error', (evt) => {
        reject(evt.target.error);
      });
      reader.readAsText(file);
    });
  }

  showMain() {
    this.gui.main.innerHTML += this.gui.articleTemplate();
    this.gui.main.innerHTML += this.gui.articleTemplate();
  }

  test() {
    function sendResponse() {
      let result = 0;
      for (let i = 0; i < 1000000000; i += 1) {
        result += 1;
      }
      return result;
    }
    sendResponse();
  }

  // this.gui.input.addEventListener('change', (evt) => this.showFile(evt));
  // this.gui.button.addEventListener('click', () => console.log('click\n'));
  // this.test();
  // this.workerMessages();
  workerMessages() {
    // const worker = new Worker();
    // worker.addEventListener('message', (e) => {
    //   console.log(e);
    // });
    // worker.addEventListener('error', (e) => {
    //   console.log(e);
    // });
    // worker.postMessage('message from main');
  }
}
