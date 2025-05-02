// types/tweet.ts
export interface Tweet {
    id: number | string
    account_id: string
    text: string
    image?: string | null
    likes: number
    retweets: number
    replies: number
    views: number
    datetime: string
    location?: string | null
    delete_flag: number
  }
  