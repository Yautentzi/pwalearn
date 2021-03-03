importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/cropped-logo-125-x60-3.png',
    'img/avatars/entradas.jpg',
    'img/avatars/pizzas.png',
    'img/avatars/ensaladas.jpg',
    'img/avatars/pastas.jpg',
    'img/avatars/hamburguesas.jpg',
    'img/avatars/bebidas.jpg',
    'img/avatars/alitas.png',
    'img/avatars/boneless.png',
    'img/avatars/postres.png',
    'js/app.js',
    'js/sw-utils.js'
];
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


self.addEventListener('install', event => {
    const staticCache = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));
    const inmutableCache = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    event.waitUntil(Promise.all([staticCache, inmutableCache]));
});


self.addEventListener('activate', event => {
    const activateResp = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });

    event.waitUntil(activateResp);
});


self.addEventListener('fetch', event => {
    const fetchResp = caches.match(event.request).then(resp => {
        if (resp) {
            return resp;
        } else {
            return fetch(event.request).then(newResp => {
                return updateDynamicCache(DYNAMIC_CACHE, event.request, newResp);
            });
        }
    });

    event.respondWith(fetchResp);
});

