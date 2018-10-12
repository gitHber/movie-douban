// 爬去电影天堂最新电影 网页爬取
// const puppeteer = require('p')
const https = require('https')
const cheerio = require('cheerio')
const fs = require('fs')
const iconv = require('iconv-lite')

!(async () => {
  var opt = {
    hostname: 'www.dy2018.com',
    path: '/html/gndy/dyzz/index.html'
  }
  const movies = []
  await https.get(opt, function(res) {
    var arr = []
    res.on('data', function(chunk){
      arr.push(chunk)
    })
    res.on('end', function(){
      var $ = cheerio.load(iconv.decode(Buffer.concat(arr),'gb2312'))
      $('.tbspan').each(function(){
        var movie = {
          title: $('.ulink', this).text(),
          date: $('tr', this).eq('2').find('font').text()
        }
        movies.push(movie)
      })
      process.send({movies})
      process.exit(0)
      // 保存json
      // saveData('movie.json', movies)
    })
  })
})()

function saveData(path, movies) {
  fs.writeFile(path, JSON.stringify(movies, null, 4), function(err){
    err && console.log(err)
  })
}

/**
 * 下载图片
 *
 * @param {string} imgDir 存放图片的文件夹
 * @param {string} url 图片的 URL 地址
 */
function downloadImg(imgDir, url) {
  https.get(url, function(res) {
      var data = '';

      res.setEncoding('binary');

      res.on('data', function(chunk) {
          data += chunk;
      });

      res.on('end', function() {
          // 调用 fs.writeFile 方法保存图片到本地
          fs.writeFile(imgDir + path.basename(url), data, 'binary', function(err) {
              if (err) {
                  return console.log(err);
              }
              console.log('Image downloaded:', path.basename(url));
          });
      });
  }).on('error', function(err) {
      console.log(err);
  });
}