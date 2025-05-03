export interface ScheduledTweet {
    id: number;
    account_id: string;
    text: string;
    image?: string;
    location?: string;
    scheduled_datetime: string;
    created_datetime: string;
    delete_flag: number;
  }
  
  export const mockScheduledTweets: ScheduledTweet[] = [
    {
      id: 1,
      account_id: 'q30387',
      text: 'ツイート内容1',
      image: '/src/assets/images/img01.GIF',
      location: '東京都',
      scheduled_datetime: '2025-04-19T00:00:10',
      created_datetime: '2025-04-19T00:00:00',
      delete_flag: 0,
    },
    {
      id: 2,
      account_id: 'user_A',
      text: 'ツイート内容2',
      image: '/src/assets/images/img02.jpg',
      location: '大阪府',
      scheduled_datetime: '2025-04-19T00:00:20',
      created_datetime: '2025-04-19T00:00:00',
      delete_flag: 0,
    },
    {
      id: 3,
      account_id: 'user_B',
      text: 'ツイート内容3',
      image: '/src/assets/images/img03.jpg',
      location: '北海道',
      scheduled_datetime: '2025-04-19T00:00:30',
      created_datetime: '2025-04-19T00:00:00',
      delete_flag: 0,
    },
    {
      id: 4,
      account_id: 'user_C',
      text: 'ツイート内容4',
      image: '/src/assets/images/img04.jpg',
      location: '福岡県',
      scheduled_datetime: '2025-04-19T00:00:40',
      created_datetime: '2025-04-19T00:00:00',
      delete_flag: 0,
    },
    {
      id: 5,
      account_id: 'q30387',
      text: 'ツイート内容5',
      image: '/src/assets/images/img05.jpg',
      location: '愛知県',
      scheduled_datetime: '2025-04-19T00:00:50',
      created_datetime: '2025-04-19T00:00:00',
      delete_flag: 0,
    },
  ];
  