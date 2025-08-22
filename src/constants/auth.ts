const AUTH = {
  ACCESS_TOKEN_HEADER: 'Authorization',
  REFRESH_TOKEN_HEADER: 'Refresh-Token',
  CSRF_TOKEN_HEADER: '_rf'
} as const

export type Auth = (typeof AUTH)[keyof typeof AUTH]

export default AUTH
