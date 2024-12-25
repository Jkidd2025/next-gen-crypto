import { Routes, Route } from "react-router-dom";
import { TokenSwap } from "./TokenSwap";
import { ProtectedRoute } from "./ProtectedRoute";
import { Home } from "./Home"; // Example of an existing route
import { About } from "./About"; // Example of an existing route
import { NotFound } from "./NotFound"; // Example of an existing route

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route 
        path="/swap" 
        element={
          <ProtectedRoute>
            <TokenSwap />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
