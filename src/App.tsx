import { Route, Routes} from 'react-router-dom'
import Main from './Pages/Main'
import RuleTable from "./Pages/RuleTable";
import Points from "./Pages/Points";
import MyPage from "./Pages/Mypage";
import Issuance from "./Pages/admin/Issuance";
import AddUser from "./Pages/admin/AddUser";
import History from "./Pages/admin/History";
import Statistics from "./Pages/admin/Statistics";

const App = () => {
  return (
    <Routes>
      <Route path={'/'} element={<Main/>}/>
      <Route path={'/rule-table'} element={<RuleTable/>}/>
      <Route path={'/points'} element={<Points/>}/>
      <Route path={'/mypage'} element={<MyPage/>}/>
      <Route path={'/admin/issuance'} element={<Issuance/>}/>
      <Route path={'/admin/manage'} element={<AddUser/>}/>
      <Route path={'/admin/history'} element={<History/>}/>
      <Route path={'/admin/statistics'} element={<Statistics/>}/>
      </Routes>
  )
}

export default App