const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const {resolve} = require('path')
const getMovie = require('./crawler/movie-paradise')

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))
app.use(async (ctx, next) => {
  await ctx.render('index', {
    author: "李坤"
  })
  await next()
})
app.use(getMovie)

console.log('server start http://localhost:8080')
app.listen(8080)