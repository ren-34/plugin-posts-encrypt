'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.removedir =
  exports.mkdir =
  exports.minifyCss =
  exports.uglify =
  exports.genFile =
  exports.render =
  exports.limitAsyncConcurrency =
  exports.genInjectedCSS =
  exports.genInjectedJS =
  exports.mergeOptions =
  exports.DefaultOptions =
  exports.info =
  exports.warn =
  exports.error =
  exports.wrapperLogger =
  exports.isObject =
  exports.LESS_PATH =
  exports.TMPL_PATH =
  exports.CHECK_ALL_PATH_KEY =
  exports.STORAGE_KEY =
  exports.IVIEW_JS_TAG =
  exports.ANIMATECSS_TAG =
  exports.IVIEW_CSS_TAG =
    void 0
const os_1 = require('os')
const uglify_js_1 = __importDefault(require('uglify-js'))
const clean_css_1 = __importDefault(require('clean-css'))
const child_process_1 = require('child_process')
const fs_1 = require('fs')
const path_1 = require('path')
const shared_utils_1 = require('@vuepress/shared-utils')
const encrypt_1 = require('./encrypt')
const LIMIT = (0, os_1.cpus)().length - 1
const cleanCSS = new clean_css_1.default()
exports.IVIEW_CSS_TAG = `<link rel="stylesheet" type="text/css" href="//unpkg.com/view-design@4.7.0/dist/styles/iview.css" />`
exports.ANIMATECSS_TAG = `<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />`
exports.IVIEW_JS_TAG = `<script type="text/javascript" src="//unpkg.com/view-design@4.7.0/dist/iview.min.js"></script>`
exports.STORAGE_KEY = '__vuepress_posts_encrypt_plugin__'
exports.CHECK_ALL_PATH_KEY = '__vuepress_posts_encrypt_plugin__check_all__'
exports.TMPL_PATH = (0, path_1.resolve)(__dirname, '../../assets/index.html')
exports.LESS_PATH = (0, path_1.resolve)(__dirname, '../../assets/index.less')
const isObject = (o) => o && typeof o === 'object'
exports.isObject = isObject
const wrapperLogger = (prefix, type) => {
  return (...args) =>
    shared_utils_1.logger[type]
      ? shared_utils_1.logger[type](prefix, ...args)
      : shared_utils_1.logger.info(prefix, ...args)
}
exports.wrapperLogger = wrapperLogger
exports.error = (0, exports.wrapperLogger)(`ERR@vuepress-plugin-posts-encrypt`, 'error')
exports.warn = (0, exports.wrapperLogger)(`WARN@vuepress-plugin-posts-encrypt`, 'warn')
exports.info = (0, exports.wrapperLogger)(`INFO@vuepress-plugin-posts-encrypt`, 'info')
exports.DefaultOptions = {
  route: '/auth',
  passwd: 'hello world',
  template: exports.TMPL_PATH,
  encryptInDev: false,
  expires: 0,
  checkAll: false,
  // 自定义模板时，需要注入的外部资源配置
  injectConfig: {
    less: '',
    iview: false,
    animate: false
  }
}
/**
 * 合并配置
 *
 * @param {object} base
 * @param {object} options
 * */
const mergeOptions = (base = exports.DefaultOptions, options = {}) => {
  const $options = Object.create(null)
  Object.entries(base).reduce((pre, cur) => {
    const [key, value] = cur
    const user = options[key]
    typeof user !== 'undefined'
      ? (0, exports.isObject)(user)
        ? (pre[key] = (0, exports.mergeOptions)(value, options[key]))
        : (pre[key] = user)
      : (pre[key] = value)
    return pre
  }, $options)
  return $options
}
exports.mergeOptions = mergeOptions
/**
 * 生成注入的脚本
 *
 * @export
 * @param {string} text
 * @param {string} base
 * @param {number} expires 过期时间，默认 0，不过期
 * @param {boolean} isCustom 是否是用户自定义模板
 * @returns {string}
 */
