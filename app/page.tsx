'use client';

import Charts from './components/charts';
import ThemeToggle from './components/toggle';
import { useAuth } from "./context/authContext";
import Navbar from "./components/navbar";

export default function Dashboard() {
    const { hotelName } = useAuth();
    
    return (
        <>
            <header className="flex flex-col items-center justify-center py-4">
                <h1 className="text-2xl font-semibold text-center">Reviewer Analytics for {hotelName}</h1>
            </header>

            <main className="flex-grow relative">
                <div className="flex items-center justify-between p-4">
                    <Navbar/>
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </div>
                <Charts />
            </main>
        </>
    )
}
