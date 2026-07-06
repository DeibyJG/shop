import { RouterApp } from './routes/routerApp'
import { AuthProvider } from './context/authContext'
import { CartProvider } from './context/cartContext'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterApp/>
      </CartProvider>
    </AuthProvider>
  )
}

export default App