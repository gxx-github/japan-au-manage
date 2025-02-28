import React, { useContext, useEffect, useState } from 'react';

import { User } from './types';
import './index.less';
import AddUserForm from './AddUserForm';
import UserList from './UserList';
import EditUserForm from './EditUserForm';
import { InfoContext } from '@/components/InfoProvider';
import { fetchAddUser, fetchDelUser, fetchUserInfo, fetchUserList } from '@/api/home';
import { message } from "antd";

const UserDom: React.FC = () => {
  const [users, setUsers] = useState<User[]>([

  ]);
  const { userInfo }: any = useContext(InfoContext);
  const [messageApi, contextHolder] = message.useMessage();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false); // 控制添加表单的显示
  //添加用户
  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    const Params = {
      "name": newUser.name,
      "pass_word": newUser.pass_word
    }
    fetchAddUser(Params)
      .then((res) => {
    
        if (res) {
          messageApi.open({
            type: 'success',
            content: '正常に追加されました',
          });
          setShowAddForm(false);
          getUserList()
        }
      })
      .catch((err) => {
        messageApi.open({
          type: 'error',
           content: err.response.data.error || err.message,
        });
      });
    // setShowAddForm(false); // 添加用户后隐藏表单
  };
  //编辑
  const handleUpdateUser = (updatedUser: User) => {
    const Params = {
      "name": updatedUser.name,
      "pass_word": updatedUser.pass_word
    }
    fetchAddUser(Params)
      .then((res) => {
    
        if (res) {
          messageApi.open({
            type: 'success',
            content: '変更に成功しました',
          });
          setShowAddForm(false);
          getUserList()
        }
      })
      .catch((err) => {
        messageApi.open({
          type: 'error',
          content: err.response.data.error || err.message,
        });
      });
    setEditingUser(null);
  };
  //删除
  const handleDeleteUser = (user: User, name?: string) => {
    const Params = {
      "name": user.name
    }
    fetchDelUser(Params)
      .then((res) => {
        if(res){
          messageApi.open({
            type: 'success',
            content: '削除されました',
          });
          getUserList()
        }
      })
      .catch((err) => {

        messageApi.open({
          type: 'error',
          content: err.response.data.error || err.message,
        });
      });

  };
  //取消编辑
  const handleCancelEdit = () => {
    setEditingUser(null); // 关闭编辑表单
  };
  //获取用户列表
  const getUserList = () => {
    const Params = {
      "name": userInfo || localStorage.getItem('user'),
      "page": 1,
      "limit": 50
    }
    fetchUserList(Params)
      .then((res) => {
        if (res) {
          const { data } = res
          const { users } = data
          setUsers(users)
        }
      })
      .catch((err) => {
        messageApi.open({
          type: 'error',
          content: err.response.data.error || err.message,
        });
        setUsers([])
      });
  }
  useEffect(() => {
    getUserList()

    return () => {

    }
  }, [])

  return (
    <div className="container">
      {contextHolder}
      {/* <h1>User Management</h1> */}

      {/* 添加用户按钮 */}
      <button
        className="add-user-button"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'キャンセル' : 'ユーザー追加'}
      </button>

      {/* 添加用户表单 */}
      {showAddForm && <AddUserForm onAddUser={handleAddUser} />}

      {/* 用户列表 */}
      <UserList users={users} onEdit={setEditingUser} onDelet={handleDeleteUser} />

      {/* 编辑用户表单 */}
      {editingUser && <EditUserForm user={editingUser} onUpdateUser={handleUpdateUser} onCancel={handleCancelEdit} />}
    </div>
  );
};

export default UserDom;