import Sidebar from './components/sidebar'
import Navbar from './components/navbar'
import Charts from './components/charts'
import ThemeToggle from './components/toggle';

export default function Home() {
  return (
    <>
      <div className="flex">
        <Sidebar/>
        <main className="flex-grow ml-64 relative">
          <div className="flex items-center justify-between p-4">
            <Navbar/>
            <ThemeToggle/>
          </div>
          <Charts/>
        </main>
      </div>
    </>
  )
}
