/*
 * @Author: laifeipeng 
 * @Date: 2019-03-01 23:02:00 
 * @Last Modified by: laifeipeng
 * @Last Modified time: 2019-03-01 23:52:02
 */

const superagent = require('superagent');  //nodejs里一个非常方便的客户端请求代理模块
const cheerio = require('cheerio'); //Node.js 版的jQuery
const charset = require("superagent-charset"); //解决superagent中文乱码问题
charset(superagent); //设置字符

const BASE_URL = 'https://www.zbjuran.com/'; // 高清美女图片大全
const SUB_PATH = 'mei/';
const fullUrl = BASE_URL + SUB_PATH;

const rst = []; // 存放最后的结果

superagent.get(fullUrl).charset('gbk')
  .end((err, res) => {
    if (err) {
      return console.error(err);
    }
    // console.log(res.text)
    let $ = cheerio.load(res.text);
    $('.main .pic-list li .picbox img').each((idx, element) => {
      const $element = $(element)['0']['attribs'];
      let pic = $element['data-original'];
      !$element['data-original'].includes(BASE_URL) && (pic = BASE_URL + pic); // 如果没有前缀则加上

      rst.push({
        picUrl: pic,
        alt: $element['alt'],
        width: $element['width'],
        height: $element['height'],
      })
    })
    console.log(rst);
  })