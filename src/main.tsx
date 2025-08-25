import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'

function MyPage() { return <div>MyPage</div> }

createRoot(document.getElementById('react-root')!).render(
  <BrowserRouter basename="/app">
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  </BrowserRouter>
)
