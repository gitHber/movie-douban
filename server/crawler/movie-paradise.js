// 爬去电影天堂最新电影 puppeteer爬取
const puppeteer = require('puppeteer')

const renderMovies = (movies) => {
  return `<script>
    let movies = ${JSON.stringify(movies)}
    let movieRow = document.createElement('div')
    movieRow.classList.add('row')
    for(let i = 0; i<movies.length; i++){
      let movieCol = document.createElement('div')
      movieCol.classList.add('col-2')
      movieCol.innerHTML = \`<div class="movie-item"><img src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2535365481.webp" /><div>\${movies[i].title}</div><div>\${movies[i].date}</div></div>\`
      movieRow.appendChild(movieCol)
      if((i+1)%6 === 0 && i !== 0){
        document.body.appendChild(movieRow)
        movieRow = document.createElement('div')
        movieRow.classList.add('row')
      }
    }
  </script>`
  
}

module.exports = async (ctx, next) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.dy2018.com/html/gndy/dyzz/index.html')
  const result = await page.evaluate(() => {
    let movies = Array.from(document.querySelectorAll('.tbspan')).map(movie => {
      let title = movie.querySelector('.ulink').innerText
      let date = movie.querySelectorAll('tr')[2].innerText
      return {
        title: title.substring(title.indexOf('《')+1, title.indexOf('》')),
        date: date.substring(date.indexOf('：')+1, date.indexOf('点'))
      }
    })
    return movies
  })
  
  await browser.close()
  
  ctx.body = ctx.body.slice(0, -14) + renderMovies(result) + '</body></html>'
  next()
}