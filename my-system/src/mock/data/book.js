/**
 * Created by ali on 2018/9/13.
 */

import Mock from 'mockjs'
const Books = []
 for (let i = 0 ; i < 100; i ++){
  Books.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.ctitle(2,12),
    author: Mock.Random.cname(),
    description: Mock.Random.csentence(180,500),
    publishAt: Mock.Random.date()
  }))
 }

 export {Books}
