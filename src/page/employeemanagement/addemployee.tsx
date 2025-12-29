import { useEffect, useState, useMemo, useRef } from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import type { DepartmentItem } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { checkvalueinput, checkvalueselect } from '../component/functions';
import { CustomSelect } from '../component/customselects';
import { get_department, add_employee } from '../component/connectdatabase';
import { loading, alertsmall, alerterror } from '../component/sweetalerttwo';

import { FileText } from 'lucide-react';

const Addemployee = () => {
    const ChooseRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        document.title = 'Add Employee';
        get_database();
    }, []);

    const [Departments, setDepartments] = useState<DepartmentItem[]>([]);
    const get_database = async () => {
        loading('');
        const result_department = await get_department();
        setDepartments(result_department);
        loading('success');
    }

    // สำหรับนำข้อมูลที่เลือกมาไว้ในตัวแปรของแต่ละ Select
    const [Department, setDepartment] = useState<number>(0);
    const [UserType, setUserType] = useState<string>('');
    const [Level, setLevel] = useState<string>('');
    const [Status, setStatus] = useState<string>('');

    // สำหรับเช็คข้อมูลว่ามีค่าว่างหรือไม่ โดยเก็บเป้น true/false ถ้า true คือมีค่าว่างให้แสดงกรอบสีแดง และ false คืนค่าเดิม
    const [DepartmentCheck, setDepartmentCheck] = useState<boolean>(false);
    const [UserTypeCheck, setUserTypeCheck] = useState<boolean>(false);
    const [LevelCheck, setLevelCheck] = useState<boolean>(false);
    const [StatusCheck, setStatusCheck] = useState<boolean>(false);

    const DepartmentOptions = useMemo(() => { return Departments.map(emp => ({ value: emp.department_id, label: emp.department_name })); }, [Departments]);
    const UserTypeOptions = [{ value: 'user', label: 'user' }, { value: 'admin', label: 'admin' }];
    const LevelOptions = [{ value: 'level_1', label: 'level_1' }, { value: 'level_2', label: 'level_2' }, { value: 'level_3', label: 'level_3' }, { value: 'level_4', label: 'level_4' }, { value: 'level_5', label: 'level_5' }];
    const StatusOptions = [
        { value: 'employee', label: 'employee', color: '#10b981' },
        { value: 'resign', label: 'resign', color: '#6b7280' },
        { value: 'probation', label: 'probation', color: '#ef4444' },
        { value: 'temporary', label: 'temporary', color: '#eab308' }
    ];

    const [Preview, setPreview] = useState('https://placehold.co/160x200?text=2inch');
    const [FileName, setFileName] = useState('');
    const [File, setFile] = useState<File | null>(null);
    const SelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setFileName(file.name);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => setPreview(reader.result as string);
                reader.readAsDataURL(file);
            } else {
                setPreview('');
                setFileName('');
                setFile(null);
            }
        } else {
            setFile(null);
            setFileName('');
            setPreview('https://placehold.co/160x200?text=2inch');
            if (ChooseRef.current) ChooseRef.current.value = '';
        }
    };
    const handleChoose = () => ChooseRef.current?.click();

    // บันทึกข้อมูลพยักงาน
    const Submit = async () => {
        const emp_proflie = document.getElementById('emp_proflie') as HTMLInputElement;
        const emp_code = document.getElementById('emp_code') as HTMLInputElement;
        const emp_nameen = document.getElementById('emp_nameen') as HTMLInputElement;
        const emp_nameth = document.getElementById('emp_nameth') as HTMLInputElement;
        const emp_position = document.getElementById('emp_position') as HTMLInputElement;
        const emp_supervisor = document.getElementById('emp_supervisor') as HTMLInputElement;
        const emp_email = document.getElementById('emp_email') as HTMLInputElement;
        const emp_annotation = document.getElementById('emp_annotation') as HTMLInputElement;
        const emp_startdate = document.getElementById('emp_startdate') as HTMLInputElement;
        setStatusCheck(checkvalueselect(Status));
        setDepartmentCheck(checkvalueselect(Department));
        setLevelCheck(checkvalueselect(Level));
        setUserTypeCheck(checkvalueselect(UserType));
        if (!File || !emp_code.value || !emp_nameen.value || !emp_nameth.value || !emp_position.value || !emp_supervisor.value || !emp_email.value || !Status || !Department || !Level || !UserType || !emp_startdate.value) {
            checkvalueinput(emp_proflie, FileName);
            checkvalueinput(emp_code, emp_code.value);
            checkvalueinput(emp_nameen, emp_nameen.value);
            checkvalueinput(emp_nameth, emp_nameth.value);
            checkvalueinput(emp_position, emp_position.value);
            checkvalueinput(emp_supervisor, emp_supervisor.value);
            checkvalueinput(emp_email, emp_email.value);
            checkvalueinput(emp_startdate, emp_startdate.value);
            alertsmall('warning', 'Please complete or select all required information.');
            return;
        }
        // ส่งข้อมูลไป
        const formData = new FormData();
        formData.append('image_profile', File);
        formData.append('employee_code', emp_code.value);
        formData.append('employee_nameen', emp_nameen.value);
        formData.append('employee_nameth', emp_nameth.value);
        formData.append('employee_position', emp_position.value);
        formData.append('employee_department', String(Department));
        formData.append('employee_supervisor', emp_supervisor.value);
        formData.append('employee_usertype', UserType)
        formData.append('employee_email', emp_email.value);
        formData.append('employee_level', Level);
        formData.append('employee_status', Status);
        formData.append('employee_annotation', emp_annotation.value);
        formData.append('employee_startdate', emp_startdate.value);
        const result = await add_employee(formData);
        if (result === 'success') {
            alertsmall('success', 'Add Employee Successfully.');
            clearvalue();
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    // เคลียร์ค่าว่าง
    const clearvalue = () => {
        const emp_code = document.getElementById('emp_code') as HTMLInputElement;
        const emp_nameen = document.getElementById('emp_nameen') as HTMLInputElement;
        const emp_nameth = document.getElementById('emp_nameth') as HTMLInputElement;
        const emp_position = document.getElementById('emp_position') as HTMLInputElement;
        const emp_supervisor = document.getElementById('emp_supervisor') as HTMLInputElement;
        const emp_email = document.getElementById('emp_email') as HTMLInputElement;
        const emp_annotation = document.getElementById('emp_annotation') as HTMLInputElement;
        const emp_startdate = document.getElementById('emp_startdate') as HTMLInputElement;
        setFileName('');
        setPreview('https://placehold.co/160x200?text=2inch');
        emp_code.value = '';
        emp_nameen.value = '';
        emp_nameth.value = '';
        setStatus('');
        emp_position.value = '';
        setDepartment(0);
        emp_supervisor.value = '';
        setLevel('');
        emp_startdate.value = '';
        setUserType('');
        emp_email.value = '';
        emp_annotation.value = '';
    }

    return (
        <div className='d-flex'>
            <Sidebar page={4} />
            <Container fluid className='py-4 content flex-grow-1 margintop'>
                <Card className='shadow-sm' style={{ border: 'none', width: '100%' }}>
                    <Card.Header className='bg-warning form-header pt-4'>
                        <h2>New Employee Information Form</h2>
                        <p>Please complete all required employee information.</p>
                    </Card.Header>
                    <Card.Body>
                        <Row className='mt-4 midpoint'>
                            <Col md={12}>
                                <div className='midpoint'>
                                    <img src={Preview} alt='profile' className='img-fluid' style={{ height: 200, width: 160, border: '2px solid black', borderRadius: 25 }} />
                                </div>
                                <InputGroup className='mt-4 mb-3'>
                                    <InputGroup.Text>Image Profile</InputGroup.Text>
                                    <Form.Control type='text' id='emp_profile' onChange={(e) => checkvalueinput(e.target, e.target.value)} value={FileName} readOnly={true} placeholder='Choose your file here...' />
                                    <Button variant='warning' onClick={handleChoose}>Chosse File</Button>
                                    <input type='file' className='d-none' accept='image/*' ref={ChooseRef} onChange={SelectImage} />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className='title-section'>
                            <FileText /> - Personal Information
                        </div>
                        <Row className='mt-4'>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee Code:</Form.Label>
                                        <Form.Control type='text' id='emp_code' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee NameEnglish:</Form.Label>
                                        <Form.Control type='text' id='emp_nameen' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee NameThai:</Form.Label>
                                        <Form.Control type='text' id='emp_nameth' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee Status:</Form.Label>
                                        <CustomSelect value={Status} onChange={(value) => { setStatus(value); setStatusCheck(!value); }} options={StatusOptions} width='100%' dot={true} error={StatusCheck} />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <div className='title-section'>
                            <FileText /> - Job Position Information
                        </div>
                        <Row className='mt-4'>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee Position:</Form.Label>
                                        <Form.Control type='text' id='emp_position' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee Department:</Form.Label>
                                        <CustomSelect value={Department} onChange={(value) => { setDepartment(value); setDepartmentCheck(!value); }} options={DepartmentOptions} width='100%' dot={false} error={DepartmentCheck} />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee Supervisor:</Form.Label>
                                        <Form.Control type='text' id='emp_supervisor' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee Level:</Form.Label>
                                        <CustomSelect value={Level} onChange={(value) => { setLevel(value); setLevelCheck(!value); }} options={LevelOptions} width='100%' dot={false} error={LevelCheck} />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee StartDate:</Form.Label>
                                        <Form.Control type='date' id='emp_startdate' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <div className='title-section'>
                            <FileText /> - User Account Information
                        </div>
                        <Row className='mt-4'>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee UserType:</Form.Label>
                                        <CustomSelect value={UserType} onChange={(value) => { setUserType(value); setUserTypeCheck(!value); }} options={UserTypeOptions} width='100%' dot={false} error={UserTypeCheck} />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee Email:</Form.Label>
                                        <Form.Control type='text' id='emp_email' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={12}>
                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <Form.Label>Employee Annotation:</Form.Label>
                                        <Form.Control as='textarea' rows={3} id='emp_annotation' placeholder='Enter your text here...' />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer className='midpoint'>
                        <Button variant='dark' style={{ width: 200, marginRight: 10 }} onClick={clearvalue}>Clear Value</Button>
                        <Button variant='warning' style={{ width: 200 }} onClick={Submit}>Submit</Button>
                    </Card.Footer>
                </Card>
            </Container>
        </div>
    )
}

export default Addemployee;