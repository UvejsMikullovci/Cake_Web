import React, { useState } from 'react'
import Sidebar from '../../../organisms/Sidebar/Sidebar'
import Header from '../../../organisms/NavBar/Navbar'
import Footer from '../../../organisms/Footer/Footer'

import DashboardProfile from '../DashboardProfile/DashboardProfile'
import DashboardOrders from '../DashboardOrders/DashboardOrders'
import DashboardDesserts from '../DashboardDesserts/DashboardDesserts'
import DashboardBlog from '../DashboardBlog/DashboardBlog'
import DashboardSettings from '../DashboardSettings/DashboardSettings'

import './MainDashboard.css'

export default function MainDashboard() {
    
    const [activePage, setActivePage] = useState("profile");

    const renderPage = () => {
        switch(activePage) {
            case "profile":
                return <DashboardProfile />;
            case "orders":
                return <DashboardOrders />;
            case "desserts":
                return <DashboardDesserts />;
            case "blog":
                return <DashboardBlog />;
            case "settings":
                return <DashboardSettings />;
            default:
                return <DashboardProfile />;
        }
    }

    return (
        <>
            <Header />

            <div className="layout">
                <Sidebar active={activePage} onSelect={setActivePage} />

                <main className="page-content">
                    {renderPage()}
                </main>
            </div>

            <Footer />
        </>
    )
}