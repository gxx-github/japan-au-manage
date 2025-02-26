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

    history.push('/login')
  }
  useEffect(() => {
      if(localStorage.getItem('isLogin')!== 'true'){
        history.push('/login')
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
            {!collapsed && <span>预览</span>}
          </div>

          <div
            className={`${styles.menuItem} ${activeMenu === "user" ? styles.active : ""}`}
            onClick={() => setActiveMenu("user")}
          >
            <div className={styles.menuIcon}>📝</div>
            {!collapsed && <span>用户列表</span>}
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
                !collapsed ? 'Add Project' : '➕'
            }
                
            </div>
      </div>

      {/* 右侧内容区 */}
      <div className={styles.mainContent}>
        {/* 顶部标头 */}
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            {/* 首页 / {activeMenu === "dashboard" && "仪表盘"}
            {activeMenu === "user" && "用户管理"}
            {activeMenu === "products" && "产品管理"}
            {activeMenu === "orders" && "订单管理"}
            {activeMenu === "settings" && "系统设置"} */}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.username}>{ userInfo || localStorage.getItem('user')  }</span>
            <div className={styles.logoutBtn} onClick={handleLogout}>
              退出
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
          {/* {activeMenu === "products" && <div>产品管理内容</div>} */}
          {/* {activeMenu === "orders" && <div>订单管理内容</div>} */}
          {activeMenu === "settings" && <div>系统设置内容</div>}
        </div>
      </div>
    </div>
  )
}

export default AdminPage

