const scanner = require('sonarqube-scanner');

scanner(
  {
    // 连接的服务器地址
    serverUrl: 'http://192.168.110.109:19000',
    // token: "75ffc2a907cb7e7eed412ba902ae4bfe22f31a36",
    options: {
      // 生成检查结果的项目名称
      'sonar.projectName': 'mftcc-npm',
      // 生成检查结果的项目描述
      'sonar.projectDescription': '前端组件库',
      // 需要检查的代码目录路径（多个可用逗号分隔）
      'sonar.sources': 'src',
      'sonar.tests': '',
      'sonar.login': "mftcc",
      'sonar.password': "mftcc",
    }
  },
  () => process.exit()
)