// Card.tsx
export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-b border-gray-800">
    {children}
  </div>
)

export const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-white">
    {children}
  </h2>
)

export const CardDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-sm text-gray-400 mt-2 ${className}`}>
    {children}
  </p>
)

export const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
)
