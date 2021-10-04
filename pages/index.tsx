import { useSession } from 'next-auth/react'
import Layout from '../components/layout'

export default function Page () {
  const { status, data } = useSession({
    required: false,
  })
  return (
    <Layout>
      <h1>NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use <a href={`https://next-auth.js.org`}>NextAuth.js</a> for authentication.
      </p>
      <div>status: {status}</div>
      {JSON.stringify(data, null, 2)}
    </Layout>
  )
}
