import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
      <h2 className="text-4xl font-bold">404 - Not Found</h2>
      <p className="text-muted-foreground">Could not find requested resource</p>
      <Link 
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}