const genInjectedJS = (options, text, base, isCustom, expires) => {
  // 按照文档，base应该始终以 `/` 开头并以 `/` 结束，参见[https://vuepress.vuejs.org/zh/guide/assets.html#%E5%9F%BA%E7%A1%80%E8%B7%AF%E5%BE%84]
  const { dir, base: _base } = (0, path_1.parse)(base)
  base = _base ? `${dir}${_base}` : _base
  const { checkAll } = options
  const part1 = `
      /**
       * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       * Part1：配置基础数据 & 方法
       * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       * */ 
      const keySize = 256
      const iterations = 1000
      const sleep = (time = 500) => new Promise((resolve) => setTimeout(resolve, time))
      const getQuery = (() => {
        const search = location.search
        const queries = !search ? {} : (search.slice(1).split('&').reduce((pre, cur) => {
          let [k, v] = cur.split('=')
          pre[k] = decodeURIComponent(v)
          return pre
        }, {}))
        return (key) => queries[key]
      })()
      const setStorageItem = (key, subKey, params) => {
        try {
          let storage = JSON.parse(localStorage.getItem(key)) || {}
          let sub = {
            value: '',
            expires: 0,
            startTime: new Date().getTime() //记录何时将值存入缓存，毫秒级
          }
          storage[subKey] = Object.assign(sub, params)
          localStorage.setItem(key, JSON.stringify(storage))
        } catch(e) {
          console.error(e)
        }
      }
      /**
       * 验证密码是否正确
       * 
       * @param {string} password 用户输入的密码
       * @return {boolean} true|false
       * */ 
      function validate(password) {
        const encryptedMsg = '${text}'
        const reg = '${checkAll}' === 'true' ? new RegExp('${exports.CHECK_ALL_PATH_KEY}_([^;]*)') : new RegExp(\`\${getQuery('redirect')}_([^;]*)\`)
        const matched = encryptedMsg.match(reg)
        if(!matched) return false
        const ciphertext = matched[1]
        const encryptedHMAC = ciphertext.substring(0, 64)
        const encryptedHTML = ciphertext.substring(64)
        const decryptedHMAC = CryptoJS.HmacSHA256(encryptedHTML, CryptoJS.SHA256(password).toString()).toString();
      
        return decryptedHMAC === encryptedHMAC
      }`
  const part2 = `
      /**
       * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       * Part2：密码验证通过后，需要将已验证通过的路由写入到 localstorage，防止死循环
       * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       * */ 
      setStorageItem('${exports.STORAGE_KEY}', '${
    checkAll ? exports.CHECK_ALL_PATH_KEY : `getQuery('redirect')`
  }', {
        value: true,
        expires: ${typeof expires === 'number' ? expires : 0}
      })`
  const part3 = `
      /**
       * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       * Part3：密码验证通过后跳转到目标地址
       * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       * */ 
      location.replace('${base}' + \`\${getQuery('path')}\`)`
  return isCustom
    ? `${part1}\n${part2}\n${part3}`
    : `${part1}\n
    new Vue({
      el: '#app',
      data() { 
        return {
          btnLoading: false,
          lockClass: '',
          offListener: null,
          modal_loading: false,
          formInline: {
            password: ''
          },
          ruleInline: {
            password: [
              { validator: this.validatePass, trigger: 'blur' }
            ]
          }
        }
      },
      mounted() {
        this.offListener = this.bindListener('formRef', this.changeLockClass.bind(this, ''))
      },
      unmounted() {
        this.offListener()
      },
      methods: {
        toggleBool(key) {
          this[key] = !this[key]
        },
        bindListener(refKey, userCb) {
          let elm = this.$refs[refKey].$el || this.$refs[refKey]
          let listener = (e) => {
            userCb.call(this, e)
          }
          elm && elm.addEventListener("animationend", listener)
          return () => elm.removeEventListener('animationend', listener)
        },
        changeLockClass(classNames, el) {
          this.lockClass = classNames
        },
        validatePass(rule, value, callback) {
          let passphrase = value
          let isCorrect = validate(passphrase)

          if (!isCorrect) {
            return callback(new Error('请输入正确的密码 ！'))
          }
          callback()
        },
        handleSubmit(name = 'formInline') {
          if(this.formInline.password === '') return
          this.toggleBool('btnLoading')
          this.$refs[name].validate(async (valid) => {
            await sleep()
            this.toggleBool('btnLoading')
            if (valid) {
              ${part2}\n
              this.changeLockClass('animate__animated animate__hinge')
              await sleep(1000)
              ${part3}\n
            } else {
              this.changeLockClass('animate__animated animate__headShake')
            }
          })
        }
      }
    })`
}
exports.genInjectedJS = genInjectedJS
/**
 * 生成注入的css
 *
 * @export
 * @param {string} fromPath
 * @param {string} toPath 写到 tmp 下
 */
