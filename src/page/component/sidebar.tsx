import { useRef, useEffect } from 'react';
import { BsHouseDoor, BsPerson, BsPeople, BsBuilding, BsPersonPlus, BsPersonDash, BsCalendar, BsFileEarmarkText, BsPersonCheck, BsJournalText, BsBoxArrowRight, BsEnvelope } from 'react-icons/bs';

import Button from 'react-bootstrap/Button';

import { logout } from './connectdatabase';
import { alertwarning, alertlogout } from './sweetalerttwo';

import logo from '../../assets/image/logofull.png';

interface NUmberItem {
    page: number;
}

const Sidebar = (item: NUmberItem) => {
    const { page } = item;
    const sidebarRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const sidebar = sidebarRef.current;
        const toggle = toggleRef.current;

        // ปุ่ม toggle แสดง/ซ่อน sidebar
        const handleToggle = () => {
            sidebar?.classList.toggle('show');
        };

        // ปิด sidebar เมื่อกดข้างนอก (เฉพาะมือถือ)
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node; 
            if (window.innerWidth < 992 && sidebar?.classList.contains('show') && !sidebar.contains(target) && !toggle?.contains(target)) {
                sidebar.classList.remove('show');
            }
        };

        if (toggle) toggle.addEventListener('click', handleToggle);
        document.addEventListener('click', handleClick);

        // Cleanup
        return () => {
            if (toggle) toggle.removeEventListener('click', handleToggle);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const nav_active = (pagenow: number, pagenum: number) => {
        return pagenow === pagenum ? ' active' : '';
    }
    
    return (
        <>
            <nav className='navbar d-lg-none'>
                <div className='container-fluid'>
                    <button className='navbar-toggler' id='sidebarToggle' ref={toggleRef}>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <span className='navbar-brand'><img className='logonokair' src={logo} alt='logo navbar' /></span>
                </div>
            </nav>
            <nav className='sidebar d-lg-block' id='sidebarMenu' ref={sidebarRef}>
                <div className='p-3'>
                    <a href='/' className='navbar-brand mb-4 d-flex justify-content-center'><img className='logonokair' src={logo} alt='logo navbar' /></a>
                    <ul className='nav flex-column mb-auto'>
                        <li className='nav-item'><a className={'nav-link' + (page === 1 ? ' active' : '')} href='/dashboard'><span className='me-2'><BsHouseDoor /></span> Dashboard</a></li>
                        
                        <li className='section-title' style={{ color: 'black' }}>Application Management</li>
                        <li><a className={'nav-link' + nav_active(page, 2)} href='/application_setting'><span className='me-2'><BsPeople /></span> Application Setting</a></li>
                        
                        <li className='section-title' style={{ color: 'black' }}>Employee Management</li>
                        <li><a className={'nav-link' + nav_active(page, 3)} href='/employee'><span className='me-2'><BsPerson /></span> All Employee</a></li>
                        <li><a className={'nav-link' + nav_active(page, 4)} href='/addemployee'><span className='me-2'><BsPersonPlus /></span>  Add Employee</a></li>
                        <li><a className={'nav-link' + nav_active(page, 5)} href='/importemployee'><span className='me-2'><BsPeople /></span>  Import Employee</a></li>
                        <li><a className={'nav-link' + nav_active(page, 6)} href='/probationemployee'><span className='me-2'><BsPeople /></span> Probation Employee</a></li>
                        <li><a className={'nav-link' + nav_active(page, 7)} href='/employeeresign'><span className='me-2'><BsPersonDash /></span> Resigned Employee</a></li>

                        <li className='section-title' style={{ color: 'black' }}>Department Management</li>
                        <li><a className={'nav-link' + nav_active(page, 8)} href='/department'><span className='me-2'><BsBuilding /></span> Department</a></li>

                        <li className='section-title' style={{ color: 'black' }}>Email Management</li>
                        <li><a className={'nav-link' + nav_active(page, 9)} href='/emailconfig'><span className='me-2'><BsEnvelope /></span> Email Config</a></li>
                        <li><a className={'nav-link' + nav_active(page, 10)} href='/emailtemplate'><span className='me-2'><BsEnvelope /></span> Email Template</a></li>

                        <li className='section-title' style={{ color: 'black' }}>PMS System</li>
                        <li><a className={'nav-link' + (page === 11 ? ' active' : '')} href='/manageevent'><span className='me-2'><BsCalendar /></span> Event Evaluation</a></li>
                        <li><a className={'nav-link' + (page === 0 ? ' active' : '')} href='/' onClick={(e) => { e.preventDefault(); alertwarning('ยังไม่ได้เปิดการใช้งาน'); }}><span className='me-2'><BsFileEarmarkText /></span>  Question Evaluation</a></li>
                        <li><a className={'nav-link' + (page === 0 ? ' active' : '')} href='/' onClick={(e) => { e.preventDefault(); alertwarning('ยังไม่ได้เปิดการใช้งาน'); }}><span className='me-2'><BsJournalText /></span>  System Logs</a></li>

                        <li className='section-title' style={{ color: 'black' }}>Crew Evaluation</li>
                        <li><a className={'nav-link' + (page === 0 ? ' active' : '')} href='/' onClick={(e) => { e.preventDefault(); alertwarning('ยังไม่ได้เปิดการใช้งาน'); }}><span className='me-2'><BsFileEarmarkText /></span>  Question Evaluation</a></li>
                        <li><a className={'nav-link' + (page === 0 ? ' active' : '')} href='/' onClick={(e) => { e.preventDefault(); alertwarning('ยังไม่ได้เปิดการใช้งาน'); }}><span className='me-2'><BsJournalText /></span>  System Logs</a></li>

                        <li className='section-title' style={{ color: 'black' }}>Department KPI</li>
                        <li><a className={'nav-link' + (page === 0 ? ' active' : '')} href='/departmentkpi' onClick={(e) => { e.preventDefault(); alertwarning('ยังไม่ได้เปิดการใช้งาน'); }}><span className='me-2'><BsPersonCheck /></span>  Department KPI</a></li>
                        <li><a className={'nav-link' + (page === 0 ? ' active' : '')} href='/' onClick={(e) => { e.preventDefault(); alertwarning('ยังไม่ได้เปิดการใช้งาน'); }}><span className='me-2'><BsJournalText /></span>  System Logs</a></li>
                    </ul>
                    <hr className='bg-light' />
                    <Button variant='dark' className='w-100 d-flex align-items-center justify-content-center mb-3' onClick={() => { alertlogout(logout); }}><BsBoxArrowRight className='me-2' />Logout</Button>
                    <div className='d-flex align-items-center'>
                        <img src='https://randomuser.me/api/portraits/men/75.jpg' alt='admin' width='36' height='36' className='rounded-circle me-2' />
                        <div>
                            <div>HR NOKAIR</div>
                            <small>Administrator</small>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Sidebar;