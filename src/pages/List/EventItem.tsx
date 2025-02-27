import type React from "react"
import type { Event } from "./Event"
import styles from "./index.less"
import moment from 'moment';

interface EventeventProps {
    event: Event
    onEdit: () => void
    onDelete: () => void
    onDownLoad: () => void
}

const Eventevent: React.FC<EventeventProps> = ({ event, onEdit, onDelete, onDownLoad }) => {
    return (
        <div className={styles.eventevent}>

            <div className={styles.eventDom}  >
                <div className={styles.leftDom} >
                    <img src={event.spend} alt="" />
                    <div className={styles.start}>開始日時:
                        <span>{event.start_timestamp && moment(event.start_timestamp * 1000).format('YYYY-MM-DD HH:mm')}</span>
                    </div>
                    <div className={styles.end} >終了日時:
                        <span>{event.end_timestamp && moment(event.end_timestamp * 1000).format('YYYY-MM-DD HH:mm')}</span></div>
                </div>
                <div className={styles.rightDom} >
                    <div className={styles.titDom} >
                        <div className={styles.tit}>{event.nft_name}</div>
                    </div>
                    <div className={styles.des} >{event.info}</div>
                </div>

            </div>

            <div className={styles.actions}>
                <button onClick={onEdit}>編集</button>
                <button onClick={onDelete}>削除</button>
                <button onClick={onDownLoad}>ダウンロード</button>
            </div>
        </div>
    )
}

export default Eventevent

