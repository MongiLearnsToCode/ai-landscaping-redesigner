import dynamic from 'next/dynamic'

const LoginPage = dynamic(() => import('../src/components/LoginPage'), { ssr: false })

export default LoginPage
