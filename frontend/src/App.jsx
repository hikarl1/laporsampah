import {Routes,Route} from "react-router-dom"

import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardWarga from "./pages/DashboardWarga"
import DashboardPetugas from "./pages/DashboardPetugas"
import DashboardAdmin from "./pages/DashboardAdmin"
import BuatLaporanPage from "./pages/BuatLaporanPage"

function App(){

return(

<Routes>

<Route
path="/"
element={<LoginPage/>}
/>

<Route
path="/register"
element={<RegisterPage/>}
/>

<Route
path="/warga"
element={<DashboardWarga/>}
/>

<Route
path="/petugas"
element={<DashboardPetugas/>}
/>

<Route
path="/admin"
element={<DashboardAdmin/>}
/>

<Route
path="/buat"
element={<BuatLaporanPage/>}
/>

</Routes>

)

}

export default App