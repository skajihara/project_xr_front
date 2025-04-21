export interface Account {
    id: string;
    name: string;
    bio: string;
    icon: string;
    header_photo: string;
    location: string;
    birthday: string;
    registered: string;
    following: number;
    follower: number;
    valid_flag: number;
    delete_flag: number;
  }
  
  export const mockAccounts: Account[] = [
    {
      id: 'q30387',
      name: 'Shingo Kajihara',
      bio: '最近はVue.jsを学習中です。',
      icon: '/src/assets/icons/user/myicon.svg',
      header_photo: '/src/assets/images/header/h01.jpg',
      location: '東京都',
      birthday: '1985-05-23',
      registered: '2015-06-15',
      following: 10,
      follower: 15,
      valid_flag: 1,
      delete_flag: 0,
    },
    {
      id: 'user_current',
      name: 'CurrentUser',
      bio: 'コーディング中………',
      icon: '/src/assets/icons/user/myicon.svg',
      header_photo: '/src/assets/images/header/h02.jpg',
      location: '大阪府',
      birthday: '1990-09-12',
      registered: '2018-02-20',
      following: 20,
      follower: 25,
      valid_flag: 1,
      delete_flag: 0,
    },
    {
      id: 'user_A',
      name: 'Test User A',
      bio: 'user_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      icon: '/src/assets/icons/user/kkrn_icon_user_12.svg',
      header_photo: '/src/assets/images/header/h03.jpg',
      location: '愛知県',
      birthday: '1988-04-10',
      registered: '2016-05-17',
      following: 5,
      follower: 7,
      valid_flag: 1,
      delete_flag: 0,
    },
    {
      id: 'user_B',
      name: 'Test User B',
      bio: 'user_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      icon: '/src/assets/icons/user/kkrn_icon_user_14.svg',
      header_photo: '/src/assets/images/header/h04.jpg',
      location: '神奈川県',
      birthday: '1992-11-01',
      registered: '2017-07-25',
      following: 3,
      follower: 10,
      valid_flag: 1,
      delete_flag: 0,
    },
    {
      id: 'user_C',
      name: 'Test User C',
      bio: 'user_cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      icon: '/src/assets/icons/user/kkrn_icon_user_3.svg',
      header_photo: '/src/assets/images/header/h05.jpg',
      location: '千葉県',
      birthday: '1985-03-13',
      registered: '2011-09-19',
      following: 8,
      follower: 12,
      valid_flag: 1,
      delete_flag: 0,
    },
  ];
  