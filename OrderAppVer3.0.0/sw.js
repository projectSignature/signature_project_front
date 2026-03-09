self.addEventListener('fetch', event => {
  const req = event.request;

  // 画像だけ対象
  if (req.destination === 'image') {
    event.respondWith(
      caches.open('menu-images-v1').then(cache =>
        cache.match(req).then(res => {
          if (res) return res;

          return fetch(req).then(fetchRes => {
            cache.put(req, fetchRes.clone());
            return fetchRes;
          });
        })
      )
    );
  }
});
