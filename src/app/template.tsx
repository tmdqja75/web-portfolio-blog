export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-transition" className="page-fade-in flex min-h-full flex-1 flex-col">
      {children}
    </div>
  )
}
