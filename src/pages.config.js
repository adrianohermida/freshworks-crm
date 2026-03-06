/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Agents from './pages/Agents';
import Analytics from './pages/Analytics';
import Contacts from './pages/Contacts';
import Dashboard from './pages/Dashboard';
import IntegrationStatus from './pages/IntegrationStatus';
import Integrations from './pages/Integrations';
import Onboarding from './pages/Onboarding';
import Performance from './pages/Performance';
import Settings from './pages/Settings';
import TicketDetail from './pages/TicketDetail';
import Tickets from './pages/Tickets';
import CustomerPortal from './pages/CustomerPortal';
import WorkflowAutomation from './pages/WorkflowAutomation';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Agents": Agents,
    "Analytics": Analytics,
    "Contacts": Contacts,
    "Dashboard": Dashboard,
    "IntegrationStatus": IntegrationStatus,
    "Integrations": Integrations,
    "Onboarding": Onboarding,
    "Performance": Performance,
    "Settings": Settings,
    "TicketDetail": TicketDetail,
    "Tickets": Tickets,
    "CustomerPortal": CustomerPortal,
    "WorkflowAutomation": WorkflowAutomation,
}

export const pagesConfig = {
    mainPage: "Tickets",
    Pages: PAGES,
    Layout: __Layout,
};