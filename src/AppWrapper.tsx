import React, { Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import App from './App';
import { Loader2 } from 'lucide-react';

const FullscreenLoader = () => (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
);

const AppWrapper: React.FC = () => {
    const { loading } = useAuth();

    if (loading) {
        return <FullscreenLoader />;
    }

    return (
        <Suspense fallback={<FullscreenLoader />}>
            <App />
        </Suspense>
    );
};

export default AppWrapper;
