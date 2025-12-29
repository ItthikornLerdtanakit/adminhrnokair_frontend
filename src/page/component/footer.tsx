import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer = () => {
    return (
        <footer>
            <Row className='midpoint' style={{ height: '50px', backgroundColor: '#2e2e2e' }}>
                <Col md={12} style={{ textAlign: 'center' }}>
                    <p style={{ color: 'white', fontSize: '12px', margin: 0 }}>©2025 Nok Airlines Public Company Limited. All Right Reserved.</p>
                </Col>
            </Row>
        </footer>
    )
}

export default Footer;