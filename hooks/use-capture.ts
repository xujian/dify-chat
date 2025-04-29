// screen capture hook
// the screen capture capability is provided by an other tab or the parent window
// this hook is used to emit a capture event to the parent window
// and receive the captured image from the parent window
// use Broadcast Channel API to send and receive messages between the parent and the child window

import { Media } from '@/models'

type CapturePostMessage = {
  type: string,
  image: Media
}

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

  const capture: () => Promise<Media | null> = () => {
    const parent = window.parent
    if (!parent) {
      console.log('no parent window')
      return Promise.resolve(null)
    }

    parent.postMessage({ type: 'capture' })
    return new Promise<Media | null>((resolve, reject) => {
      const callback = (message: MessageEvent<CapturePostMessage>) => {
        console.log('on captured image', message)
        if (message.data.type === 'captured') {
          window.removeEventListener('message', callback)
          resolve(message.data.image as Media)
        } else {
        }
      }
      window.addEventListener('message', callback)
    })
  }
  return { capture }
}

