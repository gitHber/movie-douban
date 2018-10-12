// 派发子进程执行爬取
const cp = require('child_process')
const {resolve} = require('path')

// !(async () =>{
//   const script = resolve(__dirname, '../crawler/movie-list')
//   // 派生子进程
//   const child = cp.fork(script, [])
//   let invoked = false

//   child.on('error', err => {
//     if(invoked) return
//     invoked = true
//     !err && console.log(err)
//   })

//   child.on('exit', code => {
//     if(invoked) return
//     invoked = true
//     let err = code === 0 ? null : new Error('exit code '+code)
//     !err && console.log(err)
//   })

//   child.on('message', data => {
//     console.log(data.movies)
//     console.log(11)
//   })
// })()

module.exports = async (ctx, next) =>{
  const script = resolve(__dirname, '../crawler/movie-list')
  // 派生子进程
  const child = cp.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if(invoked) return
    invoked = true
    !err && console.log(err)
  })

  child.on('exit', code => {
    if(invoked) return
    invoked = true
    let err = code === 0 ? null : new Error('exit code '+code)
    !err && console.log(err)
  })

  child.on('message', data => {
    ctx.body += ctx.body.slice(0, -14) + JSON.stringify(data.movies, null,2) + '</body></html>'
  })
  await new Promise(resolve => setTimeout(resolve, 1000))
  next()
  console.log(ctx.body)
}