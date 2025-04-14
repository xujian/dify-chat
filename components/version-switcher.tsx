'use client'
import { FC, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui'

export type VersionSwitcherProps = {
  versions: string[]
  defaultVersion: string
}

export const VersionSwitcher: FC<VersionSwitcherProps> = ({
  versions,
  defaultVersion,
}) => {
  const [selectedVersion, setSelectedVersion] = useState(defaultVersion)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <img src="/logo.png" alt="logo" width={32} height={32} />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">智慧客户专员</span>
                <span className="">v{selectedVersion}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
            {versions.map((version) => (
              <DropdownMenuItem key={version} onSelect={() => setSelectedVersion(version)}>
                v{version} {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}


