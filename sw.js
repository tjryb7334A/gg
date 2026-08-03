// ============================================================
// sw.js - Service Worker للتجربة
// ============================================================

const CACHE_NAME = 'syria-tourism-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// ============================================================
// 1️⃣ تثبيت Service Worker وتخزين الملفات
// ============================================================
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ تم فتح الكاش');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// ============================================================
// 2️⃣ تنشيط Service Worker
// ============================================================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ حذف الكاش القديم:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// ============================================================
// 3️⃣ التحكم في طلبات الشبكة (Fetch)
// ============================================================
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // إذا وجد في الكاش، ارجعه
                if (response) {
                    return response;
                }
                // وإلا، اجلبه من الشبكة
                return fetch(event.request).then((response) => {
                    // لا نخزن كل شيء، فقط الملفات الأساسية
                    return response;
                });
            })
            .catch(() => {
                // إذا فشل كل شيء، ارجع صفحة بديلة (اختياري)
                // return caches.match('/offline.html');
            })
    );
});

console.log('🚀 Service Worker loaded successfully!');