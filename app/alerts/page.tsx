'use client';
import AlertTable from '../components/alerts_table';
import NavButtons from '../components/navButtons';
import Charts from '../components/charts';
import ThemeToggle from '../components/toggle';

export default function Alerts() {
    
    return (
        <>
            <main className="flex-grow relative">
                <div className="flex items-center justify-between p-4">
                    <NavButtons />
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </div>
                <AlertTable />
            </main>
        </>
    )
}
