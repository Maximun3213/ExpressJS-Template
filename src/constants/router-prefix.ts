const ROUTE_PREFIX = {
  USERS: '/users',
  FRIENDSHIPS: '/friendships'
} as const

export type RoutePrefix = (typeof ROUTE_PREFIX)[keyof typeof ROUTE_PREFIX]

export default ROUTE_PREFIX
