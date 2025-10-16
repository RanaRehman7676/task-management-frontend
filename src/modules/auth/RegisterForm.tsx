import { Form, Button, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import GenericCardWrapper from '../../componnets/genericCardWrapper'
import GenericInput from '../../componnets/GenericInput'
import { commonRules } from '../../utils/validationRules'
import { Link } from 'react-router-dom'
import { useRegister } from '../../features/mutations/authMutation'

const { Text } = Typography

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  retype_password: string
}

function RegisterForm() {
  const [form] = Form.useForm()
  const registerMutation = useRegister()

  const onFinish = (values: RegisterFormData) => {
    const registerData = {
      name: values.name,
      email: values.email,
      password: values.password,
      retype_password: values.confirmPassword
    }
    
    console.log('📝 Register Data:', registerData)
    
    registerMutation.mutate(registerData, {
      onError: (error) => {
        console.error('Registration failed:', error)
        message.error(error.message || 'Registration failed. Please try again.')
      }
    })
  }

  const onFinishFailed = (errorInfo: Parameters<typeof Form.prototype.onFinishFailed>[0]) => {
    console.log('Register form failed:', errorInfo)
    message.error('Please check your input and try again')
  }

  return (
    <GenericCardWrapper
      title="Create Account"
      subtitle="Sign up to get started"
      footer={
        <Text>
          Already have an account? <Link to="/auth/login">Sign in</Link>
        </Text>
      }
    >
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        size="large"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <GenericInput
          name="name"
          label="Full Name"
          type="text"
          prefix={<UserOutlined />}
          placeholder="Enter your full name"
          rules={commonRules.name}
        />

        <GenericInput
          name="email"
          label="Email"
          type="email"
          prefix={<MailOutlined />}
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

        <GenericInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          prefix={<LockOutlined />}
          placeholder="Confirm your password"
          rules={[
            {
              required: true,
              message: 'Please confirm your password!'
            },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                }
                if (value !== form.getFieldValue('password')) {
                  return Promise.reject(new Error('Passwords do not match!'));
                }
                return Promise.resolve();
              }
            }
          ]}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending}
            style={{ height: '44px', fontSize: '16px' }}
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Form.Item>
      </Form>
    </GenericCardWrapper>
  )
}

export default RegisterForm