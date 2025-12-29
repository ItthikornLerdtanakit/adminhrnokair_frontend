import { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import type { EmailConfigItem } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { checkvalueinput } from '../component/functions';
import { CustomSelect } from '../component/customselects';
import { get_emailconfig, update_emailconfig } from '../component/connectdatabase';
import { alertsmall, alerterror } from '../component/sweetalerttwo';

import { Mail } from 'lucide-react';

const Emailconfig = () => {
    useEffect(() => {
        document.title = 'Email Config';
        get_database();
    }, []);

    const [EmailConfig, setEmailConfig] = useState<EmailConfigItem[]>([]);
    const [CheckUser, setCheckUser] = useState<boolean>(false);
    const [Service, setService] = useState<string>('');
    const [IPAddress, setIPAddress] = useState<string>('');
    const get_database = async () => {
        const result = await get_emailconfig();
        setEmailConfig(result);
        setService(result[0].emailconfig_service);
        setIPAddress(result[0].emailconfig_ipaddress);
        setCheckUser(Boolean(result[0].emailconfig_checkuser));
    }

    useEffect(() => {
        if (Service === 'Other') {
            setIPAddress(EmailConfig[0].emailconfig_ipaddress)
        } else {
            setIPAddress('-');
        }
    }, [Service]);

    // สำหรับนำข้อมูลที่เลือกมาไว้ในตัวแปรของแต่ละ Select
    const ServiceOptions = [{ value: 'Gmail', label: 'Gmail' }, { value: 'Yahoo', label: 'Yahoo' }, { value: 'Outlook', label: 'Outlook' }, { value: 'Other', label: 'Other' }];

    // สำหรับเช็คข้อมูลว่ามีค่าว่างหรือไม่ โดยเก็บเป้น true/false ถ้า true คือมีค่าว่างให้แสดงกรอบสีแดง และ false คืนค่าเดิม
    const [ServiceCheck, setServiceCheck] = useState<boolean>(false);

    // บันทึกข้อมูลพยักงาน
    const save_emailconfig = async () => {
        const mc_user = document.getElementById('mc_user') as HTMLInputElement;
        const mc_pass = document.getElementById('mc_pass') as HTMLInputElement;
        const mc_address = document.getElementById('mc_address') as HTMLInputElement;
        const mc_name = document.getElementById('mc_name') as HTMLInputElement;
        if (!Service || !mc_address.value || !mc_name.value) {
            checkvalueinput(mc_address, mc_address.value);
            checkvalueinput(mc_name, mc_name.value);
            alertsmall('warning', 'Please complete or select all required information.');
            return;
        }
        // ส่งข้อมูลไป
        const data = [{
            emailconfig_id: EmailConfig[0].emailconfig_id,
            emailconfig_service: Service,
            emailconfig_ipaddress: IPAddress,
            emailconfig_checkuser: Number(CheckUser),
            emailconfig_user: CheckUser ? '-' : mc_user.value,
            emailconfig_apppass: CheckUser ? '-' : mc_pass.value,
            emailconfig_address: mc_address.value,
            emailconfig_name: mc_name.value
        }];
        const result = await update_emailconfig(data);
        if (result === 'success') {
            alertsmall('success', 'Add Employee Successfully.');
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    return (
        <div className='d-flex'>
            <Sidebar page={9} />
            <Container fluid className='py-4 content flex-grow-1 margintop'>
                <Card className='shadow-sm' style={{ border: 'none', width: '100%' }}>
                    <Card.Header className='bg-warning form-header pt-4'>
                        <h2>Configure the HR email for sending emails</h2>
                        <p>Email Configuration & Email Sending Test.</p>
                    </Card.Header>
                    <Card.Body>
                        <div className='title-section'>
                            <Mail /> - Setting Email Service
                        </div>
                        <Row className='mt-4'>
                            <Col md={12} className='mb-4'>
                                <label htmlFor='check_user' className='custom-radio' style={{ marginTop: 'unset' }}>
                                    <input type='checkbox' id='check_user' checked={CheckUser} onChange={(e) => setCheckUser(e.target.checked)} className='radio-input' />
                                    <span className='checkmark'></span>
                                    <span>No user/password available</span>
                                </label>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Service SMTP:</Form.Label>
                                        <CustomSelect value={Service} onChange={(value) => { setService(value); setServiceCheck(!value); }} options={ServiceOptions} width='100%' dot={true} error={ServiceCheck} />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>IP Address SMTP (Other Select) :</Form.Label>
                                        <Form.Control type='text' id='mc_ipaddress' onChange={(e) => setIPAddress(e.target.value)} disabled={Service !== 'Other'} value={IPAddress} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            {!CheckUser && (
                                <>
                                    <Col md={6}>
                                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                            <Form.Group>
                                                <Form.Label>Username:</Form.Label>
                                                <Form.Control type='text' id='mc_user' defaultValue={EmailConfig[0]?.emailconfig_user} placeholder='Enter your text here...' />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col md={6}>
                                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                            <Form.Group>
                                                <Form.Label>Password:</Form.Label>
                                                <Form.Control type='password' id='mc_pass' defaultValue={EmailConfig[0]?.emailconfig_apppass} placeholder='Enter your text here...' />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </>
                            )}
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>From Email Address:</Form.Label>
                                        <Form.Control type='text' id='mc_address' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={EmailConfig[0]?.emailconfig_address} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Name:</Form.Label>
                                        <Form.Control type='text' id='mc_name' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={EmailConfig[0]?.emailconfig_name} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={12} className='mb-4 midpoint'>
                                <Button variant='warning' style={{ width: 150 }} onClick={save_emailconfig}>Save</Button>
                            </Col>
                        </Row>
                        <div className='title-section'>
                            <Mail /> - Test Email Service
                        </div>
                        <Row className='mt-4'>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>To Email Address:</Form.Label>
                                        <Form.Control type='text' id='mc_emailto' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Message Description:</Form.Label>
                                        <Form.Control type='text' id='mc_description' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={12} className='mb-4 midpoint'>
                                <Button variant='warning' style={{ width: 150 }} onClick={save_emailconfig}>Test</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

export default Emailconfig;