export interface Tweet {
    id: number;
    account_id: string;
    text: string;
    image?: string | null;
    likes: number;
    retweets: number;
    replies: number;
    views: number;
    datetime: string;
    location?: string | null;
    delete_flag: number;
  }
  
  export const mockTweets: Tweet[] = [
    {
      id: 1,
      account_id: 'user_A',
      text: '富山のホタルイカ、最高🍻',
      image: '/src/assets/images/img02.jpg',
      likes: 9,
      retweets: 23,
      replies: 7,
      views: 14,
      datetime: '2024-03-01T15:30:00',
      location: '富山県滑川市',
      delete_flag: 0,
    },
    {
      id: 2,
      account_id: 'user_B',
      text: '夜間はライトアップも実施「令和6年度 八女黒木大藤まつり」開催！',
      image: '/src/assets/images/img03.jpg',
      likes: 301,
      retweets: 2,
      replies: 0,
      views: 124,
      datetime: '2024-03-03T11:23:55',
      location: '福岡県八女市',
      delete_flag: 0,
    },
    {
      id: 3,
      account_id: 'user_C',
      text: 'プレゼントキャンペーン🎁',
      image: '/src/assets/images/img04.jpg',
      likes: 30133,
      retweets: 2322,
      replies: 792,
      views: 140230,
      datetime: '2024-03-10T00:21:51',
      location: '東京都江東区',
      delete_flag: 0,
    },
    {
      id: 4,
      account_id: 'user_D',
      text: 'ガチャ爆死したなう',
      image: '/src/assets/images/img01.GIF',
      likes: 13,
      retweets: 3,
      replies: 2,
      views: 140,
      datetime: '2024-03-18T20:10:01',
      location: '東京都江東区',
      delete_flag: 0,
    },
    {
      id: 5,
      account_id: 'user_E',
      text: 'コカ・コーラ 500ml×24本がクーポンと定期お得便で1691円に #広告',
      image: '/src/assets/images/img01.GIF',
      likes: 23301,
      retweets: 232,
      replies: 7333,
      views: 149934,
      datetime: '2024-03-29T15:30:11',
      location: null,
      delete_flag: 0,
    },
  ];
  