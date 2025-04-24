//create a icon component that can be used to display an icon
// use a SVG file to display the icon
// and the icon can use currentColor to change the color
// and can set background color


import React from 'react'

interface IconProps {
  /**
   * the name of the icon
   * use the name to find the svg file in the public folder
   */
  name: string
  /**
   * the fill color of the icon
   */
  fill?: string
  /**
   * background color of the icon
   */
  color?: string
}

export const Icon = ({ name, fill = "#000", color = "#fff" }: IconProps) => {
  return (
    <div className="icon flex items-center justify-center w-5 h-5 rounded-md"
      style={{
        backgroundColor: fill,
      }}
    >
      <img
        src={`/icons/${name}.svg`}
        alt={`${name} icon`}
      />
    </div>
  )
}