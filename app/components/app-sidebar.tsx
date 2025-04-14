'use client'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/app/store'

import { AppSearch } from '@/app/components'
import { VersionSwitcher } from '@/app/components'
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
} from '@/app/components/ui/sidebar'
import { useEffect } from 'react'
import { MessageSquare, PlusIcon, MoreHorizontalIcon } from 'lucide-react'
import { addConversation, deleteConversation, fetchConversations } from '@/app/store/conversations'
import { Conversation } from '@/models'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui'
import { setCurrentConversation, startChat } from '@/app/store/session'
import { greet } from '@/app/store/messages'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const serverConfig = useSelector((state: RootState) => state.server)
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

  const createConversation = () => {
    const conversation = {
      id: '-1',
      name: '新对话',
      introduction: '',
      inputs: {}
    }
    dispatch(addConversation(conversation))
    dispatch(greet(serverConfig.openingStatement))
    dispatch(setCurrentConversation('-1'))
    dispatch(startChat())
  }

  // init
  useEffect(() => {
    if (!fufilled) {
      dispatch(fetchConversations())
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
          <SidebarGroupAction title="新建对话" onClick={createConversation}>
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
