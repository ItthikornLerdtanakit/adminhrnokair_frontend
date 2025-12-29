import { useState, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { save_group } from '../connectdatabase';
import { checkvalueinput } from '../functions';
import { alertsmall } from '../sweetalerttwo';

import type { ModalItem as BaseModalItem, DepartmentItem as BaseDepartmentItem, MemberItem as BaseMemberItem } from '../interfaces';

import { CustomSelect } from '../customselects';

interface DepartmentItem extends BaseDepartmentItem {
    department_check?: boolean;
}

interface MemberItem extends BaseMemberItem {
    employee_check?: boolean;
}

interface ModalItem extends BaseModalItem {
    Department: DepartmentItem[];
    Employee: MemberItem[];
    get_database: () => void;
}

const statusOptions = [
    { value: 'individual', label: 'Select by Individual' },
    { value: 'category', label: 'Select by Category' },
    { value: 'department', label: 'Select by Department' },
    { value: 'all', label: 'Select All Employees' }
];

const ModalAddGroup = (item: ModalItem) => {
    const { ShowModal, handleCloseModal, Department, Employee, get_database } = item;
    const [SelectedType, setSelectedType] = useState('individual');

    // ดึงข้อมูลพนักงานเพื่อนำมาแสดงผลเป็นตัวเลือกสำหรับเลือกพนักงานหลายคน
    const [DepartmentWithCheck, setDepartmentWithCheck] = useState<DepartmentItem[]>([]);
    const [Category, setCategory] = useState([
        { category_id: 1, category_value: 'backoffice', category_label: 'Corporate Employee', category_check: false },
        { category_id: 2, category_value: 'crew', category_label: 'Crew Employee', category_check: false }
    ])

    // ดึงข้อมูลพนักงานมาเก็บไว้โดย Members เป็นการเก้ฐข้อมูลเพื่อนำมาบันทึกลงใน database และ FilterMembers ไว้สำหรับแสดงผล
    const [Members, setMembers] = useState<MemberItem[]>([]);
    const [FilterMembers, setFilterMembers] = useState<MemberItem[]>([]);
    useEffect(() => {
        setDepartmentWithCheck(Department.map(item => ({ ...item, department_check: false })));
        setMembers(Employee.map(item => ({ ...item, employee_check: false })));
        setFilterMembers(Employee.map(item => ({ ...item, employee_check: false })));
    }, [ShowModal]);

    // เมื่อในกรณีที่กดปุ่ม Submit แล้วยังไม่มีข้อมูลพนักงานที่เลือกจึงทำให้เกิดกรอบแดง เลยจึงทำให้ต้องกำหนดค่าว่าถ้าพนักงานถูกเลือกตั้งแต่ 1 คนให้ลบกรอบแดงออก
    useEffect(() => {
        if (Members.length && FilterMembers.length) {
            const employee_select = document.getElementById('employee_select') as HTMLDivElement;
            checkvalueinput(employee_select, 1);
        }
    }, [FilterMembers, Members]);

    // ค้นหาข้อมูลพนักงานสำหรับเฉพาะรายบุคคล
    const SearchEmployee = (keyword: string) => {
        const result = Members.filter(employee => employee.employee_nameen.toLowerCase().includes(keyword.toLowerCase()));
        setFilterMembers(result);
    }

    // ในกรณีที่เลือกติ๊กเฉพาะแผนก
    const CheckDepartment = (department_id: number, check: boolean) => {
        setDepartmentWithCheck(prev => prev.map(member => member.department_id === department_id ? { ...member, department_check: check } : member));
        setMembers(prev => prev.map(member => member.department_id === department_id ? { ...member, employee_check: check } : member));
        setFilterMembers(prev => prev.map(member => member.department_id === department_id ? { ...member, employee_check: check } : member));
    }

    // ในกรณีที่เลือกติ๊กเฉพาะหมวด
    const CheckCategory = (type: string, id: number, check: boolean) => {
        const result_category = Category.map(cate => cate.category_id === id ? { ...cate, category_check: check } : cate);
        setCategory(result_category);
        if (type === 'backoffice') {
            setCategory(result_category);
            setMembers(prev => prev.map(member => member.department_id !== 23 && member.department_id !== 24 ? { ...member, employee_check: check } : member));
            setFilterMembers(prev => prev.map(member => member.department_id !== 23 && member.department_id !== 24 ? { ...member, employee_check: check } : member));
            if (check) {
                const result_department = DepartmentWithCheck.map(dept => ({ ...dept, department_check: dept.department_id !== 23 && dept.department_id !== 24 }));
                setDepartmentWithCheck(result_department);
            } else {
                const result_department = DepartmentWithCheck.map(dept => ({ ...dept, department_check: false }));
                setDepartmentWithCheck(result_department);
            }
        } else if (type === 'crew') {
            console.log(check);
            setMembers(prev => prev.map(member => member.department_id === 23 || member.department_id === 24 ? { ...member, employee_check: check } : member));
            setFilterMembers(prev => prev.map(member => member.department_id === 23 || member.department_id === 24 ? { ...member, employee_check: check } : member));
            if (check) {
                const result_department = DepartmentWithCheck.map(dept => ({ ...dept, department_check: dept.department_id === 23 || dept.department_id === 24 }));
                setDepartmentWithCheck(result_department);
            } else {
                const result_department = DepartmentWithCheck.map(dept => ({ ...dept, department_check: false }));
                setDepartmentWithCheck(result_department);
            }
        }
    }

    // ในกรณีที่เลือกติ๊กเฉพาะรายบุคคล
    const CheckEmployee = (id: number, check: boolean) => {
        const result_member = Members.map(member => member.employee_id === id ? { ...member, employee_check: check } : member);
        const result_filter = FilterMembers.map(member => member.employee_id === id ? { ...member, employee_check: check } : member);
        setMembers(result_member);
        setFilterMembers(result_filter);
        const deptId = result_member.find(e => e.employee_id === id)?.department_id;
        const members = result_member.filter(e => e.department_id === deptId);
        const allChecked = members.every(e => e.employee_check === true);
        setDepartmentWithCheck(prev => prev.map(member => member.department_id === deptId ? { ...member, department_check: allChecked } : member));
    }

    //  ในกรณีที่เลือกทั้งหมด
    useEffect(() => {
        if (SelectedType === 'all') {
            const result_member = Members.map(member => ({ ...member, employee_check: true }));
            setMembers(result_member);
            setFilterMembers(result_member);
            const result_department = DepartmentWithCheck.map(dept => ({ ...dept, department_check: true }));
            setDepartmentWithCheck(result_department)
        }
    }, [SelectedType]);

    // บันทึกกลุ่มการใช้งาน
    const Submit = async () => {
        const memberfilter = Members.filter(data => data.employee_check === true).map(item => item.employee_id);
        const group_name = document.getElementById('group_name') as HTMLInputElement;
        const employee_select = document.getElementById('employee_select') as HTMLDivElement;
        if (!group_name.value || memberfilter.length === 0) {
            checkvalueinput(group_name, group_name.value);
            checkvalueinput(employee_select, memberfilter.length);
            alertsmall('warning', 'Please complete or select all required information.');
            return;
        }
        const result = await save_group(group_name.value, memberfilter);
        if (result === 'success') {
            handleCloseModal();
            alertsmall('success', 'Save Group Successfully.');
            get_database();
        }
    }

    return (
        <Modal size='lg' show={ShowModal} onHide={handleCloseModal} enforceFocus={false} restoreFocus={false}>
            <Modal.Header closeButton  className='bg-warning'>
                <Modal.Title>Add Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='mb-4'>
                    <Form.Group>
                        <Form.Label>Group Name:</Form.Label>
                        <Form.Control type='text' id='group_name' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4'>
                    <Form.Group>
                        <Form.Label>Select Type:</Form.Label>
                        <CustomSelect value={SelectedType} onChange={setSelectedType} options={statusOptions} width='100%' dot={false} />
                    </Form.Group>
                </Form>
                <Row>
                </Row>
                <Row>
                    {SelectedType === 'individual' ? (
                        <Col lg={7} className='d-none d-lg-block mb-3'>
                            <h6 className='fw-bold'>All Employees List</h6>
                            <div className='border rounded p-3' style={{ height: 300, overflowY: 'auto' }}>
                                <div className='mb-2'>
                                    <Form>
                                        <Form.Group>
                                            <Form.Control type='text' placeholder='🔍 Search Employee' onChange={(e) => SearchEmployee(e.target.value)} />
                                        </Form.Group>
                                    </Form>
                                </div>
                                {FilterMembers.map(item => (
                                    <div key={item.employee_id} className={`p-2 mb-2 rounded cursor-pointer ${item.employee_check === true ? 'bg-warning' : 'bg-light'}`}>
                                        <label htmlFor={'check_employee_' + (item.employee_id)} className='custom-radio' style={{ marginTop: 'unset' }}>
                                            <input type='checkbox' id={'check_employee_' + (item.employee_id)} defaultChecked={item.employee_check} className='radio-input' onChange={(e) => CheckEmployee(item.employee_id, e.target.checked)} />
                                            <span className='checkmark'></span>
                                            <span>{item.employee_nameen}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    ) : null}
                    {SelectedType === 'category' ? (
                        <Col ld={7} className='mb-3'>
                            <h6 className='fw-bold'>Select the desired category</h6>
                            <div className='border rounded p-3' style={{ height: 300, overflowY: 'auto' }}>
                                {Category.map(item => (
                                    <div key={item.category_id} className={`p-2 mb-2 rounded cursor-pointer  ${item.category_check === true ? 'bg-warning' : 'bg-light'}`}>
                                        <label htmlFor={'check_' + item.category_value} className='custom-radio' style={{ marginTop: 'unset' }}>
                                            <input type='checkbox' id={'check_' + item.category_value} defaultChecked={item.category_check} className='radio-input' onChange={(e) => CheckCategory(item.category_value, item.category_id, e.target.checked)} />
                                            <span className='checkmark'></span>
                                            <span>{item.category_label}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    ) : null}
                    {SelectedType === 'department' ? (
                        <Col lg={7} className='mb-3'>
                            <h6 className='fw-bold'>Select the desired department</h6>
                            <div>
                                <div className='border rounded p-3' style={{ height: 300, overflowY: 'auto' }}>
                                    {DepartmentWithCheck.map(item => (
                                        <div key={item.department_id} className={`p-2 mb-2 rounded cursor-pointer ${item.department_check === true ? 'bg-warning' : 'bg-light'}`}>
                                            {item.department_code % 10000 === 0 ? (
                                                <label htmlFor={'check_' + (item.department_id)} className='custom-radio' style={{ marginTop: 'unset' }}>
                                                    <input type='checkbox' id={'check_' + (item.department_id)} defaultChecked={item.department_check} className='radio-input' onChange={(e) => CheckDepartment(item.department_id, e.target.checked)}  />
                                                    <span className='checkmark'></span>
                                                    <span>{item.department_code} - {item.department_name}</span>
                                                </label>
                                            ) : (
                                                <label htmlFor={'check_' + (item.department_id)} className='custom-radio' style={{ marginTop: 'unset' }}>
                                                    <span style={{ fontSize: 14, color: '#6c757d', marginRight: 5 }}>└─</span>
                                                    <input type='checkbox' id={'check_' + (item.department_id)} defaultChecked={item.department_check} className='radio-input' onChange={(e) => CheckDepartment(item.department_id, e.target.checked)} />
                                                    <span className='checkmark'></span>
                                                    <span>{item.department_code} - {item.department_name}</span>
                                                </label>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    ) : null}
                    
                    <Col lg={SelectedType === 'all' ? 12 : 5}>
                        <h6 className='fw-bold'>Employees to be selected</h6>
                        <div id='employee_select' className='rounded p-3' style={{ height: 300, overflowY: 'auto', border: '1px solid rgb(222, 226, 230)' }}>
                            {Members.filter(data => data.employee_check === true).map((item, index) => (
                                <div key={index + 1} className={`p-2 mb-2 rounded cursor-pointer bg-light`}>
                                    <span>{item.employee_nameen}</span>
                                </div>
                            ))}
                            {Members.filter(data => data.employee_check === true).length === 0 ? (
                                <p className="text-muted text-center mt-5">No employees available.</p>
                            ) : null}
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className='midpoint'>
                <Button variant='dark' onClick={handleCloseModal}>Cancel</Button>
                <Button variant='warning' onClick={Submit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default ModalAddGroup;
