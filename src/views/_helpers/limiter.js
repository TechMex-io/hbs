export const limiter = function (data, options) {
  let start, limit;
  let chunks = [];
  let html;
  if (options.hash.start) {
    start = options.hash.start;
  }
  if (options.hash.limit) {
    limit = options.hash.limit;
  }

  html = data.slice(start, limit).map(function(post) {
    return options.fn(post);
  }, this);

  if (data.length > limit) {
    html.push(`<a href="?p=2">view more posts</a>`);
  }

  // for (let i = 0; i < data.length; i+=limit) {
  //   chunks = data.slice(i, i+limit);

  //   html = chunks.map(function(post) {
  //     return `<li>${post.title}<br>${post.teaser}</li>`;
  //   }, this);
  //   break;
  // }
  
  // const posts = data.map(function (post) {
  //   return post;
  // })
  return html.join('');
}
