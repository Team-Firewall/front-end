import { Route, Routes} from 'react-router-dom'
import Main from './Pages/Main'
import RuleTable from "./Pages/RuleTable";
import Points from "./Pages/Points";
import MyPage from "./Pages/Mypage";

const App = () => {
  return (
    <Routes>
      <Route path={'/'} element={<Main/>}/>
      <Route path={'/rule-table'} element={<RuleTable/>}/>
      <Route path={'/points'} element={<Points/>}/>
      <Route path={'mypage'} element={<MyPage/>}/>
    </Routes>
  )
}

export default App