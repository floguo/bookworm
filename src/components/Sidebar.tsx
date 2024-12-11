import React from 'react'
import { NodeData } from '../types/types'

interface SidebarProps {
  node: NodeData | null
}

const Sidebar: React.FC<SidebarProps> = ({ node }) => {
  if (!node) {
    return <div className="p-4">Select a node to see details.</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{node.label}</h2>
      {node.summary && <p className="mb-4">{node.summary}</p>}
      {node.quotes && node.quotes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Quotes:</h3>
          <ul className="list-disc pl-5">
            {node.quotes.map((quote, index) => (
              <li key={index} className="mb-2">
                {quote}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Sidebar

