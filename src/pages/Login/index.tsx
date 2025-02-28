"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import styles from "./index.less"
import { history } from "umi";
import { fetchLogin } from "@/api/home";
import { message } from "antd";
import CryptoJS from 'crypto-js';
import { InfoContext } from "@/components/InfoProvider";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [messageApi, contextHolder] = message.useMessage();
  const { setuserInfo }: any = useContext(InfoContext);

  const generateHash = async (data: string) => {
    const wordArray = CryptoJS.enc.Hex.parse(data);
    const hash = CryptoJS.SHA256(wordArray)
    const hashHex = hash.toString(CryptoJS.enc.Hex)
    const last20Chars = hashHex.slice(-40)
    return last20Chars;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Login attempt", { username, password })
    const Params = {
      name: username,
      // pass_word: '3UTiPP5EqDWGdyb3FYDBl'
      // pass_word: btoa(password)
      pass_word: password
    }
    fetchLogin(Params)
      .then((res) => {

        setuserInfo(username)
        if (res) {
          const { data } = res
          const { token } = data
          generateHash(token).then(hash => {
            messageApi.open({
              type: 'success',
              content: 'ログインに成功しました',
            });
            localStorage.setItem('token', hash)
            // document.cookie = `access_token=${encodeURIComponent(hash)}`;
            // document.cookie = `access_name=${username}`;
            document.cookie = `access_token=${encodeURIComponent(hash)};Secure; SameSite=None;Domain=crypato.com`;
            document.cookie = `access_name=${username};Secure; SameSite=None;Domain=crypato.com`;
            localStorage.setItem('user', username)
            localStorage.setItem('isLogin', 'true')
            history.push('/admin')
          })
        }


      })
      .catch((err) => {
        messageApi.open({
          type: 'error',
          content: err.message,
        });
        localStorage.setItem('isLogin', 'false')
      });
  }
  useEffect(() => {
    // const cookies = document.cookie;
    // 检查特定 Cookie 是否存在
    // const access_tokenFlag = cookies.split(';').some(cookie => cookie.trim().startsWith(`access_token=`));
    // const access_namelag = cookies.split(';').some(cookie => cookie.trim().startsWith(`access_name=`));
    const userInfo = localStorage.getItem('user')
    const tokenInfo = localStorage.getItem('token')

    if (userInfo && tokenInfo) {
      history.push('/admin')
    }

    return () => {

    }
  }, [])

  return (
    <div className={styles.loginContainer}>
      {contextHolder}
      <div className={styles.loginBox}>
        <h2 className={styles.title}>ログイン</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">ユーザー名</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            ログイン
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

