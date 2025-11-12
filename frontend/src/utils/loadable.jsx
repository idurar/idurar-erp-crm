import { lazy, Suspense } from "react"
import PageLoader from "@/components/PageLoader"

const loadable = (importFunc, fallback = <PageLoader />) => {
  const LazyComponent = lazy(importFunc)

  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

export default loadable
