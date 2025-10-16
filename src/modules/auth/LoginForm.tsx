import { Form, Button, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import GenericCardWrapper from '../../componnets/genericCardWrapper'
import GenericInput from '../../componnets/GenericInput'
import { Link } from 'react-router-dom'
import { commonRules } from '../../utils/validationRules'
import { useLogin } from '../../features/mutations/authMutation'

const { Text } = Typography

interface LoginFormData {
  email: string
  password: string
}

function LoginForm() {
  const [form] = Form.useForm()
  const loginMutation = useLogin()

  const onFinish = (values: LoginFormData) => {
    loginMutation.mutate(values, {
      onError: (error) => {
        console.error('Login failed:', error)
        message.error(error.message || 'Login failed. Please try again.')
      }
    })
  }

  const onFinishFailed = (errorInfo: Parameters<typeof Form.prototype.onFinishFailed>[0]) => {
    console.log('Login form failed:', errorInfo)
    message.error('Please check your input and try again')
  }

  return (
    <GenericCardWrapper
      title="Login"
      subtitle="Sign in to your account"
      footer={
        <Text>
          Don't have an account? <Link to="/auth/register">Sign up</Link>
        </Text>
      }
    >
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        size="large"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <GenericInput
          name="email"
          label="Email"
          type="email"
          prefix={<UserOutlined />}
          placeholder="Enter your email"
          rules={commonRules.email}
        />

        <GenericInput
          name="password"
          label="Password"
          type="password"
          prefix={<LockOutlined />}
          placeholder="Enter your password"
          rules={commonRules.password}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
            style={{ height: '44px', fontSize: '16px' }}
          >
            {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>
    </GenericCardWrapper>
  )
}

export default LoginForm