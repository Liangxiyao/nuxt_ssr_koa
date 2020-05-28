export default {
  dbs: 'mongodb://127.0.0.1:27017/student',
  redis: {
    get host() {
      return '127.0.0.1'  //默认本地ip，不建议更改
    },
    get port() {
      return 6379 //默认端口，不建议更改
    }
  },
  smtp: {
    get port() {
      return 'stmp.qq.com'
    },
    get user() {
      return '790680635@qq.com'
    },
    get pass() {
      return 'cnzemxesyypwbdbd'
    },
    get code() {  //邮箱发送验证码
      return () => {
        return Math.random().toString(16).slice(2,6).toUpperCase()
      }
    },
    get expire() {  //过期时间
      return () => {
        return new Date().getTime()+60*60*1000
      }
    }
  }
}