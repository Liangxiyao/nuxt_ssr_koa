import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'

/******add start************ */
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser'; //post请求必须
import session from 'koa-generic-session';
import Redis from 'koa-redis';
import json from 'koa-json';  //向客户端输出的json进行美化
import dbConfig from './dbs/config';
import passport from './interface/utils/passport';
import users from './interface/user';
import geo from './interface/geo';
import search from './interface/search';
import categroy from './interface/categroy';
/************ add end************ */


const app = new Koa()

app.keys = ['mt', 'keyskeys'] //密钥
app.proxy = true
app.use(session({ //配置session
  key: 'mt',
  prefix: 'mt:uid', //前缀描述
  store:new Redis() //session存储在redis里
}))
app.use(bodyParser({  //post处理
  extendTypes:['json','form','text']
}))
app.use(json())

//连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser:true
})

// app.use(passport.initialize())
// 会在请求周期ctx对象挂载以下方法与属性
// ctx.state.user 认证用户
// ctx.login(user) 登录用户（序列化用户）
// ctx.isAuthenticated() 判断是否认证
app.use(passport.initialize())
app.use(passport.session())


// Import and Set Nuxt.js options
import config from '../nuxt.config.js'
config.dev = app.env !== 'production' 

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1', 
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  /*********路由表  start*********** */
  app.use(users.routes()).use(users.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())
  app.use(categroy.routes()).use(categroy.allowedMethods())
  /*********路由表  end*********** */

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

