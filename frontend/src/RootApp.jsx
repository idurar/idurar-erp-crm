import "./style/app.css"

import { Suspense, lazy } from "react"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import store from "@/redux/store"
import PageLoader from "@/components/PageLoader"
import ErrorBoundary from "@/components/ErrorBoundary"

const IdurarOs = lazy(() => import("./apps/IdurarOs"))

export default function RoutApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <IdurarOs />
          </Suspense>
        </ErrorBoundary>
      </Provider>
    </BrowserRouter>
  )
}
