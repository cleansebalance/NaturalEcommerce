import { Switch, Route } from "wouter";
import TestPage from "./pages/test-page";
import NotFound from "./pages/not-found";

function SimpleRouter() {
  return (
    <Switch>
      <Route path="/" component={TestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function SimpleApp() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Simple App</h1>
      </header>
      <main className="flex-grow p-4">
        <SimpleRouter />
      </main>
      <footer className="bg-gray-200 p-4 text-center">
        <p>Simple App Footer</p>
      </footer>
    </div>
  );
}

export default SimpleApp;