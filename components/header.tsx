'use client'
import type { FC } from 'react'
import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { APP_INFO } from '@/config'
export type IHeaderProps = {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  return (
    <div className="header shrink-0 flex items-center justify-between h-12 px-3 bg-gray-100">
      {APP_INFO.useHistory && <SidebarTrigger />}
    </div>
  )
}

export default React.memo(Header)
