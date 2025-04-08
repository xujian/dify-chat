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
import { deleteConversation, fetchConversations } from '@/app/store/conversations'
import { ConversationItem } from '@/types/app'
import { MessageSquare, PlusIcon, MoreHorizontalIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui'
import { setCurrentConversation } from '@/app/store/session'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>()
  const { value: conversations, loading, error } = useSelector((state: RootState) => state.conversations)
  const session = useSelector((state: RootState) => state.session)
  const { t } = useTranslation()

  const handleConversationIdChange = (conversation: ConversationItem) => {
    dispatch(setCurrentConversation(conversation))
  }

  const handleDeleteConversation = (conversationId: string) => {
    dispatch(deleteConversation(conversationId))
  }

  // init
  useEffect(() => {
    dispatch(fetchConversations())
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
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((c: ConversationItem) => (
                <SidebarMenuItem key={c.id} onClick={() => handleConversationIdChange(c)}>
                  <SidebarMenuButton asChild
                    isActive={c.id === session.currentConversation?.id}>
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
                      <DropdownMenuItem>
                        <span>Edit Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteConversation(c.id)}>
                        <span>Delete Project</span>
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
