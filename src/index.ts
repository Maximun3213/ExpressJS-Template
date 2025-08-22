import index from './app'
import env from './config/env.config'
import { connectDB } from './database'

connectDB().catch(console.dir)

index.listen(env.PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${env.PORT}`)
  console.log(`Access via localhost: http://localhost:${env.PORT}`)
  console.log(`Access via IP address: http://[YOUR_IP_ADDRESS]:${env.PORT}`)
})
