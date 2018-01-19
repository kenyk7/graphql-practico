const port = 8080
const host = 'localhost'

export default {
	PORT: process.env.PORT || port,
	HOST: process.env.HOST || host,
	SUBSCRIPTIONS_URL: process.env.WS_API || `ws://${host}:${port}`
}
