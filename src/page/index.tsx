import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrbitProgress } from 'react-loading-indicators';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navbars from './component/navbar';
import Footer from './component/footer';
import { checkpermission } from './component/connectdatabase';
import { alerterrorredirect } from './component/sweetalerttwo';

import logo from '../assets/image/logo.png';

const Index = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Loading...';
        get_database();
        
    }, []);

    const get_database = async () => {
        const query = new URLSearchParams(globalThis.location.search);
        const oid = query.get('oid')!;
        if (oid) {
            const result = await checkpermission(oid);
            if (result.status) {
                localStorage.setItem(import.meta.env.VITE_TOKEN, result.token);
                navigate('/dashboard');
            } else {
                alerterrorredirect('Please contact your administrator.');
            }
        } else {
            alerterrorredirect('Please contact your administrator.');
        }
    }

    return (
        <Container fluid className='index'>
            <Navbars />
            <Row style={{ flex: 1 }} className='midpoint'>
                <Col xs={11} md={9} xl={4} style={{ backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', borderRadius: 15 }}>
                    {/* Card Body */}
                    <div style={{ padding: '3rem 2.5rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#2c3e50', fontSize: '2rem' }}>
                                Welcome To HR Admin Nokair
                            </h2>
                            <Col md={12} className='midpoint mt-5 mb-5'>
                                <img src={logo} alt='logo noair' className='logo' />
                            </Col>
                            <div>
                                <OrbitProgress color='#ffcb0b' size='medium' text='' textColor='' />
                            </div>
                        </div>
                    </div>

                </Col>
            </Row>
            <Footer />
        </Container>
    )
}

export default Index;