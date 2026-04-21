import { useEffect, useState, useMemo } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import type { EmployeeWithDepartment, DepartmentItem, AdminNokintranestItem } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { get_employee, get_department, get_admin_nokintranest, save_admin_nokintranest, delete_admin_nokintranest } from '../component/connectdatabase';
import Pagination from '../component/pagination';
import { checkvalueinput } from '../component/functions';
import { alertsmall, alerterror, alertquestion } from '../component/sweetalerttwo';
import Modalselectemployee from '../component/modal/modalselectemployee';
import { CustomSelect } from '../component/customselects';

import { Search, Trash2 } from 'lucide-react';

const AdminNokintranest = () => {
    useEffect(() => {
        document.title = 'Admin Nokintranest';
        get_database();
    }, []);

    const [Employee, setEmployee] = useState<EmployeeWithDepartment[]>([]);
    const [Departments, setDepartments] = useState<DepartmentItem[]>([]);
    const DepartmentOptions = useMemo(() => { return Departments.map(emp => ({ value: emp.department_name, label: emp.department_name })); }, [Departments]);
    const [SelectEmployee, setSelectEmployee] = useState<EmployeeWithDepartment>();
    const [SearchData, setSearchData] = useState('');
    const [Department, setDepartment] = useState('');
    const [AdminNokintranest, setAdminNokintranest] = useState<AdminNokintranestItem[]>([]);
    const get_database = async () => {
        const result_employee = await get_employee();
        const result_employee_filter = result_employee.filter((item: EmployeeWithDepartment) => item.department_name === 'Learning and Development' || item.department_name === 'Digital Sales and Marketing' || item.department_name === 'People and Administration');
        setEmployee(result_employee_filter);
        const result_department = await get_department();
        const result_department_filter = result_department.filter((item: DepartmentItem) => item.department_name === 'Learning and Development' || item.department_name === 'Digital Sales and Marketing' || item.department_name === 'People and Administration');
        setDepartments(result_department_filter);
        const result_admin_nokintranest = await get_admin_nokintranest();
        setAdminNokintranest(result_admin_nokintranest);
    }

    const [ShowModal, setShowModal] = useState(false);
    const OpenModalSelect = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        if (SelectEmployee) {
            const emp_code = document.getElementById('emp_code') as HTMLInputElement;
            const emp_name = document.getElementById('emp_name') as HTMLInputElement;
            const emp_position = document.getElementById('emp_position') as HTMLInputElement;
            const emp_department = document.getElementById('emp_department') as HTMLInputElement;
            checkvalueinput(emp_code, emp_code.value);
            checkvalueinput(emp_name, emp_name.value);
            checkvalueinput(emp_position, emp_position.value);
            checkvalueinput(emp_department, emp_department.value);
        }
    }, [SelectEmployee]);

    const saveadminnokintranest = async () => {
        const emp_code = document.getElementById('emp_code') as HTMLInputElement;
        const emp_name = document.getElementById('emp_name') as HTMLInputElement;
        const emp_position = document.getElementById('emp_position') as HTMLInputElement;
        const emp_department = document.getElementById('emp_department') as HTMLInputElement;
        if (!emp_code.value || !emp_name.value || !emp_position.value || !emp_department.value) {
            checkvalueinput(emp_code, emp_code.value);
            checkvalueinput(emp_name, emp_name.value);
            checkvalueinput(emp_position, emp_position.value);
            checkvalueinput(emp_department, emp_department.value);
            alertsmall('warning', 'Please complete all required fields.');
            return;
        }
        const result = await save_admin_nokintranest(emp_code.value, emp_name.value, emp_position.value, emp_department.value);
        if (result === 'success') {
            get_database();
            setSelectEmployee(undefined);
            alertsmall('success', 'Add Admin Nokintranest Successfully.');
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    const countrows = 5;
    const [CurrentNumberPage, setCurrentNumberPage] = useState(1);

    const filtered = useMemo(() => {
        const q = SearchData.trim().toLowerCase();
        return AdminNokintranest.filter((item) => {
            // เงื่อนไขค้นหาข้อความ
            const matchText = (item.nokintranest_code ?? '').toLowerCase().includes(q) || (item.nokintranest_name ?? '').toLowerCase().includes(q);
            // เงื่อนไข department
            const matchDepartment = Department === '' || item.nokintranest_name === Department;
            return matchText && matchDepartment;
        });
    }, [AdminNokintranest, SearchData, Department]);
    useEffect(() => setCurrentNumberPage(1), [SearchData, Department]);
    const startindex = (CurrentNumberPage - 1) * countrows;
    const FilterAdminNokintranest = filtered.slice(startindex, startindex + countrows);

    const deleteadminnokintranest = async (nokintranest_id: number, nokintranest_name: string) => {
        const response = await alertquestion(`Do you want to delete employee ${nokintranest_name} ?`);
        if (response.isConfirmed) {
            const result = await delete_admin_nokintranest(nokintranest_id);
            if (result === 'success') {
                alertsmall('success', 'Delete Admin Nokintranest Successfully.');
                get_database();
            } else {
                alerterror('You cannot log in. Please contact the system administrator for assistance.');
            }
        }
    }

    return (
        <div className='d-flex'>
            <Sidebar page={12} />
            <Container fluid className='py-4 content flex-grow-1'>
                <div className='title-section' style={{ fontSize: 26 }}>Employee Admin Nokintranest</div>
                <Row className='mt-4'>
                    <Col md={12}>
                        <fieldset>
                            <legend>Add Admin Nokintranest</legend>
                            <Row>
                                <Col md={3}>
                                    <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label>Employee Code:</Form.Label>
                                            <Form.Control type='text' id='emp_code' style={{ cursor: 'pointer' }} onChange={(e) => checkvalueinput(e.target, e.target.value)} onClick={OpenModalSelect} value={SelectEmployee?.employee_code || ''} readOnly={true} placeholder='Click to select employees' />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={3}>
                                    <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label>Employee Name:</Form.Label>
                                            <Form.Control type='text' id='emp_name' style={{ cursor: 'pointer' }} onChange={(e) => checkvalueinput(e.target, e.target.value)} onClick={OpenModalSelect} value={SelectEmployee?.employee_nameen || ''} readOnly={true} placeholder='Click to select employees' />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={3}>
                                    <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label>Employee Position:</Form.Label>
                                            <Form.Control type='text' id='emp_position' style={{ cursor: 'pointer' }} onChange={(e) => checkvalueinput(e.target, e.target.value)} onClick={OpenModalSelect} value={SelectEmployee?.employee_position || ''} readOnly={true} placeholder='Click to select employees' />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={3}>
                                    <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label>Employee Department:</Form.Label>
                                            <Form.Control type='text' id='emp_department' style={{ cursor: 'pointer' }} onChange={(e) => checkvalueinput(e.target, e.target.value)} onClick={OpenModalSelect} value={SelectEmployee?.department_name || ''} readOnly={true} placeholder='Click to select employees' />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col md={12} className='midpoint'>
                                    <Button variant='warning' style={{ width: 150 }} onClick={saveadminnokintranest}>Save</Button>
                                </Col>
                            </Row>
                        </fieldset>
                    </Col>
                    <Col md={12} className='mt-4'>
                        <Row className='mb-3'>
                            <Col md={8} className='mb-2 mb-md-0'>
                                <span style={{ fontSize: 18 }}>Search Employee</span>
                                <Form onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <InputGroup>
                                            <InputGroup.Text><Search size={18} /></InputGroup.Text>
                                            <Form.Control type='text' onChange={(e) => setSearchData(e.target.value)} placeholder='Search NokID, Name' />
                                        </InputGroup>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={4}>
                                <span style={{ fontSize: 18 }}>Search Department</span>
                                <CustomSelect value={Department} onChange={(value) => { setDepartment(value); }} options={DepartmentOptions} width='100%' dot={false} error={false} />
                            </Col>
                        </Row>
                        <Row className='midpoint'>
                            <Table style={{ width: '98%', backgroundColor: '#fff7d1', border: '3px solid #ffca2c', verticalAlign: 'middle' }}>
                                <thead className='text-center'>
                                    <tr style={{ background: '#ffc107', verticalAlign: 'middle' }}>
                                        <th>No</th>
                                        <th>NOKID</th>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Department</th>
                                        <th>Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FilterAdminNokintranest.map((row, i) => (
                                        <tr key={row.nokintranest_code} style={{ background: i % 2 === 0 ? '#fff3cd' : '#ffecb5' }}>
                                            <td className='text-center'>{i + 1}</td>
                                            <td className='text-center'>{row.nokintranest_code}</td>
                                            <td>{row.nokintranest_name}</td>
                                            <td>{row.nokintranest_position}</td>
                                            <td>{row.nokintranest_department}</td>
                                            <td className='text-center' style={{ width: 120 }}>
                                                <Button variant='dark' onClick={() => deleteadminnokintranest(Number(row.nokintranest_id), row.nokintranest_name)}><Trash2 size={18} /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Pagination CountEmployee={filtered.length} ItemsPerPage={countrows} CurrentNumberPage={CurrentNumberPage} setCurrentNumberPage={setCurrentNumberPage} />
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Modalselectemployee ShowModal={ShowModal} Employee={Employee} Departments={Departments} setSelectEmployee={setSelectEmployee} handleCloseModal={handleCloseModal} />
        </div>
    )
}

export default AdminNokintranest;