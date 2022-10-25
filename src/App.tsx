import { Route, Routes} from 'react-router-dom'
import Main from './Pages/Main'
import RuleTable from "./Pages/RuleTable";
import Points from "./Pages/Points";
import MyPage from "./Pages/Mypage";
import Issuance from "./Pages/admin/Issuance";
import AddUser from "./Pages/admin/AddUser";

const App = () => {
  return (
    <Routes>
      <Route path={'/'} element={<Main/>}/>
      <Route path={'/rule-table'} element={<RuleTable/>}/>
      <Route path={'/points'} element={<Points/>}/>
      <Route path={'/mypage'} element={<MyPage/>}/>
      <Route path={'/admin/issuance'} element={<Issuance/>}/>
      <Route path={'/admin/add-user'} element={<AddUser/>}/>
      </Routes>
  )
}

export default App