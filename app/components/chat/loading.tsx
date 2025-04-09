'use client'
import type { FC } from 'react'
import React from 'react'
import s from './loading.module.css'

export type LoadingProps = {
  type: 'text' | 'avatar'
}

const Loading: FC<LoadingProps> = ({
  type,
}) => {
  return (
    <div className={`${s['dot-flashing']} ${s[type]}`}></div>
  )
}
export default React.memo(Loading)
