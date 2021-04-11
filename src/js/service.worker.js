/* eslint-disable no-shadow */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => cache.addAll([
      './',
      './index.html',
      './main.css',
      './main.js',
      './paragraph-bg.png',
      './favicon.ico',
    ])),
  );
});

self.addEventListener('activate', () => {
  console.log('Активирован');
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url.slice(location.origin.length);

  console.log(url);

  console.log('Происходит запрос на сервер');

  if (url.startsWith('/node_modules')) {
    console.log('Происходит запрос за картинкой');

    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request).then((response) => caches.open('my-mega-cache').then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      }))),
    );
  }

  if (url.startsWith('/images/user')) {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request).then((response) => caches.open('my-mega-cache').then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      })).catch(() => {
        console.log('catch!!!');
        return caches.match('./images/fallback/user.jpg');
      })),
    );
  } else {
    console.log('Поведение по умолчанию');
    event.respondWith(
      fetch(event.request).then((response) => caches.open('v1').then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      })).catch(() => caches.match(event.request)),
    );
  }
});