const genInjectedCSS = (fromPath, outPath) => {
  if (!fromPath || typeof fromPath !== 'string') return ''
  try {
    const _from = (0, shared_utils_1.toAbsolutePath)(fromPath)
    const _out = (0, shared_utils_1.toAbsolutePath)((0, path_1.join)(outPath, `index.css`))
    // 编译less
    ;(0, child_process_1.execSync)(`npx lessc ${_from} ${_out}`)
    // 压缩
    return minifyCss((0, fs_1.readFileSync)(_out))
  } catch (e) {
    ;(0, exports.error)(e)
    return ''
  }
}
exports.genInjectedCSS = genInjectedCSS
/**
 * 异步并发限制
 *
 * @export
 * @param {Map<any, any>} sources
 * @param {*} callback
 * @param {*} [limit=LIMIT]
 * @returns
 */
function limitAsyncConcurrency(sources, callback, limit = LIMIT) {
  return __awaiter(this, void 0, void 0, function* () {
    let done
    let runningCount = 0
    const lock = []
    let total = sources.size
    if (!total) return
    const p = new Promise((resolve) => (done = resolve))
    const block = () =>
      __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => lock.push(resolve))
      })
    const next = () => {
      const fn = lock.shift()
      fn && fn()
      runningCount--
    }
    const getFileContent = (item) =>
      __awaiter(this, void 0, void 0, function* () {
        if (runningCount >= limit) yield block()
        runningCount++
        new Promise((resolve, reject) => callback(resolve, reject, next, item)).then((res) => {
          total--
          if (!total) {
            done()
          }
        })
      })
    for (const item of sources.entries()) {
      getFileContent(item)
    }
    return p
  })
}
exports.limitAsyncConcurrency = limitAsyncConcurrency
/**
 * 用于替换模板字符串中的占位符
 *
 * @export
 * @param {*} tpl
 * @param {*} data
 * @returns
 */
function render(tpl, data) {
  return tpl.replace(/<%(.*?)%>/g, function (_, key) {
    return (data && data[key]) || ''
  })
}
exports.render = render
/**
 * 用于 build 构建时，向 outPath 路径下写入 tmplPath 文件内容
 * 并替换模板内的占位符，注入变量值
 *
 * @export
 * @param {string} tmplPath
 * @param {string} outPath
 * @returns
 */
function genFile(tmplPath, outPath, data) {
  // 模板文件内容缓存
  let templateContents = null
  try {
    templateContents = (0, fs_1.readFileSync)(tmplPath, 'utf8')
  } catch (e) {
    console.log(e)
    ;(0, exports.error)('Failure: failed to read template: ' + tmplPath)
  }
  const renderedTemplate = render(
    templateContents,
    Object.assign(data, {
      crypto_inject_tag: encrypt_1.CRYPTO_INJECT
    })
  )
  try {
    ;(0, fs_1.writeFileSync)(outPath, renderedTemplate)
  } catch (e) {
    console.log(e)
    ;(0, exports.error)('Failure: could not write template:' + outPath)
  }
  templateContents = null
}
exports.genFile = genFile
/**
 * 压缩JS
 *
 * @export
 * @param {*} content
 * @param {*} options
 * @returns
 */
function uglify(content, options) {
  return uglify_js_1.default.minify(content, options)
}
exports.uglify = uglify
/**
 * 压缩CSS
 *
 * @export
 * @param {*} content
 * @returns
 */
function minifyCss(content) {
  return cleanCSS.minify(content)
}
exports.minifyCss = minifyCss
function mkdir(_path) {
  try {
    shared_utils_1.fs.ensureDirSync(_path)
  } catch (e) {
    console.log(e)
    ;(0, exports.error)('Failure: failed to mkdir: ' + _path)
  }
}
exports.mkdir = mkdir
/**
 * 删除文件夹及文件
 *
 * @param {*} _path
 */
function removedir(_path) {
  try {
    shared_utils_1.fs.removeSync(_path)
  } catch (e) {
    console.log(e)
    ;(0, exports.error)('Failure: failed to removedir: ' + _path)
  }
}
exports.removedir = removedir
