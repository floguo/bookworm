'use client'

import React, { useState } from 'react'
import PDFUploader from '../components/PDFUploader'

interface KeyPoint {
  title: string
  content: string
}

export default function Home() {
  const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([])

  const handleExtractKeyPoints = (extractedKeyPoints: KeyPoint[]) => {
    setKeyPoints(extractedKeyPoints)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bookworm PDF Key Point Extractor</h1>
      <PDFUploader onExtract={handleExtractKeyPoints} />
      {keyPoints.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Extracted Key Points:</h2>
          <ul className="space-y-4">
            {keyPoints.map((point, index) => (
              <li key={index} className="border-b pb-4">
                <h3 className="text-lg font-medium">{point.title}</h3>
                <p className="text-gray-600">{point.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

