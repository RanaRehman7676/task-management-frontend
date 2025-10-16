import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import type { FormItemProps, InputNumberProps, SelectProps } from 'antd'
import type { ReactNode } from 'react'

export type InputType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea'

interface GenericInputProps {
  name: string
  label?: string
  placeholder?: string
  type?: InputType
  prefix?: ReactNode
  suffix?: ReactNode
  rules?: FormItemProps['rules']
  options?: Array<{ label: string; value: string | number }>
  rows?: number
  disabled?: boolean
  loading?: boolean
  style?: React.CSSProperties
  className?: string
  min?: number
  max?: number
}

const GenericInput: React.FC<GenericInputProps> = ({
  name,
  label,
  placeholder,
  type = 'text',
  prefix,
  suffix,
  rules = [],
  options = [],
  rows = 3, 
  disabled = false,
  loading = false,
  style,
  className,
  min,
  max
}) => {
  // Render input based on type
  const renderInput = () => {
    const baseInputProps = {
      prefix,
      suffix,
      placeholder,
      disabled,
      loading,
      style,
      className
    }

    switch (type) {
      case 'email':
        return <Input {...baseInputProps} type="email" autoComplete="email" />
      
      case 'password':
        return <Input.Password {...baseInputProps} autoComplete="current-password" />
      
      case 'number': {
        const numberProps: InputNumberProps = {
          ...baseInputProps,
          style: { width: '100%', ...style },
          min,
          max
        }
        return <InputNumber {...numberProps} />
      }
      
      case 'select': {
        const selectProps: SelectProps = {
          ...baseInputProps,
          options,
          loading
        }
        return <Select {...selectProps} />
      }
      
      case 'textarea':
        return <Input.TextArea 
          placeholder={placeholder}
          disabled={disabled}
          style={style}
          className={className}
          rows={rows} 
        />
      
      default:
        return <Input {...baseInputProps} />
    }
  }

  // Check if field is required
  const isRequiredField = rules?.some(rule => 
    typeof rule === 'object' && rule && 'required' in rule && rule.required
  )

  // Create label with asterisk after it
  const displayLabel = label && (
    <span>
      {label}
      {isRequiredField && <span style={{ color: 'red', marginLeft: '2px' }}>*</span>}
    </span>
  )

  return (
    <Form.Item
      name={name}
      label={displayLabel}
      rules={rules}
      required={false}
      style={{ marginBottom: '8px' }}
    >
      {renderInput()}
    </Form.Item>
  )
}

export default GenericInput
