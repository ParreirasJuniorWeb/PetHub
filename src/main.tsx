import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// react-router-dom components and hooks
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
// Auth Provider Context
import { AuthProvider } from "./contexts/AuthContext";
// import Toast Container
import { Toaster } from "react-hot-toast";

// import ErrorBoundary Container
import { ErrorBoundary } from "react-error-boundary";

// import ErrorBoundary Component
import ErrorFallback from "./components/ErrorBoundaryComponent/ErrorBoundaryComponent.tsx";
// Cart Provider Context
import { CartProvider } from './contexts/CartContext.tsx';
import { CheckoutProvider } from './contexts/CheckoutContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
              console.error("Error logged: ", "\n" + error, "\n" + info);
            }}
            onReset={() => {
              console.log("Reset triggered");
              window.location.reload(); // Exemplo: recarregar a página
            }}
          >
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
            <RouterProvider router={router} />
          </ErrorBoundary>
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
