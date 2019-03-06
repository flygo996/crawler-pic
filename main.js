/*
 * @Author: laifeipeng 
 * @Date: 2019-03-01 23:02:00 
 * @Last Modified by: laifeipeng
 * @Last Modified time: 2019-03-06 12:12:55
 */
const path = require('path');
const fs = require('fs');
const superagent = require('superagent');  //nodejs里一个非常方便的客户端请求代理模块
const cheerio = require('cheerio'); //Node.js 版的jQuery
const charset = require("superagent-charset"); //解决superagent中文乱码问题
charset(superagent); //设置字符
superagent.buffer['jpg'] = true;

//创建目录
function mkdir(_path, callback) {
  if (fs.existsSync(_path)) {
    console.log(`${_path}目录已存在`)
  } else {
    fs.mkdir(_path, (error) => {
      if (error) {
        return console.log(`创建${_path}目录失败`);
      }
      console.log(`创建${_path}目录成功`)
    })
  }
  callback(); //没有生成指定目录不会执行
}

//下载爬到的图片
function downloadImg() {
  rst.forEach((imgUrl, index) => {
    //下载图片存放到指定目录
    const stream = fs.createWriteStream(`./pic/${imgUrl.alt}.jpg`);
    const req = superagent.get(imgUrl.picUrl); //响应流
    req.pipe(stream);
    console.log(`开始下载图片 https:${imgUrl.picUrl} --> ./pic/${imgUrl.picUrl}`);
  })
}

const MEI_URL = 'https://www.zbjuran.com/mei/';// 高清美女图片大全
const rst = []; // 存放最后的结果

superagent.get(MEI_URL)
  .charset('gbk') // 解决中文乱码
  .end((err, res) => {
    if (err) {
      return console.error(err);
    }
    // console.log(res.text)
    let $ = cheerio.load(res.text);
    $('.main .pic-list li .picbox img').each((idx, element) => {
      const $element = $(element)['0']['attribs'];
      let pic = $element['data-original'];
      // 把相对路径的图片地址加上hostname，构成完整的url路径【如果没有前缀则加上】
      !$element['data-original'].includes('//www.zbjuran.com/') && (pic = 'https://www.zbjuran.com/' + pic);

      rst.push({
        picUrl: pic,
        alt: $element['alt'],
        width: $element['width'],
        height: $element['height'],
      })
    })
    console.log(rst);
    mkdir('./pic', downloadImg); // 保存图片到本地
  })