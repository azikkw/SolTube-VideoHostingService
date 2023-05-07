export interface AuthToken {
  user_id: number
  token: string
}

export interface User {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  avatar: string,
  description: string,
}

export interface Subscription {
  chanelId: User,
  followerId: number
}

export interface Category {
  id: number,
  name: string
}

export interface Video {
  id: number,
  owner: User,
  category: Category,
  title: string,
  description: string,
  video_url: string,
  image_url: string,
  total_views: number,
  upload_time: Date,
  total_duration: string
}

export interface VideoAndUser {
  user: User,
  video: Video,
}

