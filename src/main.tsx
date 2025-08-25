import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Home() { return <div>Home sasdfasdf</div> }
function MyPage() { return <div>MyPage</div> }

createRoot(document.getElementById('react-root')!).render(
  <BrowserRouter basename="/app">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  </BrowserRouter>
)
