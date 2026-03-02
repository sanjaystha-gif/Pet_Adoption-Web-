import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, { error: Error | null; info: React.ErrorInfo | null }>{
  constructor(props: React.PropsWithChildren<{}>){
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error: Error){
    return { error, info: null }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo){
    // You can also log the error to an external service here
    // eslint-disable-next-line no-console
    console.error('Uncaught error in React tree:', error, info)
    this.setState({ error, info })
  }

  render(){
    const { error, info } = this.state
    if (error) {
      return (
        <div style={{padding:20,fontFamily:'sans-serif'}}>
          <h1 style={{color:'#c53030'}}>Application error</h1>
          <p>{error.message}</p>
          <details style={{whiteSpace:'pre-wrap'}}>
            {info?.componentStack}
          </details>
        </div>
      )
    }
    return this.props.children as React.ReactNode
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
