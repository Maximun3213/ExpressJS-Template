import index from './app'
import env from './config/env.config'
import { connectDB } from './database'

connectDB().catch(console.dir)

index.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}...`)
})
// test comment
