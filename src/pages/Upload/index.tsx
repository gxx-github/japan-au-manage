import type React from "react"
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import styles from './index.less'
import { fetchCreatNft, fetchExport } from "@/api/home"
import { message } from "antd";
import { history } from "umi";


interface FormData {
  logo: string
  nft_name: string
  info: string
  start_timestamp: number
  end_timestamp: number
  nft_address: string
  chain: string
}

const UploadForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState<FormData>({
    logo: '',
    nft_name: "",
    info: "",
    start_timestamp: 0,
    end_timestamp: 0,
    nft_address: '',
    chain: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
    const formDataToSubmit = {
      ...formData,
      start_timestamp: new Date(formData.start_timestamp).getTime() / 1000, // Convert to Unix timestamp
      end_timestamp: new Date(formData.end_timestamp).getTime() / 1000, // Convert to Unix timestamp
    };
    fetchCreatNft(formDataToSubmit)
      .then((res) => {
        messageApi.open({
          type: 'success',
          content: '领取成功',
        });
        history.push('/admin')
      })
      .catch((err) => {
        messageApi.open({
          type: 'error',
          content: err.message,
        });
      });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData(() => ({
          ...formData,
          logo: base64String,
        }))
      }
      reader.readAsDataURL(file)
    }
  }
  useEffect(() => {
    if (localStorage.getItem('isLogin') !== 'true') {
      history.push('/')
    }
    return () => {
    }
  }, [localStorage.getItem('isLogin')])

  return (
    <div className={styles['uploadDom']}>
      {contextHolder}
      <form className={styles["upload-form"]} onSubmit={handleSubmit}>
        <h2>プロジェクト追加</h2>
        <div className={styles["form-group"]}>
          <label htmlFor="nft_name">Logo:(w:204,h:68,{'size<=2M'})</label>
          {/* <input type="text" id="logo" name="logo" value={formData.logo} onChange={handleInputChange} required /> */}
          <input type="file" accept="image/*" name="logo" onChange={handleFileChange} ref={fileInputRef} required />
          {formData.logo && <img src={formData.logo} alt="" className={styles.imgShow} />}
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="nft_name">プロジェクト名:</label>
          <input type="text" id="nft_name" name="nft_name" value={formData.nft_name} onChange={handleInputChange} required />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="nft_address">NFTスマートコントラクトアドレス:</label>
          <input type="text" id="nft_address" name="nft_address" value={formData.nft_address} onChange={handleInputChange} required />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="chain">BlockChain:</label>
          <input type="text" id="chain" name="chain" value={formData.chain} onChange={handleInputChange} required />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="info">プロジェクト紹介:</label>
          <textarea id="info" name="info" value={formData.info} onChange={handleInputChange} required />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="start_timestamp">開始時間:</label>
          <input
            type="datetime-local"
            id="start_timestamp"
            name="start_timestamp"
            value={formData.start_timestamp}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="end_timestamp">終了時間:</label>
          <input
            type="datetime-local"
            id="end_timestamp"
            name="end_timestamp"
            value={formData.end_timestamp}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* <div className={styles["form-group"]}>
          <label htmlFor="access_token">access_token:</label>
          <input type="text" id="access_token" name="access_token" value={formData.access_token} onChange={handleInputChange} required />
        </div> */}
        <button type="submit" className={styles["submit-button"]}>
          確認
        </button>
      </form>


    </div>

  )
}

export default UploadForm

