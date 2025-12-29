// นำเข้ามาจาก Bootstrap
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/esm/Container';

import logo from '../../assets/image/logofull.png';

const Navbars = () => {
    return (
        <nav>
            <Row>
                <Navbar className='navbars'>
                    <Container>
                        <img className='logonokair align-items-center' src={logo} alt='logo navbar' />
                    </Container>
                </Navbar>
            </Row>
        </nav>
    )
}

export default Navbars;