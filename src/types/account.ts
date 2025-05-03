// types/account.ts
export interface Account {
    id: string
    name: string
    bio: string
    icon?: string
    header_photo: string
    location: string
    birthday: string
    registered: string
    following: number
    follower: number
    valid_flag: number
    delete_flag: number
  }
  