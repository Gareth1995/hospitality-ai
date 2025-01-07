import Link from "next/link";

const Sidebar = () => {
    return (
      <>
        <aside className="fixed top-0 left-0 w-64 h-full" aria-label="Sidenav">
          <div className="overflow-y-auto py-5 px-3 h-full bg-[var(--sidenav-bg-col)] border-r border-[var(sidenav-border-col)]">
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-[var(sidenav-text-col)] group">
                  <span className="ml-3">Dashboard</span>
                </a>
              </li>
              <li>
              <Link href="./booking_data">
                <button type="button" className="flex items-center p-2 w-full text-base font-normal text-[var(--sidenav-text-col)] hover:bg-[var(--sidenav-hover-col)] rounded-lg transition duration-75 group">
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Data View</span>
                </button>
              </Link>
              </li>
              <li>
                <button type="button" className="flex items-center p-2 w-full text-base font-normal text-[var(--sidenav-text-col)] rounded-lg transition duration-75 group hover:bg-[var(--sidenav-hover-col)] group" aria-controls="dropdown-sales" data-collapse-toggle="dropdown-sales">
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Sales</span>
                  <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>
                </button>
              </li>
            </ul>
            <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
              <li>
                <button type="button" className="flex items-center p-2 w-full text-base font-normal text-[var(--sidenav-text-col)] hover:bg-[var(--sidenav-hover-col)] rounded-lg transition duration-75 group">
                  <span className="ml-3">Settings</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
      </>
    )
  }
  
  export default Sidebar;