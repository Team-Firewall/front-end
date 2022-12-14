import { Route, Routes} from 'react-router-dom'
import Main from './Pages/Main'
import RuleTable from "./Pages/RuleTable";
import Points from "./Pages/Points";
import MyPage from "./Pages/Mypage";
import Issuance from "./Pages/admin/Issuance";
import Management from "./Pages/admin/Management";
import History from "./Pages/admin/History";
import Statistics from "./Pages/admin/Statistics";
import Regulation from "./Pages/admin/Regulation";

const App = () => {
  return (
    <Routes>
      <Route path={'/'} element={<Main/>}/>
      <Route path={'/rule-table'} element={<RuleTable/>}/>
      <Route path={'/points'} element={<Points/>}/>
      <Route path={'/mypage'} element={<MyPage/>}/>
      <Route path={'/admin/issuance'} element={<Issuance/>}/>
      <Route path={'/admin/management'} element={<Management/>}/>
      <Route path={'/admin/history'} element={<History/>}/>
      <Route path={'/admin/statistics'} element={<Statistics/>}/>
      <Route path={'/admin/regulation'} element={<Regulation/>}/>
      </Routes>
  )
}

export default App