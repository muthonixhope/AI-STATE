import { useApp } from "./context/AppContext.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import TopBar from "./components/layout/TopBar.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import EmailTab from "./components/email/EmailTab.jsx";
import PrioritizedInbox from "./components/inbox/PrioritizedInbox.jsx";
import TaskCalendar from "./components/calendar/TaskCalendar.jsx";
import FileWorkspace from "./components/files/FileWorkspace.jsx";
import DocumentSearch from "./components/search/DocumentSearch.jsx";
import DraftReplyPanel from "./components/drafts/DraftReplyPanel.jsx";
import ChatbotTab from "./components/chatbot/ChatbotTab.jsx";
import BinSection from "./components/bin/BinSection.jsx";
import NotificationToast from "./components/notifications/NotificationToast.jsx";
import TenantCaseDrawer from "./components/tenant/TenantCaseDrawer.jsx";

const SECTIONS = {
  dashboard: Dashboard,
  email: EmailTab,
  inbox: PrioritizedInbox,
  calendar: TaskCalendar,
  files: FileWorkspace,
  search: DocumentSearch,
  drafts: DraftReplyPanel,
  chatbot: ChatbotTab,
  bin: BinSection,
};

export default function App() {
  const { section } = useApp();
  const Active = SECTIONS[section] || Dashboard;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar section={section} />
        <main className="scroll-area flex-1 overflow-y-auto">
          <Active />
        </main>
      </div>
      <TenantCaseDrawer />
      <NotificationToast />
    </div>
  );
}
