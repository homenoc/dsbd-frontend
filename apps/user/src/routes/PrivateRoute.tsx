import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export const PrivateRoute: React.VFC<{
  children: ReactNode
}> = (props) => {
  const condition = loginStatus()
  const { children } = props

  return condition ? <>{children}</> : <Navigate to="/login" />
}

const loginStatus = () => {
  return (
    Cookies.get('access_token') !== undefined &&
    Cookies.get('user_token') !== undefined
  )
}
