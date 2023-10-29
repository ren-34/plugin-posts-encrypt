## plugin-posts-encrypt

> **A `vuepress plugin` to add `access verification` to your blog.**

对原 [vuepress-plugin-posts-encrypt](https://github.com/alphawq/vuepress-plugin-posts-encrypt)插件的改造。

## 使用

- 安装

```sh
npm install vuepress-plugin-posts-encrypt-ren
```

- 使用

&emsp;&emsp;在 vuepress 的 config.js 中添加：

```js
module.exports = {
  plugins: [
    [
      // 访问验证插件
      'posts-encrypt-ren',
      {
        route: '/auth.html',
        passwd: '@Lencamo',
        expires: 72 * 60 * 60 * 1000,
        encryptInDev: true,
        checkAll: true
      }
    ]
  ]
}
```

> 更多配置，请参考[vuepress-plugin-posts-encrypt](https://github.com/alphawq/vuepress-plugin-posts-encrypt)
