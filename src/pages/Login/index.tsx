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
    // const encoder = new TextEncoder();
    // const dataBuffer = encoder.encode(data);
    // const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    // const hashArray = Array.from(new Uint8Array(hashBuffer));
    // const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // const hash = CryptoJS.SHA256(data).toString();

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
              content: '登录成功',
            });
            localStorage.setItem('token', hash)
            document.cookie = `access_token=${encodeURIComponent(hash)}`;
            document.cookie = `access_name=${username}`;
            localStorage.setItem('user', username)
            localStorage.setItem('isLogin', 'true')
            history.push('/admin')
          })
        }


      })
      .catch((err) => {
        messageApi.open({
          type: 'error',
          content:err.message ,
        });
        localStorage.setItem('isLogin', 'false')


      });
    // generateHash(password).then(hash => {
    // localStorage.setItem('token',hash)
    // document.cookie = `access_token=${encodeURIComponent(hash)}`;
    //   const Params = {
    //     name:username,
    //     pass_word:password
    //   }
    //   fetchLogin(Params)
    //   .then((res) => {
    //     messageApi.open({
    //       type: 'success',
    //       content: '登录成功',
    //     });
    //     setuserInfo(username)
    //     localStorage.setItm('user',username)
    //     localStorage.setItem('isLogin','true')
    //     history.push('/admin')

    //   })
    //   .catch(() => {
    //     messageApi.open({
    //       type: 'error',
    //       content: 'Request failed ',
    //     });
    //     localStorage.setItem('isLogin','false')


    //   });
    // }).catch(()=>{
    //   messageApi.open({
    //     type: 'error',
    //     content: '',
    //   });
    // })

  }

  return (
    <div className={styles.loginContainer}>
      {contextHolder}
      <div className={styles.loginBox}>
        <h2 className={styles.title}>登录</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">用户名</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            登录
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

