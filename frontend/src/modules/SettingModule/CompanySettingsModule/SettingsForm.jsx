import { Form, Input, InputNumber, Select, Switch, DatePicker } from 'antd'; // Added DatePicker
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';
import { useForm } from 'antd/es/form/Form'; // Added useForm to get access to watch

// --- STATIC GENERAL SETTINGS (Existing Array) ---
const formItems = [
    { settingKey: 'company_name', valueType: 'string' },
    { settingKey: 'company_address', valueType: 'string' },
    { settingKey: 'company_state', valueType: 'string' },
    { settingKey: 'company_country', valueType: 'string' },
    { settingKey: 'company_email', valueType: 'string' },
    { settingKey: 'company_phone', valueType: 'string' },
    { settingKey: 'company_website', valueType: 'string' },
    { settingKey: 'company_tax_number', valueType: 'string' },
    { settingKey: 'company_vat_number', valueType: 'string' },
    { settingKey: 'company_reg_number', valueType: 'string' },
];

const { Option } = Select; // Destructure Option for Select

// --- DYNAMIC LOGIC FOR ISSUE #541 ---

const renderSettingValueField = (type) => {
    switch (type) {
        case 'number':
            return <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter number value" />;
        case 'date':
            return <DatePicker style={{ width: '100%' }} placeholder="Select Date" />;
        case 'text':
            return <Input placeholder="Enter text value" />;
        case 'select':
        case 'multiselect':
            // For Select/Multi Select, use a TextArea for inputting options separated by comma
            return (
                <Input.TextArea
                    rows={2}
                    placeholder="Enter options separated by comma (e.g., option1, option2)"
                />
            );
        default:
            return <Input placeholder="Enter default value" />;
    }
};

export default function SettingForm() {
    const translate = useLanguage();
    const [form] = useForm(); // Initialize form instance

    // 1. Use Form.useWatch to track the settingType value dynamically
    const settingType = Form.useWatch('settingType', form); 

    return (
        <Form form={form} layout="vertical"> {/* Wrap content in Form component */}
            
            {/* --- Existing Static Form Fields (Company Settings) --- */}
            {formItems.map((item) => {
                return (
                    <Form.Item
                        key={item.settingKey}
                        label={item.label ? translate(item.label) : translate(item.settingKey)}
                        name={item.settingKey}
                        rules={[{ required: false }]}
                        valuePropName={item.valueType === 'boolean' ? 'checked' : 'value'}
                    >
                        {item.valueType === 'string' && <Input autoComplete="off" />}
                        {item.valueType === 'number' && <InputNumber min={0} style={{ width: '100%' }} />}
                        {item.valueType === 'boolean' && (
                            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
                        )}
                        {item.valueType === 'array' && (
                            <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
                        )}
                    </Form.Item>
                );
            })}

            {/* --- New Dynamic Fields for Advanced Settings (Issue #541 Fix) --- */}
            
            <h2>{translate('Create New Advanced Setting')}</h2>
            
            {/* Setting Key (Name) */}
            <Form.Item
                label={translate('Setting Key')}
                name="settingKey"
                rules={[{ required: true, message: 'Please enter a unique key!' }]}
            >
                <Input placeholder="e.g., custom_invoice_footer" />
            </Form.Item>

            {/* Setting Type (The Select Field that drives the change) */}
            <Form.Item
                label={translate('Setting Type')}
                name="settingType"
                rules={[{ required: true, message: 'Please select a type!' }]}
            >
                <Select placeholder="Select a type">
                    <Option value="number">Number</Option>
                    <Option value="text">Text</Option>
                    <Option value="date">Date</Option>
                    <Option value="select">Select</Option>
                    <Option value="multiselect">Multi Select</Option>
                </Select>
            </Form.Item>

            {/* 2. Conditionally Rendered Setting Value Field */}
            {settingType && (
                <Form.Item
                    label={translate('Setting Value')}
                    name="settingValue"
                    rules={[{ required: true, message: 'Please enter a value or options!' }]}
                >
                    {renderSettingValueField(settingType)}
                </Form.Item>
            )}

        </Form>
    );
}

// Make sure to update your imports at the top of the file:
// import { Form, Input, InputNumber, Select, Switch, DatePicker } from 'antd';
// import { useForm } from 'antd/es/form/Form';