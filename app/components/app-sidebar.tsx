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
import { deleteConversation, fetchConversations, newConversation } from '@/app/store/conversations'
import { Conversation } from '@/models'
import { MessageSquare, PlusIcon, MoreHorizontalIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui'
import { setCurrentConversation } from '@/app/store/session'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>()
  const { value: conversations, loading, error, fufilled } = useSelector((state: RootState) => state.conversations)
  const session = useSelector((state: RootState) => state.session)
  const { t } = useTranslation()

  const handleConversationIdChange = (conversation: Conversation) => {
    dispatch(setCurrentConversation(conversation))
  }

  const handleDeleteConversation = async (conversationId: string) => {
    await dispatch(deleteConversation(conversationId))
    dispatch(setCurrentConversation(conversations[0]))
  }

  const createConversation = () => {
    dispatch(newConversation())
    dispatch(setCurrentConversation(conversations[conversations.length - 1]))
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
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project" onClick={createConversation}>
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((c: Conversation) => (
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
