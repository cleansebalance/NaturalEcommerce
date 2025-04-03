import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AuthPage from "./pages/auth-page";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      
      {/* Protected routes - require authentication */}
      <ProtectedRoute path="/checkout" component={Checkout} />
      <ProtectedRoute path="/account" component={Account} />
      <ProtectedRoute path="/admin" component={Admin} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-20"> {/* Add padding top for fixed header */}
                <Router />
              </main>
              <Footer />
              <CartDrawer />
            </div>
            <Toaster />
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
