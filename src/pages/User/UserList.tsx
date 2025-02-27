import React, { useContext } from 'react';
import { User } from './types';

import './index.less';
import { InfoContext } from '@/components/InfoProvider';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelet: (user: User,name?:string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit ,onDelet}) => {
      const { userInfo }: any = useContext(InfoContext);
  
  return (
    <div className="user-list">
      <table>
        <thead>
          <tr>
            <th>番号</th>
            <th>ユーザー名</th>
            <th>パスワード</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          { users && users.map((user,index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{user.name}</td>
              {/* <td>{atob(user.pass_word)}</td> */}
              <td>{user.pass_word}</td>
              <td>
                <button onClick={() => {
                 
                  if(user.name !== userInfo || user.name!==localStorage.getItem('user')){
                    onEdit(user)
                  }
                }} className={user.name === userInfo || user.name===localStorage.getItem('user')?'disabled':""  }  disabled={user.name === userInfo || user.name===localStorage.getItem('user')}>編集</button>
                <button onClick={() => {
                  if(user.name !== userInfo || user.name!==localStorage.getItem('user')){
                    onDelet(user,user.name)
                  }
                }} className={user.name === userInfo || user.name===localStorage.getItem('user')?'disabled':"cancel-button"  } disabled={user.name === userInfo || user.name===localStorage.getItem('user')}>削除</button>
              </td>
            </tr>
          )) 
        }
        </tbody>
      </table>
      {!users && <div className="empty">ユーザーが見つかりません</div>}
    </div>
  );
};

export default UserList;