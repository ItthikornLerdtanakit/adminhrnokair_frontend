import { useState, useMemo, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import type { EmployeeWithDepartment, DepartmentItem } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { loading } from '../component/sweetalerttwo';
import { get_employee, get_department } from '../component/connectdatabase';
import { CustomSelect } from '../component/customselects';
import Pagination from '../component/pagination';
import Modaleditemployee from '../component/modal/modaleditemployee';
import { formatdate, WorkTime } from '../component/functions';

import { Search, Edit } from 'lucide-react';

const Employee = () => {
    useEffect(() => {
        document.title = 'Employee';
        get_database();;
    }, []);

    const [Employee, setEmployee] = useState<EmployeeWithDepartment[]>([]);
    const [Department, setDepartment] = useState<DepartmentItem[]>([]);
    const get_database = async () => {
        loading('');
        const result_employee = await get_employee();
        const employee = result_employee.filter((item: EmployeeWithDepartment) => item.employee_status !== 'resign' && item.employee_status !== 'probation')
        setEmployee(employee);
        const result_department = await get_department();
        setDepartment(result_department);
        loading('success');
    }

    const EntriesOptions = [
        { value: 10, label: 'Show 10 entries' },
        { value: 20, label: 'Show 20 entries' },
        { value: 50, label: 'Show 50 entries' },
        { value: 100, label: 'Show 100 entries' }
    ];

    // State ต่างๆ
    const [SearchTerm, setSearchTerm] = useState<string>('');
    const [CurrentNumberPage, setCurrentNumberPage] = useState<number>(1);
    const [ItemsPerPage, setItemsPerPage] = useState<number>(10);

    // ฟังก์ชันค้นหา
    const SearchEmployee = useMemo(() => {
        return Employee.filter(emp =>
            emp.employee_code.toLowerCase().includes(SearchTerm) ||
            emp.employee_nameen.toLowerCase().includes(SearchTerm.toLowerCase()) ||
            emp.employee_nameth.includes(SearchTerm) ||
            emp.department_name.includes(SearchTerm) ||
            emp.employee_email.toLowerCase().includes(SearchTerm.toLowerCase())
        );
    }, [Employee, SearchTerm]);

    const StartIndex = (CurrentNumberPage - 1) * ItemsPerPage;
    const EndIndex = StartIndex + ItemsPerPage;
    const FilterEmployees = SearchEmployee.slice(StartIndex, EndIndex);

    // เมื่อต้องการแก้ไขข้อมูล
    // แสดงสีของสถานะ
    const colorstatus = (status: string): string => {
        const variants: Record<string, string> = {
            'employee': 'success',
            'probation': 'danger',
            'temporary': 'warning'
        };
        return variants[status] || 'secondary';
    };

    const [ShowModal, setShowModal] = useState(false);
    const [SelectEmployee, setSelectEmployee] = useState<EmployeeWithDepartment>();
    const OpenModalEditApplication = (item: EmployeeWithDepartment) => {
        setSelectEmployee(item);
        setShowModal(true);
    }
    const handleCloseModal = () => setShowModal(false);

    const escapeCSV = (value: any): string => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // ถ้ามี , หรือ " หรือขึ้นบรรทัดใหม่ ให้ครอบด้วย "
        if (/[",\n]/.test(stringValue)) {
            return `"${stringValue.replaceAll('"', '""')}"`;
        }
        return stringValue;
    };

    const exportToCSV = (data: EmployeeWithDepartment[], filename = 'export.csv'): void => {
        if (!data.length) return;
        // ตั้งหัวข้อ (header)
        const headers = ['NOKID', 'NameEnglish', 'NameThai', 'NickNameEnglish', 'NickNameThai', 'Telephone', 'Position', 'Supervisor', 'DepartmentID', 'UserType', 'Email', 'Level', 'Status', 'StartDate'];
        // แปลงข้อมูลเป็นแถว
        const rows = data.map(item =>
            [item.employee_code, item.employee_nameen, item.employee_nameth, item.employee_nicknameen, item.employee_nicknameth, item.employee_telephone, escapeCSV(item.employee_position), item.employee_supervisor, item.department_id, item.employee_usertype, item.employee_email, item.employee_level, item.employee_status, item.employee_startdate].join(',')
        );
        // รวม header + rows
        const csvContent = [headers.join(','), ...rows].join('\n');
        // สร้างไฟล์และดาวน์โหลด
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className='d-flex'>
            <Sidebar page={4} />
            <Container fluid className='py-4 content flex-grow-1 margintop'>
                <Card className='shadow-sm' style={{ border: 'none', width: '100%' }}>
                    <Card.Header className='bg-warning form-header pt-4'>
                        <h2>List of Employees</h2>
                        <p>Total number of employees: {Employee.length}</p>
                    </Card.Header>
                    <Card.Body>
                        <Row className='mb-3'>
                            <Col md={8} className='mb-2 mb-md-0'>
                                <Form onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group>
                                        <InputGroup>
                                            <InputGroup.Text><Search size={18} /></InputGroup.Text>
                                            <Form.Control type='text' onChange={(e) => { setSearchTerm(e.target.value); setCurrentNumberPage(1); }} value={SearchTerm} placeholder='Search NokID, Name, Department, Email' />
                                        </InputGroup>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={4}>
                                <Row>
                                    <Col className='col-8'>
                                        <CustomSelect value={ItemsPerPage} onChange={value => { setItemsPerPage(value); }} options={EntriesOptions} width='100%' dot={true} error={false} />
                                    </Col>
                                    <Col className='col-4'>
                                        <Button variant='success' style={{ width: '100%' }} onClick={() => exportToCSV(Employee)}>Export CSV</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{ overflowX: 'auto' }}>
                            <Table striped hover className='align-middle tbresponsive'>
                                <thead className='table-dark'>
                                    <tr className='text-center'>
                                        <th>EmployeeCode</th>
                                        <th>Name_English</th>
                                        <th>Position</th>
                                        <th>Department</th>
                                        <th>Supervisor</th>
                                        <th>UserType</th>
                                        <th>Email</th>
                                        <th>Level</th>
                                        <th>Status</th>
                                        <th>StartDate</th>
                                        <th>Work Duration</th>
                                        <th>Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FilterEmployees.map((emp) => (
                                        <tr key={emp.employee_id}>
                                            <td><strong>{emp.employee_code}</strong></td>
                                            <td>{emp.employee_nameen}</td>
                                            <td>{emp.employee_position}</td>
                                            <td>{emp.department_name}</td>
                                            <td className='text-center'><small className='text-muted'>{emp.employee_supervisor}</small></td>
                                            <td className='text-center'>{emp.employee_usertype}</td>
                                            <td><small>{emp.employee_email}</small></td>
                                            <td className='text-center'>{emp.employee_level}</td>
                                            <td className='text-center'>
                                                <span className={`badge bg-${colorstatus(emp.employee_status)}`}>
                                                    {emp.employee_status}
                                                </span>
                                            </td>
                                            <td className='text-center'>{formatdate(emp.employee_startdate)}</td>
                                            <td className='text-center'>{WorkTime(emp.employee_startdate)}</td>
                                            <td className='text-center'>
                                                <Button size='sm' variant='outline-primary' onClick={() => OpenModalEditApplication(emp)}>
                                                    <Edit size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Row>
                        <Pagination CountEmployee={SearchEmployee.length} ItemsPerPage={ItemsPerPage} CurrentNumberPage={CurrentNumberPage} setCurrentNumberPage={setCurrentNumberPage} />
                    </Card.Body>
                </Card>
            </Container>
            <Modaleditemployee ShowModal={ShowModal} handleCloseModal={handleCloseModal} SelectEmployee={SelectEmployee} Departments={Department} get_database={get_database} />
        </div>
    );
};

export default Employee;