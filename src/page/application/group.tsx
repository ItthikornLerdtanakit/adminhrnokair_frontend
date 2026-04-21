import { useEffect, useState } from 'react';
import { Trash2, Edit3 } from 'lucide-react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import type { DepartmentItem, MemberItem, RawGroupItem, MemberGroupItem, GroupWithMemberItem } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { get_group, get_department, get_employee, delete_group } from '../component/connectdatabase';
import ModalAddGroup from '../component/modal/modalgroup';
import { alertsmall, alertquestion } from '../component/sweetalerttwo';

const Application_Settings = () => {
    useEffect(() => {
        document.title = 'Application Setting';
        get_database();
    }, []);

    const [Department, setDepartment] = useState<DepartmentItem[]>([]);
    const [Employee, setEmployee] = useState<MemberItem[]>([]);
    const [Group, setGroup] = useState<GroupWithMemberItem[]>([]);
    const get_database = async () => {
        const result_group = await get_group();
        const result_department = await get_department();
        setDepartment(result_department);
        const result_employee = await get_employee();
        setEmployee(result_employee);
        const get_group_member = (data: RawGroupItem[]): GroupWithMemberItem[] => {
            const grouped = data.reduce<Record<number, GroupWithMemberItem>>(
                (acc, item) => {
                    if (!acc[item.group_id]) {
                        acc[item.group_id] = { group_id: item.group_id, group_name: item.group_name, members: [] };
                    }
                    acc[item.group_id].members.push({ employee_id: item.employee_id, employee_nameen: item.employee_nameen });
                    return acc;
                },
                {}
            );
            return Object.values(grouped);
        };
        setGroup(get_group_member(result_group))

    }

    // ป๊อปอัพของ Add Group
    const [ShowModal, setShowModal] = useState(false);
    const [GroupID, setGroupID] = useState(0);
    const [GroupName, setGroupName] = useState('');
    const [EmployeeSelect, setEmployeeSelect] = useState<number[]>([])
    const OpenModal = (group_id: number, group_name: string, type: string, data: MemberGroupItem[] | null) => {
        if (type === 'add') {
            setEmployeeSelect([]);
            setGroupID(0);
            setGroupName('');
        } else if (type === 'update') {
            const employee_id = data!.map(m => m.employee_id);
            setEmployeeSelect(employee_id);
            setGroupID(group_id);
            setGroupName(group_name);
        }
        setShowModal(true);
    }
    const handleCloseModal = () => setShowModal(false);

    // ลบแอพพลิเคชั่น
    const remove = async (group_id: number, group_name: string) => {
        const response = await alertquestion(`Do you want to delete ${group_name} ?`);
        if (response.isConfirmed) {
            const result = await delete_group(group_id);
            if (result === 'success') {
                alertsmall('success', 'Delete Application Successfully.');
                get_database();
            }
        }
    }

    return (
        <div className='d-flex'>
            <Sidebar page={3} />
            <div className='content flex-grow-1 mt-4'>
                <Row>
                    <h1 className='midpoint'>User Group Management</h1>
                </Row>
                <Row className='midpoint mt-4'>
                    <Col md={10} className='mt-2'>
                        <Row className='headers mb-3'>
                            <Col md={9}>
                                <p>Group</p>
                            </Col>
                            <Col md={3} className='d-flex justify-content-end mb-2'>
                                <Button variant='warning' style={{ height: 30, width: 130, fontSize: 13 }} className='me-2 w-100' onClick={() => OpenModal(0, '', 'add', null)}>Add Groups</Button>
                            </Col>
                        </Row>
                        <Row className='mb-2 g-3'>
                            {Group?.map(item => (
                                <Col md={6} key={item.group_id} className='mb-3'>
                                    <Card>
                                        <Card.Body>
                                            <div className='d-flex justify-content-between align-items-start'>
                                                <div>
                                                    <h5 className='card-title'>{item.group_name}</h5>
                                                </div>
                                                <div className='btn-group'>
                                                    <Button variant='primary' style={{ height: 40, width: 44, borderTopRightRadius: 5, borderBottomRightRadius: 5 }} className='d-flex align-items-center justify-content-center' onClick={() => OpenModal(item.group_id, item.group_name, 'update', item.members)}>
                                                        <Edit3 size={16} />
                                                    </Button>
                                                    <Button variant='danger' style={{ height: 40, width: 44, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} className='d-flex align-items-center justify-content-center ms-1' onClick={() => remove(item.group_id, item.group_name)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='mt-3'>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <strong className='me-2'>Member:</strong>
                                                    <span className='badge bg-secondary'>{item.members.length} Persons</span>
                                                </div>
                                                <div className='d-flex flex-wrap gap-1'>
                                                    {item.members.slice(0, 3).map(user => (
                                                        <span key={user.employee_id} className='badge bg-light text-dark border'>{user.employee_nameen}</span>
                                                    ))}
                                                    {item.members.length > 3 && (
                                                        <span className='badge bg-light text-dark border'> +{item.members.length - 3} Persons</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                    </Col>
                </Row>
            </div>
            <ModalAddGroup ShowModal={ShowModal} handleCloseModal={handleCloseModal} Department={Department} Employee={Employee} GroupID={GroupID} GroupName={GroupName} EmployeeSelect={EmployeeSelect} get_database={get_database} />
        </div>
    )
}

export default Application_Settings;