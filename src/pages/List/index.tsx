"use client"

import type React from "react"
import { useState, useEffect, useContext } from "react"
import type { Event } from "./Event"
import styles from "./index.less"
import EventItem from "./EventItem"
import EventForm from "./EventForm"
import { fetchDelet, fetchGetNftList } from "@/api/home";
import { history } from "umi";
import { message } from "antd";
import { InfoContext } from "@/components/InfoProvider"


const EventList: React.FC = () => {
    const TabList = ['Upcoming', 'Live', 'Ended']
        const { curChooise,setcurChooise }: any = useContext(InfoContext);
    
    const [messageApi, contextHolder] = message.useMessage();

    const [events, setEvents] = useState<Event[]>([])
    const [isAddingEvent, setIsAddingEvent] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    
    const handleTab = (index: number) => {
        setcurChooise(index)
    }
    const getNftListQuery = (state: number) => {
        const Params = {
            "state": state, // 0 未开始 1 进行中 2 已结束
            "page": 1,
            "limit": 50
        }
        fetchGetNftList(Params)
            .then((res) => {
                const data = res.data;
                const { nft } = data
                setEvents(nft)

            })
            .catch(() => {
                setEvents([])

            });
    }

    useEffect(() => {
        getNftListQuery(curChooise)
    }, [curChooise,editingEvent])


    const handleAddEvent = (newEvent: Omit<Event, "id">) => {
        const event: any = { ...newEvent, }
        setEvents([...events, event])
        setIsAddingEvent(false)
    }

    const handleEditEvent = (updatedEvent: Event) => {
        setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
        setEditingEvent(null)
    }

    const handleDeleteEvent = (id: number,nft_address:string) => {
        const Params = {
            nft_id: id,
            address: nft_address
        }
        fetchDelet(Params)
            .then((res) => {
                messageApi.open({
                    type: 'success',
                    content: '削除されました',
                });
                getNftListQuery(curChooise)
            })
            .catch(() => {
                messageApi.open({
                    type: 'error',
                    content: 'request error',
                });

            });
    }
    const handleDodnLoadEvent = async (id: number, address: string) => {
        const downDataParams = {
            nft_id: Number(id),
            address: address
        };
        try {
            document.cookie = `access_token=${localStorage.getItem('token')};Secure; SameSite=None;Domain=crypato.com`;
            document.cookie = `access_name=${localStorage.getItem('user')};Secure; SameSite=None;Domain=crypato.com`;
            const response = await fetch(`https://api.crypato.com/api/privasea/export`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    // 如果需要，在这里添加认证头
                },
                body: JSON.stringify(downDataParams),
            })
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.style.display = "none"
            a.href = url
            a.download = "data.xlsx"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Download failed:", error)
            messageApi.open({
                type: 'error',
                content: 'Download failed. Please try again later.',
            });
        } finally {

        }
    }

    return (
        <div className={styles.eventList}>
            {contextHolder}
            <div className={styles.tabs}>
                {
                    TabList.map((item, index) => {
                        return <button key={index} className={curChooise === index ? styles.active : ''} onClick={() => handleTab(index)} >{item}</button>
                    })
                }
            </div>

            {isAddingEvent && <EventForm onSubmit={handleAddEvent} onCancel={() => setIsAddingEvent(false)} />}
            {editingEvent && (
                <EventForm event={editingEvent} onSubmit={handleEditEvent} onCancel={() => setEditingEvent(null)} />
            )}
            {events.length > 0 ? events.map((event) => (
                <EventItem
                    key={event.id}
                    event={event}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={() => handleDeleteEvent(event.id,event.nft_address)}
                    onDownLoad={() => handleDodnLoadEvent(event.id, event.nft_address)}
                />
            )) : <div className={styles.empty}>Empty Data~</div>
            }
        </div>
    )
}

export default EventList

