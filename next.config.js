const webpack = require('webpack')
// const withSass = require('@zeit/next-sass')
// const withCSS = require('@zeit/next-css')

require('dotenv').config()

module.exports = {
  webpack: config => {
    config.module.rules.push(
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }
      }
    )
    config.node = {
      fs: 'empty',
      child_process: 'empty'
    }
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr])
      return acc
    }, {})
    config.plugins.push(new webpack.DefinePlugin(env))
    return config
  },
  i18n: {
    locales: ['en-US', 'ru-UA', 'zh-CN', 'fr-FR', 'es-ES', 'de-DE', 'it-IT', 'sv-SE', 'pl-PL', 'pt-PT', 'tr-TR', 'el-GR', 'ja-JP', 'ko-KR'],
    defaultLocale: 'en-US'
  }
}
