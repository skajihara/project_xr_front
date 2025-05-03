// types/scheduledTweet.ts
export interface ScheduledTweet {
    id: number | string
    account_id: string
    text: string
    image?: string | null
    location?: string | null
    scheduled_datetime: string
    created_datetime: string
    delete_flag: number
  }
  