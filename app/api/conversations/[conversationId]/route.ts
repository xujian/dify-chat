import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export async function DELETE(request: NextRequest, { params }: {
  params: { conversationId: string }
}) {
  const { conversationId } = params
  const { user } = getInfo(request)
  try {
    const { data }: any = await client.deleteConversation(conversationId, user)
    return NextResponse.json(data, {
    })
  }
  catch (error: any) {
    return NextResponse.json({
      data: [],
      error: error.message,
    })
  }
}
