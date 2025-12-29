import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// นำเข้า css ทั้งหมด
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/style.css';
import './css/sidebar.css';
import './css/table.css';
import './css/treedept.css';
import './css/select.css';

// ทั้งหมด
import AuthGuard from './page/component/authguard';
import Index from './page/index';
import Dashboard from './page/dashboard';
import ApplicationSetting from './page/application/application_setting';
import Employee from './page/employeemanagement/employee';
import AddEmployee from './page/employeemanagement/addemployee';
import ImportEmployee from './page/employeemanagement/importemployee';
import ProbationEmployee from './page/employeemanagement/probationemployee';
import EmployeeResign from './page/employeemanagement/employeeresign';
import Department from './page/departmentmanagement/department';
import EmailConfig from './page/emailmanagement/emailconfig';
import EmailTemplate from './page/emailmanagement/emailtemplate';
import DepartmentKPI from './page/departmentkpi/departmentkpi';

const Main = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route element={<AuthGuard />}> */}
                    <Route path='/' element={<Index />}></Route>
                    <Route path='/dashboard' element={<Dashboard />}></Route>
                    <Route path='/application_setting' element={<ApplicationSetting />}></Route>
                    <Route path='/employee' element={<Employee />}></Route>
                    <Route path='/addemployee' element={<AddEmployee />}></Route>
                    <Route path='/importemployee' element={<ImportEmployee />}></Route>
                    <Route path='/probationemployee' element={<ProbationEmployee />}></Route>
                    <Route path='/employeeresign' element={<EmployeeResign />}></Route>
                    <Route path='/department' element={<Department />}></Route>
                    <Route path='/emailconfig' element={<EmailConfig />}></Route>
                    <Route path='/emailtemplate' element={<EmailTemplate />}></Route>
                    <Route path='/departmentkpi' element={<DepartmentKPI />}></Route>
                {/* </Route> */}
            </Routes>
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')!).render(<Main />);