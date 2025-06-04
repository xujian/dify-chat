import { useEffect, useRef, useState, type FC } from 'react'
import { createPortal } from 'react-dom'
import { CircleX } from 'lucide-react'

type ImagePreviewProps = {
  url: string
  onCancel: () => void
}
const ImagePreview: FC<ImagePreviewProps> = ({
  url,
  onCancel,
}) => {
  const [zoom, setZoom] = useState(0)
  let maxZoom = useRef(0), minZoom = useRef(0)

  useEffect(() => {
    // zoom from fit (contain) to actual size of the image
    console.log('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)url', url)
    const img = new Image()
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight,
        cw = window.innerWidth, ch = window.innerHeight
      maxZoom.current = w * 100 / cw
      // calculate the absolute width/height ratio
      const
        /**
         * 图片的高宽比
         */
        r = h / w,
        /**
         * 窗口的高宽比
         */
        cr = ch / cw
      minZoom.current = Math.min(
        w > cw
          // 图片比窗口细长
          ? r > cr
            ? 100 * cr / r
            : 100
          // 图片不足以填满
          : w * 100 / cw
      )
      setZoom(minZoom.current)
      console.log('maxZoom', maxZoom, 'minZoom', minZoom)
    }
    img.src = url
  }, [url])

  const onWheel = ({ deltaY }: React.WheelEvent<HTMLDivElement>) => {
    setZoom(deltaY > 0
      ? Math.min(zoom + 10, maxZoom.current)
      : Math.max(zoom - 10, minZoom.current))
  }

  return createPortal(
    <div className='fixed inset-0 p-0 flex items-center justify-center bg-black/80 z-1000'
      onClick={e => e.stopPropagation()}>
      <div className='w-full h-full bg-no-repeat bg-center'
        style={{
          transition: 'object-fit 0.3s ease-in-out',
          backgroundImage: `url(${url})`,
          backgroundSize: `${zoom}%`
        }}
        onWheel={onWheel}>
      </div>
      <div
        className='absolute top-6 right-6 flex items-center justify-center w-8 h-8 bg-white/[0.08] rounded-lg backdrop-blur-[2px] cursor-pointer'
        onClick={onCancel}>
        <CircleX className='w-4 h-4 text-white' />
      </div>
    </div>,
    document.body,
  )
}

export default ImagePreview
