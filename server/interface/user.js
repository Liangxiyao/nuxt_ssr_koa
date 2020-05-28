import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer';
import User from '../dbs/models/users';
import Passport from './utils/passport';
import Email from '../dbs/config';
import axios from './utils/axios';

let router = new Router({
  prefix:'/users'
})

let Store = new Redis().client

//*************注册**************/
router.post('/signup', async (ctx) => {
  const { username, password, email, code } = ctx.request.body
  
  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) { //验证码过期
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新登录'
        }
        return false;
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '验证码错误'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }

  //检测是否被注册
  let user = await User.find({
    username
  })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg:'已被注册'
    }
    return
  }
  
  //写库
  let nuser = await User.create({
    username,
    password,
    email
  })
  if (nuser) {
    let res = await axios.post('/users/signin', {
      username,
      password
    })
    if(res.data && res.data.code === 0){ //注册成功
      ctx.body = {
        code: 0,
        mag: '注册成功',
        user: res.data.user
      }
    } else {  //写库失败
      ctx.body = {
        code: -1,
        msg:'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg:'注册失败'
    }
  }
})



//****************登录************/
router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', (err, user, info, status) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg:err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登陆成功',
          user:user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg:info
        }
      }
    }
  })(ctx,next)  //api规定这么用
})

//验证码
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg:'验证请求过于频繁，请稍后再试'
    }
    return false
  }

  let transporter = nodeMailer.createTransport({
    service: 'qq',
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user:ctx.request.body.username
  }
  let mailOptions = {
    from: `认证邮件<${Email.smtp.user}>`,
    to: ko.email,
    subject: '注册验证码',
    html:`测试：注册邀请码是${ko.code}`
  }
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      //存redis中
      Store.hmset(`nodeemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire,'email',ko.email)
    }
  })

  ctx.body = {
    code: 0,
    msg:'验证码已发送，有效期1分钟 '
  }
})
//*************退出************ */
router.get('/exit', async (ctx, next) => {
  console.log(ctx)
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code:0
    }
  } else {
    ctx.body = {
      code:-1
    }
  }
})

router.get('/gerUser', async (ctx) => {
  if (ctx.isAuthenticated()) {  //passport 的api,判断是否认证
    const { username, email } = ctx.session.passport.user //登陆成功则session中存的passport 
    ctx.body = {
      user: username,
      email: email
    }
  } else {
    ctx.body = {
      user: '',
      email:''
    }
  }
})

export default router