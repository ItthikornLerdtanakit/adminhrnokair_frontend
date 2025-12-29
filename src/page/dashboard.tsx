import { useEffect } from 'react';

import Sidebar from './component/sidebar';

const Index = () => {
    useEffect(() => {
        document.title = 'Dashboard';
    }, [])
    return (
        <div className='d-flex'>
            <Sidebar page={1} />
            <div className='content flex-grow-1'>
                <h1 className='mb-4'>Admin Dashboard</h1>
                <div className='row g-3'>
                    <div className='col-md-4'>
                        <div className='card shadow-sm'>
                            <div className='card-body'>
                                <h5 className='card-title'>Total Users</h5>
                                <p className='card-text fs-3 fw-bold'>1,234</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card shadow-sm'>
                            <div className='card-body'>
                                <h5 className='card-title'>Active Sessions</h5>
                                <p className='card-text fs-3 fw-bold'>87</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card shadow-sm'>
                            <div className='card-body'>
                                <h5 className='card-title'>Reports</h5>
                                <p className='card-text fs-3 fw-bold'>12</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;