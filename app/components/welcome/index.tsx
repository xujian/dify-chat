'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TemplateVarPanel, { PanelTitle, VarOpBtnGroup } from '../value-panel'
import { EditBtn, PromptTemplate } from './massive-component'
import Toast from '@/app/components/base/toast'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/app/store'
import { Button } from '../ui'
import { startChat } from '@/app/store/session'

// regex to match the {{}} and replace it with a span
const regex = /\{\{([^}]+)\}\}/g

const Welcome: FC = () => {

  const serverConfig = useSelector((state: RootState) => state.server),
    session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const hasVar = Object.keys(serverConfig.promptVariables).length > 0
  const [isFold, setIsFold] = useState<boolean>(true)
  const [inputs, setInputs] = useState<Record<string, any>>((() => {
    // if (session.inputs)
    //   return savedInputs

    // const res: Record<string, any> = {}
    // if (promptConfig) {
    //   promptConfig.prompt_variables.forEach((item) => {
    //     res[item.key] = ''
    //   })
    // }
    // return res
    return {}
  })())
  // useEffect(() => {
  //   if (!savedInputs) {
  //     const res: Record<string, any> = {}
  //     if (promptConfig) {
  //       promptConfig.prompt_variables.forEach((item) => {
  //         res[item.key] = ''
  //       })
  //     }
  //     setInputs(res)
  //   }
  //   else {
  //     setInputs(savedInputs)
  //   }
  // }, [savedInputs])

  const highLightPromoptTemplate = (() => {
    // if (!serverConfig.promptConfig)
    //   return ''
    // const res = serverConfig.promptConfig.prompt_template.replace(regex, (match, p1) => {
    //   return `<span class='text-gray-800 font-bold'>${inputs?.[p1] ? inputs?.[p1] : match}</span>`
    // })
    return '' //res
  })()

  const { notify } = Toast
  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const renderHeader = () => {
    return (
      <div className='absolute top-0 left-0 right-0 flex items-center'>

      </div>
    )
  }

  const renderInputs = () => {
    return (
      <div>
      </div>
      // <div className='welcome-inputs space-y-3'>
      //   {serverConfig.promptConfig.prompt_variables.map(item => (
      //     <div className='tablet:flex items-start mobile:space-y-2 tablet:space-y-0 mobile:text-xs tablet:text-sm' key={item.key}>
      //       <label className={`flex-shrink-0 flex items-center tablet:leading-9 mobile:text-gray-700 tablet:text-gray-900 mobile:font-medium pc:font-normal ${s.formLabel}`}>{item.name}</label>
      //       {item.type === 'select'
      //         && (
      //           <Select
      //             className='w-full'
      //             defaultValue={inputs?.[item.key]}
      //             onSelect={(i) => { setInputs({ ...inputs, [item.key]: i.value }) }}
      //             items={(item.options || []).map(i => ({ name: i, value: i }))}
      //             allowSearch={false}
      //             bgClassName='bg-gray-50'
      //           />
      //         )}
      //       {item.type === 'string' && (
      //         <input
      //           placeholder={`${item.name}${!item.required ? `(${t('app.variableTable.optional')})` : ''}`}
      //           value={inputs?.[item.key] || ''}
      //           onChange={(e) => { setInputs({ ...inputs, [item.key]: e.target.value }) }}
      //           className={'w-full flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50'}
      //           maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
      //         />
      //       )}
      //       {item.type === 'paragraph' && (
      //         <textarea
      //           className="w-full h-[104px] flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50"
      //           placeholder={`${item.name}${!item.required ? `(${t('app.variableTable.optional')})` : ''}`}
      //           value={inputs?.[item.key] || ''}
      //           onChange={(e) => { setInputs({ ...inputs, [item.key]: e.target.value }) }}
      //         />
      //       )}
      //       {item.type === 'number' && (
      //         <input
      //           type="number"
      //           className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
      //           placeholder={`${item.name}${!item.required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
      //           value={inputs[item.key]}
      //           onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
      //         />
      //       )}
      //     </div>
      //   ))}
      // </div>
    )
  }

  const canChat = () => {
    const inputLens = Object.values(inputs).length
    const promptVariablesLens = Object.keys(serverConfig.promptVariables).length
    const emptyInput = inputLens < promptVariablesLens || Object.values(inputs).filter(v => v === '').length > 0
    if (emptyInput) {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  const handleChat = () => {
    if (!canChat())
      return
    dispatch(startChat())
  }

  const renderNoVarPanel = () => {
    // if (isPublicVersion) {
    //   return (
    //     <div>
    //       <AppInfoComp siteInfo={siteInfo} />
    //       <TemplateVarPanel
    //         isFold={false}
    //         header={
    //           <>
    //             <PanelTitle
    //               title={t('app.chat.publicPromptConfigTitle')}
    //               className='mb-1'
    //             />
    //             <PromptTemplate html={highLightPromoptTemplate} />
    //           </>
    //         }
    //       >
    //         <ChatBtn onClick={handleChat} />
    //       </TemplateVarPanel>
    //     </div>
    //   )
    // }
    // private version
    return (
      <div>
      </div>
      // <TemplateVarPanel
      //   isFold={false}
      //   header={
      //     <AppInfoComp siteInfo={siteInfo} />
      //   }
      // >
      //   <ChatBtn onClick={handleChat} />
      // </TemplateVarPanel>
    )
  }

  const renderVarPanel = () => {
    return (
      <div>
      </div>
      // <TemplateVarPanel
      //   isFold={false}
      //   header={
      //     <AppInfoComp siteInfo={siteInfo} />
      //   }
      // >
      //   {renderInputs()}
      //   <ChatBtn
      //     className='mt-3 mobile:ml-0 tablet:ml-[128px]'
      //     onClick={handleChat}
      //   />
      // </TemplateVarPanel>
    )
  }

  const renderVarOpBtnGroup = () => {
    return (
      <VarOpBtnGroup
        onConfirm={() => {
          if (!canChat())
            return

          // onInputsChange(inputs)
          setIsFold(true)
        }}
        onCancel={() => {
          // setInputs(savedInputs)
          setIsFold(true)
        }}
      />
    )
  }

  const renderHasSetInputsPublic = () => {
    // if (!canEditInputs) {
    //   return (
    //     <TemplateVarPanel
    //       isFold={false}
    //       header={
    //         <>
    //           <PanelTitle
    //             title={t('app.chat.publicPromptConfigTitle')}
    //             className='mb-1'
    //           />
    //           <PromptTemplate html={highLightPromoptTemplate} />
    //         </>
    //       }
    //     />
    //   )
    // }

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <>
            <PanelTitle
              title={t('app.chat.publicPromptConfigTitle')}
              className='mb-1'
            />
            <PromptTemplate html={highLightPromoptTemplate} />
            {isFold && (
              <div className='flex items-center justify-between mt-3 border-t border-indigo-100 pt-4 text-xs text-indigo-600'>
                <span className='text-gray-700'>{t('app.chat.configStatusDes')}</span>
                <EditBtn onClick={() => setIsFold(false)} />
              </div>
            )}
          </>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    )
  }

  const renderHasSetInputsPrivate = () => {
    return null
    // if (!canEditInputs || !hasVar)
    //   return null

    // return (
    //   <TemplateVarPanel
    //     isFold={isFold}
    //     header={
    //       <div className='flex items-center justify-between text-indigo-600'>
    //         <PanelTitle
    //           title={!isFold ? t('app.chat.privatePromptConfigTitle') : t('app.chat.configStatusDes')}
    //         />
    //         {isFold && (
    //           <EditBtn onClick={() => setIsFold(false)} />
    //         )}
    //       </div>
    //     }
    //   >
    //     {renderInputs()}
    //     {renderVarOpBtnGroup()}
    //   </TemplateVarPanel>
    // )
  }

  const renderHasSetInputs = () => {
    return null
    // if ((!isPublicVersion && !canEditInputs) || !hasVar)
    //   return null

    // return (
    //   <div
    //     className='pt-[88px] mb-5'
    //   >
    //     {isPublicVersion ? renderHasSetInputsPublic() : renderHasSetInputsPrivate()}
    //   </div>)
  }

  return (
    <div className='welcome flex flex-col items-center min-h-[200px]'>
      {session.inputs && renderHeader()}
      <div className='mx-auto'>
        {
          !session.inputs &&
            hasVar
            ? renderVarPanel()
            : renderNoVarPanel()
        }
        {session.inputs && renderHasSetInputs()}
        <Button className='mt-3 mobile:ml-0 tablet:ml-[128px]'
          onClick={() => dispatch(startChat())}>开始对话</Button>
      </div>
    </div >
  )
}

export default React.memo(Welcome)
