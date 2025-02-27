import React, { useState, useEffect } from 'react';
import './index.less';
import { User } from './types';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 引入图标

interface EditUserFormProps {
    user: User;
    onUpdateUser: (user: User) => void;
    onCancel: () => void; // 新增 onCancel 回调
  }
  
  const EditUserForm: React.FC<EditUserFormProps> = ({ user, onUpdateUser,onCancel }) => {
    const [username, setUsername] = useState(user.name);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 控制密码可见性
  
    useEffect(() => {
      setUsername(user.name);
      setPassword(user.pass_word);
    }, [user]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateUser({ ...user,name: username,pass_word: password });
      setPassword('');
    };
  
    return (
      <div className="form-container">
        <h2>編集</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled
          />
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'} // 切换输入框类型
              placeholder="New Password"
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
          <div className="form-actions">
          <button type="submit">編集</button>
          <button type="button" onClick={onCancel} className="cancel-button">
          キャンセル
          </button>
        </div>
        </form>
      </div>
    );
  };

export default EditUserForm;