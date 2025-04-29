// screen capture hook
// the screen capture capability is provided by an other tab or the parent window
// this hook is used to emit a capture event to the parent window
// and receive the captured image from the parent window
// use Broadcast Channel API to send and receive messages between the parent and the child window

import { useEffect } from 'react'

/**
 * Usage:
 * 
 * const { capturedImage, capture } = useCapture()
 * 
 * capture().then((image: File) => {
 *  console.log(image)
 * })
 */

/**
 * Screen Capture Hook
 */
export const useCapture = () => {

  let channel: BroadcastChannel | null = null

  const capture: () => Promise<File> = () => {
    channel!.postMessage({ type: 'capture' })
    return new Promise((resolve, reject) => {
      channel!.onmessage = ({ data }) => {
        console.log('on captured image', data)
        if (data.type === 'captured') {
          resolve(data.image as File)
        }
      }
    })
  }

  // close the channel when the component unmounts
  useEffect(() => {
    channel = new BroadcastChannel('capture')
    return () => {
      console.log('closing channel')
      channel!.close()
    }
  }, [])

  return { capture }
}

