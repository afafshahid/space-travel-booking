import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  value: string
  size?: number
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 150 }) => {
  return (
    <div className="bg-white p-3 rounded-xl inline-block">
      <QRCodeSVG
        value={value}
        size={size}
        level="H"
        includeMargin={false}
        bgColor="#ffffff"
        fgColor="#050811"
      />
    </div>
  )
}
