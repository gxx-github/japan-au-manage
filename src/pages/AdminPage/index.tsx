"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import styles from "./index.less"
import EventList from "../List"
import {history} from 'umi'
import UserDom from "../User"
import { InfoContext } from "@/components/InfoProvider"

const AdminPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const { userInfo }: any = useContext(InfoContext);

  const handleLogout = () => {
    // 处理登出逻辑
    localStorage.removeItem('isLogin')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    document.cookie = `access_token=${encodeURIComponent('')}`
    document.cookie = `access_name=`;

    history.push('/')
  }
  useEffect(() => {
      if(localStorage.getItem('isLogin')!== 'true'){
        history.push('/')
      }
    return () => {
    }
  }, [localStorage.getItem('isLogin')])
  return (
    <div className={styles.adminContainer}>
      {/* 左侧菜单 */}
      <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>{collapsed ?'au' : 'au NFT AirDrop'}</div>
          <div className={styles.collapseButton} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? ">" : "<"}
          </div>
        </div>

        <div className={styles.menuList}>
          <div
            className={`${styles.menuItem} ${activeMenu === "dashboard" ? styles.active : ""}`}
            onClick={() => setActiveMenu("dashboard")}
          >
            <div className={styles.menuIcon}>📊</div>
            {!collapsed && <span>プレビュー</span>}
          </div>

          <div
            className={`${styles.menuItem} ${activeMenu === "user" ? styles.active : ""}`}
            onClick={() => setActiveMenu("user")}
          >
            <div className={styles.menuIcon}>📝</div>
            {!collapsed && <span>ユーザーリスト</span>}
          </div>

          {/* <div
            className={`${styles.menuItem} ${activeMenu === "settings" ? styles.active : ""}`}
            onClick={() => setActiveMenu("settings")}
          >
            <div className={styles.menuIcon}>⚙️</div>
            {!collapsed && <span>系统设置</span>}
          </div> */}

           

        </div>
        <div className={styles.addButton} onClick={()=>{
            history.push('/uploadForm')
        }}>
            {
                !collapsed ? 'プロジェクト追加' : '➕'
            }
                
            </div>
      </div>

      {/* 右侧内容区 */}
      <div className={styles.mainContent}>
        {/* 顶部标头 */}
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.username}>{ userInfo || localStorage.getItem('user')  }</span>
            <div className={styles.logoutBtn} onClick={handleLogout}>
            サインアウト
            </div>
          </div>
        </div>

        {/* 主要内容区 */}
        <div className={styles.content}>
          {activeMenu === "dashboard" && (
           <EventList></EventList>
          )}
          {activeMenu === "user" && <>
            <UserDom></UserDom>
            </>}
        </div>
      </div>
    </div>
  )
}

export default AdminPage

