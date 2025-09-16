import React from "react";
import ErrorBoundary from "@/view/ErrorBoundary";

const NotFound: React.FC = () => (
  <ErrorBoundary>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  </ErrorBoundary>
);

export default NotFound;
