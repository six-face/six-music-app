const path = require('path')
const webpack = require('webpack')
const tsImportPluginFactory = require('ts-import-plugin')
const HtmlWebpackPlugins = require('html-webpack-plugin')
const ExtractTextPlugins = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.tsx'
  },
  output: {
    filename: 'js/[name].js?v=[hash:6]',
    path: path.resolve('./dist')
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  target: "electron-renderer",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          // 按需加载
          getCustomTransformers: () => ({
            before: [
              // 在代码中import antd 组件的时候需要单独引入样式文件，这个插件是帮助引入插件的，这个插件只支持es6模块倒入方法（源码中）
              tsImportPluginFactory({
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: 'css'
              })
            ]
          })
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugins.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugins.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'less-loader' }
          ]
        })
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '../',
            name: 'img/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugins({ template: 'src/index.html' }),
    new ExtractTextPlugins('css/[name].css'),
    new webpack.ExternalsPlugin('commonjs', [
      'electron',
      'request'
    ])
  ]
}