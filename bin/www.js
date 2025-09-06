// for local environment
const app = require('../api/app')
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const http = require('http')
const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

let logger = console

function normalizePort(val) {
	let port = parseInt(val, 10)
	if (isNaN(port)) return val // named pipe
	if (port >= 0) return port // port number
	return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') throw error

	let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			logger.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			logger.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	let addr = server.address();
	let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	logger.info('Listening on ' + bind)
}


async function cleanup() {
	try {
		// 1. 关闭HTTP服务器（停止接收新连接，等待现有连接处理完毕）
		server.close(async (err) => {
			if (err) {
				logger.error('关闭服务器失败:', err)
				process.exit(1) // 强制退出
			}
			logger.info('HTTP服务器已关闭')

			// 2. 关闭数据库连接池

			// 3. 退出进程
			process.exit(0)
		});
	} catch (err) {
		logger.error('清理资源失败:', err)
		process.exit(1)
	}
}

// 监听终止信号：SIGINT（Ctrl+C）、SIGTERM（kill命令）
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

// 处理未捕获的异常，避免进程挂起
process.on('uncaughtException', (err) => {
	logger.info('未捕获的异常:', err)
	cleanup().then(() => process.exit(1))
})

// 处理未捕获的Promise拒绝
process.on('unhandledRejection', (reason) => {
	logger.info('未处理的Promise拒绝:', reason)
	cleanup().then(() => process.exit(1))
})