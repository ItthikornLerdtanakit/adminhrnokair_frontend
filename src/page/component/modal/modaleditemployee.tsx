import { useState, useEffect, useMemo, useRef } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import type { ModalItem as BaseModalItem, EmployeeWithDepartment, DepartmentItem } from '../interfaces';

import { CustomSelect } from '../customselects';
import { checkvalueinput } from '../functions';
import { alertsmall, alertquestion } from '../sweetalerttwo';
import { update_employee, delete_employee } from '../connectdatabase';

interface ModalItem extends BaseModalItem {
    SelectEmployee?: EmployeeWithDepartment;
    Departments?: DepartmentItem[];
    get_database: () => void;
}

const Modaleditemployee = (item: ModalItem) => {
    const { ShowModal, handleCloseModal, SelectEmployee, Departments, get_database } = item;
    const ChooseRef = useRef<HTMLInputElement | null>(null);

    const [Department, setDepartment] = useState<number>(0);
    const [UserType, setUserType] = useState<string>('');
    const [Level, setLevel] = useState<string>('');
    const [Status, setStatus] = useState<string>('');
    const [Image, setImage] = useState('');
    const [SelectImageType, setSelectImageType] = useState('oldimage');
    const type = (s: any) => /\.(png|jpe?g|gif|webp|svg)$/i.test(s.split('?')[0]) ? 'image' : 'url';
    const [EndDate, setEndDate] = useState(true);
    useEffect(() => {
        if (SelectEmployee) {
            setPreview('https://placehold.co/160x200?text=2inch');
            setImage('oldimage');
            setSelectImageType('oldimage');
            setDepartment(SelectEmployee.department_id);
            setUserType(SelectEmployee.employee_usertype);
            setLevel(SelectEmployee.employee_level);
            setStatus(SelectEmployee.employee_status);
            const url = type(SelectEmployee.employee_image) === 'image' ? import.meta.env.VITE_IPADDRESS + '/uploads/profile/' + SelectEmployee.employee_image : SelectEmployee.employee_image;
            setImage(url);
        }           
    }, [SelectEmployee, ShowModal]);
    
    const DepartmentOptions = useMemo(() => { return Departments!.map(emp => ({ value: emp.department_id, label: emp.department_name })); }, [Departments]);
    const UserTypeOptions = [{ value: 'user', label: 'user' }, { value: 'admin', label: 'admin' }];
    const LevelOptions = [{ value: 'level_1', label: 'level_1' }, { value: 'level_2', label: 'level_2' }, { value: 'level_3', label: 'level_3' }, { value: 'level_4', label: 'level_4' }, { value: 'level_5', label: 'level_5' }];
    const StatusOptions = [
        { value: 'employee', label: 'employee', color: '#10b981' },
        { value: 'resign', label: 'resign', color: '#6b7280' },
        { value: 'probation', label: 'probation', color: '#ef4444' },
        { value: 'temporary', label: 'temporary', color: '#eab308' }
    ];

    const [Preview, setPreview] = useState('https://placehold.co/160x200?text=2inch');
    const [FileName, setFileName] = useState('https://placehold.co/160x200?text=2inch');
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

    useEffect(() => setImage(Preview), [Preview]);
    useEffect(() => setEndDate((Status !== 'resign')), [Status]);
    useEffect(() => { document.getElementById('emp_enddate') && checkvalueinput(document.getElementById('emp_enddate') as HTMLInputElement, 'true'); }, [EndDate]);

    // บันทึกข้อมูลพยักงาน
    const Submit = async () => {
        const emp_code = document.getElementById('emp_code') as HTMLInputElement;
        const emp_nameen = document.getElementById('emp_nameen') as HTMLInputElement;
        const emp_nameth = document.getElementById('emp_nameth') as HTMLInputElement;
        const emp_position = document.getElementById('emp_position') as HTMLInputElement;
        const emp_supervisor = document.getElementById('emp_supervisor') as HTMLInputElement;
        const emp_email = document.getElementById('emp_email') as HTMLInputElement;
        const emp_annotation = document.getElementById('emp_annotation') as HTMLInputElement;
        const emp_startdate = document.getElementById('emp_startdate') as HTMLInputElement;
        const emp_enddate = document.getElementById('emp_enddate') as HTMLInputElement;
        if (!emp_code.value || !emp_nameen.value || !emp_nameth.value || !emp_position.value || !emp_supervisor.value || !emp_email.value || !emp_startdate.value) {
            checkvalueinput(emp_code, emp_code.value);
            checkvalueinput(emp_nameen, emp_nameen.value);
            checkvalueinput(emp_nameth, emp_nameth.value);
            checkvalueinput(emp_position, emp_position.value);
            checkvalueinput(emp_supervisor, emp_supervisor.value);
            checkvalueinput(emp_email, emp_email.value);
            checkvalueinput(emp_startdate, emp_startdate.value);
            alertsmall('warning', 'Please complete or select all required information.');
            return;
        } else if (!EndDate && !emp_enddate.value) {
            checkvalueinput(emp_enddate, emp_enddate.value);
            alertsmall('warning', 'Please complete or select all required information.');
            return;
        }
        // ส่งข้อมูลไป
        const formData = new FormData();
        formData.append('image_update_profile', File!);
        formData.append('employee_imagetype', SelectImageType);
        formData.append('employee_id', String(SelectEmployee!.employee_id));
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
        formData.append('employee_image', SelectEmployee!.employee_image);
        formData.append('employee_annotation', emp_annotation.value);
        formData.append('employee_startdate', emp_startdate.value);
        formData.append('employee_enddate', emp_enddate.value);
        const result = await update_employee(formData);
        if (result === 'success') {
            handleCloseModal();
            alertsmall('success', 'Update Employee Successfully.');
            get_database();
        }
    }

    const remove = async () => {
        const response = await alertquestion(`Do you want to delete ${SelectEmployee?.employee_code} - ${SelectEmployee?.employee_nameen} ?`);
        if (response.isConfirmed) {
            const result = await delete_employee(SelectEmployee!.employee_id);
            if (result === 'success') {
                CloseModal();
                alertsmall('success', 'Delete Employee Successfully.');
                get_database();
            }
        }
    }

    const CloseModal = () => {
        setSelectImageType('oldimage');
        setPreview('');
        setImage('oldimage');
        setFile(null);
        handleCloseModal();
    }

    return (
        <Modal size='lg' show={ShowModal} onHide={handleCloseModal} enforceFocus={false} restoreFocus={false}>
            <Modal.Header closeButton className='bg-warning'>
                <Modal.Title>Edit Employee ID : {SelectEmployee?.employee_id} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='mb-3'>
                    <Col md='auto' className='mb-4'>
                        <div className=''>
                            <img src={Image || undefined} alt='profile' className='img-fluid' style={{ height: 200, width: 160, border: '2px solid black', borderRadius: 25 }} />
                        </div>
                    </Col>
                    <Col md={9}>
                        <Form>
                            <div>
                                <Form.Check inline label='Old Image' name='imagetype' type='radio' id='oldimage' value='oldimage' checked={SelectImageType === 'oldimage'} onChange={(e) => { setSelectImageType(e.target.value); setImage(type(SelectEmployee!.employee_image) === 'image' ? import.meta.env.VITE_IPADDRESS + '/uploads/profile/' + SelectEmployee!.employee_image : SelectEmployee!.employee_image) }} />
                                <Form.Check inline label='New Image' name='imagetype' type='radio' id='newimage' value='newimage' checked={SelectImageType === 'newimage'} onChange={(e) => { setSelectImageType(e.target.value); setImage(Preview) }} />
                            </div>
                        </Form>
                        {SelectImageType === 'oldimage' && (
                            <Form className='mt-2' onSubmit={(e) => e.preventDefault()}>
                                <Form.Group>
                                    <Form.Label>Employee Profile Image:</Form.Label>
                                    <Form.Control type='text' id='emp_profile_old' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectEmployee?.employee_image} placeholder='Enter your text here...' />
                                </Form.Group>
                            </Form>
                        )}
                        {SelectImageType === 'newimage' && (
                            <InputGroup className='mt-2 mb-3'>
                                <InputGroup.Text>Image Profile</InputGroup.Text>
                                <Form.Control type='text' id='emp_profile' onChange={(e) => checkvalueinput(e.target, e.target.value)} value={FileName} readOnly={true} placeholder='Choose your file here...' />
                                <Button variant='warning' onClick={handleChoose}>Chosse File</Button>
                                <input type='file' className='d-none' accept='image/*' ref={ChooseRef} onChange={SelectImage} />
                            </InputGroup>
                        )}
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee Code:</Form.Label>
                                <Form.Control type='text' id='emp_code' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectEmployee?.employee_code} placeholder='Enter your text here...' />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee NameEnglish:</Form.Label>
                                <Form.Control type='text' id='emp_nameen' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectEmployee?.employee_nameen} placeholder='Enter your text here...' />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee NameThai:</Form.Label>
                                <Form.Control type='text' id='emp_nameth' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectEmployee?.employee_nameth} placeholder='Enter your text here...' />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee Position:</Form.Label>
                                <Form.Control type='text' id='emp_position' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectEmployee?.employee_position} placeholder='Enter your text here...' />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee Department:</Form.Label>
                                <CustomSelect value={Department} onChange={value => { setDepartment(value); }} options={DepartmentOptions} width='100%' dot={false} error={false} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee Supervisor:</Form.Label>
                                <Form.Control type='text' id='emp_supervisor' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectEmployee?.employee_supervisor} placeholder='Enter your text here...' />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee UserType:</Form.Label>
                                <CustomSelect value={UserType} onChange={value => { setUserType(value); }} options={UserTypeOptions} width='100%' dot={false} error={false} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee Email:</Form.Label>
                                <Form.Control type='text' id='emp_email' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectEmployee?.employee_email} placeholder='Enter your text here...' />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee Level:</Form.Label>
                                <CustomSelect value={Level} onChange={value => { setLevel(value); }} options={LevelOptions} width='100%' dot={false} error={false} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee Status:</Form.Label>
                                <CustomSelect value={Status} onChange={value => { setStatus(value); }} options={StatusOptions} width='100%' dot={true} error={false} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee StartDate:</Form.Label>
                                <Form.Control type='date' id='emp_startdate' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectEmployee?.employee_startdate} placeholder='Enter your text here...' />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee EndDate:</Form.Label>
                                <Form.Control type='date' id='emp_enddate' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectEmployee?.employee_enddate} disabled={EndDate} placeholder='Enter your text here...' />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={12}>
                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Employee Annotation:</Form.Label>
                                <Form.Control as='textarea' rows={3} id='emp_annotation' defaultValue={SelectEmployee?.employee_annotation} placeholder='Enter your text here...' />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className='midpoint'>
                {SelectEmployee?.employee_status === 'resign' && (
                    <Button variant='danger' onClick={remove}>Delete</Button>
                )}
                <Button variant='dark' onClick={handleCloseModal}>Cancel</Button>
                <Button variant='warning' onClick={Submit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Modaleditemployee;