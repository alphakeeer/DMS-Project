import { Alert, Button } from 'antd';
import { Link } from 'react-router-dom';

export const PermissionNotice = ({ requiredLevel = 'organizer' }) => {
  const messages = {
    organizer: {
      title: '需要组织者权限',
      description: '您需要激活组织者权限才能访问此功能',
      actionText: '立即激活'
    },
    admin: {
      title: '需要管理员权限',
      description: '请联系系统管理员获取访问权限'
    }
  };

  const { title, description, actionText } = messages[requiredLevel];

  return (
    <div className="permission-notice">
      <Alert
        type="warning"
        showIcon
        message={title}
        description={
          <>
            <p>{description}</p>
            {actionText && (
              <Link to="/activate">
                <Button type="primary" size="small">
                  {actionText}
                </Button>
              </Link>
            )}
          </>
        }
      />
    </div>
  );
};