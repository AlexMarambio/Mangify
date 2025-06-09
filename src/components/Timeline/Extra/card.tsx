// Card.tsx
export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-lg shadow-md ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">
    {children}
  </div>
)

export const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-white">
    {children}
  </h2>
)

export const CardDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-sm mt-2 ${className}`}>
    {children}
  </p>
)

export const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
)
