
const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

//日志输出：vue-cli 自动设置的环境变量
if (process.env.NODE_ENV === 'development') {
  console.log('This is a development build');
} else if (process.env.NODE_ENV === 'production') {
  console.log('This is a production build');
}




module.exports = defineConfig({

  publicPath: process.env.NODE_ENV === 'production' ? '/rk_app/' : '/rk_app/',//都使用一样的
  
  transpileDependencies: true,

  // 配置Webpack
  configureWebpack: {

    output: {
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[name].[contenthash].js',
    },    
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
      },      
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'static'),
        'npm': path.resolve(__dirname, 'node_modules'), 
        '@config': path.resolve(__dirname, 'config'), 
      },
    },
    
    optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // 去除 console.log 语句
              },
            },
          })
        ],        
        splitChunks: {
          chunks: 'all', // 处理同步和异步块
          minSize: 20000, // 拆分前的最小模块大小（20 KB）
          maxSize: 200000, // 拆分后的最大模块大小（200 KB）
          minChunks: 1, // 模块最少被引用的次数
          maxAsyncRequests: 30, // 最大异步请求数
          maxInitialRequests: 30, // 最大初始请求数
          automaticNameDelimiter: '~', // 名称分隔符
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的模块
              priority: -10 // 优先级
            },
            default: {
              minChunks: 2, // 模块最少被引用的次数
              priority: -20, // 优先级
              reuseExistingChunk: true // 复用已经存在的块
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的模块
              chunks: 'initial', // 处理初始块
              name: 'vendors', // 块名称
            },
            'async-vendors': {
              test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的模块
              minChunks: 2, // 模块最少被引用的次数
              chunks: 'async', // 处理异步块
              name: 'async-vendors' // 块名称
            }
          }
        }
    },
    module: {
      rules: [
        // 处理图片文件
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          type: "asset",
        },  
      ],
    },
    plugins: [
        new ImageMinimizerPlugin({

            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                    plugins: [
                        ["imagemin-gifsicle", { interlaced: true }],
                        ["imagemin-mozjpeg", { quality: 70 }],
                        ["imagemin-pngquant", { quality: [0.35, 0.50] }],
                        [
                          "imagemin-svgo",
                          {
                            plugins: [
                                {
                                  name: 'preset-default',
                                  params: {
                                    overrides: {
                                      // 禁用某些默认插件或进行其他调整
                                      removeViewBox: false, // 例如，不移除 viewBox 属性
                                    },
                                  },
                                },
                                {
                                  name: 'addAttributesToSVGElement',
                                  params: {
                                    attributes: [
                                      { xmlns: 'http://www.w3.org/2000/svg' },
                                    ],
                                  },
                                },
                            ],
                          },
                        ],
                    ],
                },
            },
            generator: [
              {
                // 为 WebP 格式生成
                preset: "webp",
                implementation: ImageMinimizerPlugin.imageminGenerate,
                options: {
                  plugins: ["imagemin-webp"],
                },
              },
            ],
        }),
        // new FontminPlugin({
        //   autodetect: true, // 自动检测使用的字体字符
        //     // glyphs: ['\u0000-\u00FF'], // 你也可以手动指定需要保留的字符
        //     // glyphs: ['\uf0c8'], // 指定需要的字符集
        //     //  text: 'Hello World!', // 指定需要的文本内容
        // }),
    ],

  },

  chainWebpack: config => {

    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].title = 'My App - Production';
      } else {
        args[0].title = 'My App - Development';
      }
      return args;
    });

    //TODO
    if (process.env.NODE_ENV === 'development') {
      // config.devtool('source-map');
    } else if (process.env.NODE_ENV === 'production') {
      config.devtool(false);
    }
    

  },

  // 开发服务器配置
  devServer: {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //   }
    // },
    port: 8080
  }

});

