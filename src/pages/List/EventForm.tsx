"use client"

import type React from "react"
import { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from "react"
import type { Event } from "./Event"
import styles from "./index.less"
import { fetchCreatNft, fetchExport } from "@/api/home"
import moment from 'moment';
import { message } from "antd";

interface FormData {
    spend: string
    nft_name: string
    info: string
    start_timestamp: number
    end_timestamp: number
    nft_address: string
    chain?: string
}
interface EventFormProps {
    event?: Event
    onSubmit: (event: any) => void
    onCancel: () => void
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, onCancel }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(event?.spend || null)
    const fileInputRef = useRef<HTMLInputElement>(null)


    const [formData, setFormData] = useState<FormData>({
        spend: '',
        nft_name: "",
        info: "",
        start_timestamp: 0,
        end_timestamp: 0,
        nft_address: '',
        chain:''
    })

    const [messageApi, contextHolder] = message.useMessage();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === "start_timestamp" || name === "end_timestamp") {
            const timestamp = new Date(value).getTime() / 1000
            setFormData((prev) => ({ ...prev, [name]: timestamp }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }
    const handleSubmit = (e: any) => {
        e.preventDefault()
        const formDataToSubmit = {
            chain:formData.chain,
            info: formData.info,
            nft_address: formData.nft_address,
            nft_name: formData.nft_name,
            logo: formData.spend,
            start_timestamp: formData.start_timestamp, // Convert to Unix timestamp
            end_timestamp: formData.end_timestamp, // Convert to Unix timestamp
        };
        
        fetchCreatNft(formDataToSubmit)
            .then((res) => {
                messageApi.open({
                    type: 'success',
                    content: '変更に成功しました',
                });
                setTimeout(() => {
                    onSubmit(e)
                }, 1000);
            })
            .catch(() => {
                messageApi.open({
                    type: 'error',
                    content: 'request error',
                });
            });
    }
    const formatDateForInput = (timestamp: number) => {
        return moment(timestamp * 1000).format('YYYY-MM-DDTHH:mm')
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            setPreviewUrl(base64String)
            setFormData(
                {
                    ...formData,
                    spend:base64String
                }
            )
          }
          reader.readAsDataURL(file)
        }
      }

      const handleButtonClick = (e:any) => {
        e.preventDefault()
        fileInputRef.current?.click()
      }

    useEffect(() => {
        if (event) {
            setFormData({
                ...event,
                start_timestamp: event.start_timestamp,
                end_timestamp: event.end_timestamp,
            })
        }

        return () => {

        }
    }, [event])


    return (
        <form className={styles["upload-form"]} >
            {contextHolder}
            <div className={styles["form-con"]}>
                <h2>編集</h2>
                <div className={styles["form-group"]}>
                    <label htmlFor="nft_name">logo:</label>
                    {/* <input type="text" id="logo" name="logo" value={formData.spend} onChange={handleInputChange} required /> */}
                    <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className={styles.fileInput} />
                    {previewUrl ? (
                        <div className={styles.imagePreview}>
                            <img src={previewUrl || "/placeholder.svg"} alt="Preview" />
                            <div className={styles.imageActions}>
                                <button onClick={handleButtonClick} className={styles.editButton}>
                                画像を変更する
                                </button>
                                {/* <button onClick={handleRemoveImage} className={styles.removeButton}>
                                    删除图片
                                </button> */}
                            </div>
                        </div>
                    ) : (
                        <button onClick={handleButtonClick} className={styles.uploadButton}>
                            画像を選択
                        </button>
                    )}
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
                        value={formatDateForInput(formData.start_timestamp)}
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
                        value={formatDateForInput(formData.end_timestamp)}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles["submit-buttons"]} >
                    <div className={styles["submit-button"]} onClick={handleSubmit} >
                    提出
                    </div>
                    <div className={styles["submit-button"]} onClick={onSubmit}>
                    キャンセル
                    </div>
                </div>


            </div>
        </form>
    )
}

export default EventForm

