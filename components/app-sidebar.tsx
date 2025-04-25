'use client'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'

import { AppSearch } from '@/components/app-search'
import { VersionSwitcher } from '@/components/version-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useEffect } from 'react'
import { MessageSquare, PlusIcon, MoreHorizontalIcon } from 'lucide-react'
import { createConversation, deleteConversation, fetchConversations } from '@/store/conversations'
import { Conversation } from '@/models'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui'
import { setCurrentConversation, startChat } from '@/store/session'
import { greet } from '@/store/messages'
import { useServer } from '@/context/server'
import { APP_INFO } from '@/config'
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const server = useServer()
  const dispatch = useDispatch<AppDispatch>()
  const { value: conversations, loading, error, fufilled } = useSelector((state: RootState) => state.conversations)
  const session = useSelector((state: RootState) => state.session)
  const { t } = useTranslation()

  const handleConversationIdChange = (conversation: Conversation) => {
    dispatch(setCurrentConversation(conversation.id))
    dispatch(startChat())
  }

  const handleDeleteConversation = async (conversationId: string) => {
    await dispatch(deleteConversation(conversationId))
    dispatch(setCurrentConversation(''))
  }

  const handleRenameConversation = (conversationId: string) => {
    console.log(conversationId)
  }

  const handleCreateConversation = () => {
    dispatch(createConversation())
    dispatch(setCurrentConversation('-1'))
    dispatch(startChat())
    dispatch(greet(server.config.openingStatement))
  }

  // init
  useEffect(() => {
    if (APP_INFO.useHistory) {
      if (!fufilled) {
        dispatch(fetchConversations())
      }
    }
    else {

    }
  }, [])

  const versions = ['1.0.1', '1.1.0-alpha', '2.0.0-beta1']
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={versions}
          defaultVersion={versions[0]}
        />
        <AppSearch />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        <SidebarGroup>
          <SidebarGroupLabel>历史对话</SidebarGroupLabel>
          <SidebarGroupAction title="新建对话" onClick={handleCreateConversation}>
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((c: Conversation) => (
                <SidebarMenuItem key={c.id} onClick={() => handleConversationIdChange(c)}>
                  <SidebarMenuButton asChild
                    isActive={c.id === session.currentConversation}>
                    <a href={`#${c.id}`}>
                      <MessageSquare /> {c.name}
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontalIcon />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem onClick={() => handleRenameConversation(c.id)}>
                        <span>改名</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteConversation(c.id)}>
                        <span>删除</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
