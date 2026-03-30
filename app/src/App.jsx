import { useState } from 'react'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import FindMeetings from './screens/FindMeetings'
import SoberGuide from './screens/SoberGuide'
import Milestones from './screens/Milestones'

export default function App() {
  const [screen, setScreen] = useState('home')

  const screens = {
    home: <HomeScreen onNavigate={setScreen} />,
    meetings: <FindMeetings />,
    guide: <SoberGuide />,
    milestones: <Milestones />,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {screens[screen]}
      </div>
      <BottomNav active={screen} onNavigate={setScreen} />
    </div>
  )
}
