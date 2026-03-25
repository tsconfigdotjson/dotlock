import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Vite + React + Tailwind
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Edit <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">src/App.tsx</code> and save to test HMR
      </p>
      <button
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App
