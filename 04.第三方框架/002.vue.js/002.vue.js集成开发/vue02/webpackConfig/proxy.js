
module.exports = {
		'/liheng/': {
			target: "http://127.0.0.1:18100",
			changeOrigin: true,
			pathRewrite:{
				['^/liheng/']: ''
			}
		}
}
