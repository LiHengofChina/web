<template>
  <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>
</template>
<script>
export default {
  name: 'SIdentify',
  props:["identifyOption"],
  data() {
    return {
        identifyCode:"",
        // 字体最小值
        fontSizeMin: 28,
        // 字体最大值
        fontSizeMax:36,
        // 背景颜色色值最小值，最小为0
        backgroundColorMin:200,
        // 背景颜色色值最大值，最大为255
        backgroundColorMax:240,
        // 字体颜色色值最小值，最小为0
        colorMin:0,
        // 字体颜色色值最大值，最大为255
        colorMax:180,
        // 干扰线颜色色值最小值，最小为0
        lineColorMin:150,
        // 干扰线颜色色值最大值，最大为255
        lineColorMax:200,
        // 干扰点颜色色值最小值，最小为0
        dotColorMin: 100,
        // 干扰点颜色色值最大值，最大为255
        dotColorMax: 250,
        // 画布宽度
        contentWidth: 100,
        // 画布高度
        contentHeight: 40,
        makeCode:""
    }
},
  mounted () {
    this.makeIdentifyCode(this.identifyOption);
    // this.drawPic()
  },
  methods: {
    /**
     * 生成一个随机数
     * @param {number} min 随机数最小值
     * @param {number} max 随机数最大值
     */
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },

    /**
     * 生成一个随机的颜色
     * @param {number} min 随机数最小值
     * @param {number} max 随机数最大值
     */
    randomColor (min, max) {
      const r = this.randomNum(min, max)
      const g = this.randomNum(min, max)
      const b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },

    /**
     * 绘制图片验证码
     */
    drawPic () {
      let canvas = document.querySelector('#s-canvas')
      let ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      // 绘制背景
      ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制干扰点
      this.drawDot(ctx)
      // 绘制验证码
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i)
      }
      // 绘制干扰线
      this.drawLine(ctx)
    },

    /**
     * 绘制文本单个验证码
     * @param {object} ctx canvas上下文对象
     * @param {string} txt 单个验证码
     * @param {number} i 单个验证码序号
     */
    drawText (ctx, txt, i) {
      ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
      ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
      let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      let deg = this.randomNum(-45, 45)
      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    },

    /**
     * 绘制干扰线
     * @param {object} ctx canvas上下文对象
     */
    drawLine (ctx) {
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.stroke()
      }
    },

    /**
     * 绘制干扰点
     * @param {object} ctx canvas上下文对象
     */
    drawDot (ctx) {
      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    },
    /**
     * 随机生成一个0~9之间的数
     */
    randomNumber () {
      return Math.floor(Math.random() * 10)
    },

    /**
     * 随机生成一个字母
     * @param {boolean} isUupper 生成大写字母
     */
    randomAlphabet ({ isUupper = false } = {}) {
      // a的Unicode值为97,z的Unicode值为123
      const alphabet = String.fromCharCode(Math.floor(Math.random() * 25) + 97)
      if (!isUupper) {
        return alphabet
      } else {
        return alphabet.toUpperCase()
      }
    },

    /**
     * 生成图片验证码
     * @param {number} length 图片验证码位数
     * @param {boolean} typeMix 数字和字母混合
     * @param {string} pureNumber 纯数字('number')或者字母('alphabet')
     * @param {boolean} randomTypeLen 随机生成类型个数组合
     * @param {boolean} capsLookMix 字母大小写混合
     * @param {number} numLength 混合类型下的数字个数
     * @param {number} uupperLength 大写字母的个数
     */
    makeIdentifyCode ({ length = 4, typeMix = true, pureNumber = 'alphabet', randomTypeLen = false, capsLookMix = false, numLength = 2, uupperLength = 1 } = {}) {
      this.makeCode = ''
      // 数字和字母混合
      if (typeMix) {
        // 随机生成类型个数组合
        if (randomTypeLen) {
          // 字母大小写混合
          if (capsLookMix) {
            const numLength = Math.floor(Math.random() * length) + 1
            const uupperLength = numLength === length ? 0 : Math.floor(Math.random() * (length - numLength)) + 1
            for (let i = 0; i < numLength; i++) {
              this.makeCode += this.randomNumber()
            }
            for (let i = 0; i < uupperLength; i++) {
              this.makeCode += this.randomAlphabet({ isUupper: true })
            }
            if (numLength + uupperLength < length) {
              for (let i = 0; i < length - numLength - uupperLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          } else {
            const numLength = Math.floor(Math.random() * length) + 1
            for (let i = 0; i < numLength; i++) {
              this.makeCode += this.randomNumber()
            }
            if (numLength < length) {
              for (let i = 0; i < length - numLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          }
        } else {
          // 字母大小写混合
          if (capsLookMix) {
            const tempNumLength = numLength < 0 ? 2 : numLength > length ? 2 : numLength
            const tempUupperLength = uupperLength < 0 ? 1 : uupperLength > length - tempNumLength ? 1 : uupperLength
            for (let i = 0; i < tempNumLength; i++) {
              this.makeCode += this.randomNumber()
            }
            for (let i = 0; i < tempUupperLength; i++) {
              this.makeCode += this.randomAlphabet({ isUupper: true })
            }
            if (tempNumLength + tempUupperLength < length) {
              for (let i = 0; i < length - tempNumLength - tempUupperLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          } else {
            const tempNumLength = numLength < 0 ? 2 : numLength > length ? 2 : numLength
            for (let i = 0; i < tempNumLength; i++) {
              this.makeCode += this.randomNumber()
            }
            if (tempNumLength < length) {
              for (let i = 0; i < length - tempNumLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          }
        }
      } else {
        // 纯数字('number')
        if (pureNumber === 'number') {
          for (let i = 0; i < length; i++) {
            this.makeCode += this.randomNumber()
          }
        }
        // 纯字母('alphabet')
        if (pureNumber === 'alphabet') {
          // 字母大小写混合
          if (capsLookMix) {
            const tempUupperLength = uupperLength < 0 ? 1 : uupperLength > length ? 1 : uupperLength
            for (let i = 0; i < tempUupperLength; i++) {
              this.makeCode += this.randomAlphabet({ isUupper: true })
            }
            if (tempUupperLength < length) {
              for (let i = 0; i < length - tempUupperLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          } else {
            for (let i = 0; i < length; i++) {
              this.makeCode += this.randomAlphabet()
            }
          }
        }
      }
      this.shuffle(this.makeCode)
    },

    /**
     * 图片验证码随机排序
     * @param {string} str 图片验证码
     */
    shuffle (str) {
      this.identifyCode = [...str].sort(() => Math.random() - 0.5).join('')
      this.$store.commit('set_identifyCode', {
        identifyCode:this.identifyCode,
        time:this.identifyOption.time||600000
      });
      // console.log(this.identifyCode)
    },

    /**
     * 更换图片验证码
     */
    refreshCode () {
      this.makeIdentifyCode(this.identifyOption)
    }
  },
  watch: {
    identifyCode () {
      this.drawPic()
    }
  }
}
</script>