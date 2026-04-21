import { useEffect, useState, useMemo } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

import type { ModalItem as BaseModalItem, EmployeeWithDepartment, DepartmentItem } from '../interfaces';

import Pagination from '../pagination';
import { CustomSelect } from '../customselects';

import { Search } from 'lucide-react';

interface ModalItem extends BaseModalItem {
    Employee: EmployeeWithDepartment[];
    Departments: DepartmentItem[];
    setSelectEmployee: (value: EmployeeWithDepartment) => void;
}

const Modalselectemployee = (item: ModalItem) => {
    const { ShowModal, Employee, Departments, setSelectEmployee, handleCloseModal } = item;

    const [SearchData, setSearchData] = useState('');
    const [Department, setDepartment] = useState(0);
    useEffect(() => {
        if (ShowModal) {
            setSearchData('');
            setDepartment(0);
        }
    }, [ShowModal])

    const DepartmentOptions = useMemo(() => { return Departments.map(emp => ({ value: emp.department_id, label: emp.department_name })); }, [Departments]);
    const countrows = 10;
    const [CurrentNumberPage, setCurrentNumberPage] = useState(1);

    const filtered = useMemo(() => {
        const q = SearchData.trim().toLowerCase();
        return Employee.filter((item) => {
            // เงื่อนไขค้นหาข้อความ
            const matchText = (item.employee_code ?? '').toLowerCase().includes(q) || (item.employee_nameen ?? '').toLowerCase().includes(q);
            // เงื่อนไข department
            const matchDepartment = Department === 0 || item.department_id === Department;
            return matchText && matchDepartment;
        });
    }, [Employee, SearchData, Department]);

    useEffect(() => setCurrentNumberPage(1), [SearchData, Department]);
    const startindex = (CurrentNumberPage - 1) * countrows;
    const FilterEmployee = filtered.slice(startindex, startindex + countrows);

    return (
        <Modal dialogClassName='employee-select-modal' show={ShowModal} onHide={handleCloseModal} enforceFocus={false} restoreFocus={false}>
            <Modal.Header closeButton className='bg-warning'>
                <Modal.Title>Select Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                                <th>Employee Code</th>
                                <th>Employee Name</th>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {FilterEmployee.map((row, i) => (
                                <tr key={row.employee_code} style={{ background: i % 2 === 0 ? '#fff3cd' : '#ffecb5' }}>
                                    <td className='text-center'>{i + 1}</td>
                                    <td className='text-center'>{row.employee_code}</td>
                                    <td>{row.employee_nameen}</td>
                                    <td style={{ width: 400 }}>{row.employee_position}</td>
                                    <td>{row.department_name}</td>
                                    <td className='text-center' style={{ width: 120 }}>
                                        <Button variant='dark' onClick={() => { setSelectEmployee(row); handleCloseModal(); }}>Select</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination CountEmployee={filtered.length} ItemsPerPage={countrows} CurrentNumberPage={CurrentNumberPage} setCurrentNumberPage={setCurrentNumberPage} />
                </Row>
            </Modal.Body>
            <Modal.Footer className='midpoint'>
                <Button variant='dark' onClick={handleCloseModal}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default Modalselectemployee;
