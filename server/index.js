const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const {resolve} = require('path')

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))
app.use(async (ctx, next) => {
  await ctx.render('index', {

  })
})
console.log('server start http://localhost:8080')
app.listen(8080)