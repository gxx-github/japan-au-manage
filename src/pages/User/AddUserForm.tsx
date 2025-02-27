import React, { useState } from 'react';
import './index.less';
import { User } from './types';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 引入图标
interface AddUserFormProps {
  onAddUser: (user: Omit<User, 'id'>) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onAddUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 控制密码可见性
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onAddUser({name:username, pass_word:password });
      setUsername('');
      setPassword('');
    };
  
    return (
      <div className="form-container">
        <h2>Add User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'} // 切换输入框类型
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ?<FaEye />: <FaEyeSlash /> } {/* 切换图标 */}
            </span>
          </div>
          <button type="submit">ユーザー追加</button>
        </form>
      </div>
    );
};

export default AddUserForm;