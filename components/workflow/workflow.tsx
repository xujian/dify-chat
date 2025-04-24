import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import cn from 'classnames'
import { CheckCircle, AlertCircle, ChevronRight, LoaderCircle } from 'lucide-react'
import NodeView from './node'
import { Workflow, WorkflowStatus } from '@/models'

type WorkflowViewProps = {
  data: Workflow
  expand?: boolean
  hidden?: boolean
}

const WorkflowView = ({
  data,
  expand = false,
  hidden = false,
}: WorkflowViewProps) => {
  const [collapse, setCollapse] = useState(!expand)
  const running = data.status === WorkflowStatus.Running
  const succeeded = data.status === WorkflowStatus.Completed
  const failed = data.status === WorkflowStatus.Failed || data.status === WorkflowStatus.Stopped

  useEffect(() => {
    setCollapse(!expand)
  }, [expand])

  return (
    <div
      className={cn(
        'workflow w-full mb-2 rounded-xl border-1 border-black/[0.08]',
        collapse
          ? 'py-[7px]'
          : hidden
            ? 'pt-2 pb-1'
            : 'py-2',
        'bg-gray-50',
        hidden
          ? 'mx-[-8px] px-1'
          : 'w-full px-3',
      )}>
      <div
        className={cn(
          'flex items-center h-[18px] cursor-pointer',
          hidden && 'px-[6px]',
        )}
        onClick={() => setCollapse(!collapse)}>
        {
          running && (
            <LoaderCircle className='shrink-0 mr-1 w-3 h-3 text-[#667085] animate-spin' />
          )
        }
        {
          succeeded && (
            <CheckCircle className='shrink-0 mr-1 w-3 h-3 text-[#12B76A]' />
          )
        }
        {
          failed && (
            <AlertCircle className='shrink-0 mr-1 w-3 h-3 text-[#F04438]' />
          )
        }
        <div className='grow text-xs font-medium text-gray-700 leading-[18px]'>工作流状态</div>
        <ChevronRight className={`'ml-1 w-3 h-3 text-gray-500' ${collapse ? '' : 'rotate-90'}`} />
      </div>
      {
        !collapse && (
          <div className='mt-1'>
            {
              data.nodes?.map((node, index) => (
                <div key={`node-${index}`} className='mb-0.5 last-of-type:mb-0'>
                  <NodeView
                    data={node}
                  />
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default WorkflowView