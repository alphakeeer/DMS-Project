import { Form, Input, Switch, Alert } from 'antd';
import { useAuthStore } from '@/stores/authStore';

const ProfileEditor = () => {
  const { user, updateProfileWithCode } = useAuthStore();
  const [showCodeField, setShowCodeField] = useState(false);
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      initialValues={user}
      onFinish={(values) => {
        if (values.activationCode) {
          return updateProfileWithCode(values, values.activationCode);
        }
        return updateProfile(values);
      }}
    >
      {/* 基础信息字段... */}

      <Form.Item label="激活管理权限">
        <Switch
          checked={showCodeField}
          onChange={(checked) => {
            setShowCodeField(checked);
            if (!checked) form.setFieldValue('activationCode', '');
          }}
        />
      </Form.Item>

      {showCodeField && (
        <Form.Item
          name="activationCode"
          label="组织者激活码"
          rules={[{ required: true, message: '请输入激活码' }]}
        >
          <Input placeholder="从管理员处获取的激活码" />
        </Form.Item>
      )}

      {user.isOrganizer && (
        <Alert
          type="success"
          message="您已激活组织者权限"
          description="可以创建和管理活动"
          showIcon
        />
      )}
    </Form>
  );
};