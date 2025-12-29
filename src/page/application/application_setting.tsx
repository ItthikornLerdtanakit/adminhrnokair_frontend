import { useEffect, useState } from 'react';
import { Trash2, Edit3 } from 'lucide-react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import type { DepartmentItem, GroupItem, ApplicationItem, MemberItem } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { get_application_setting, update_application_select, delete_application } from '../component/connectdatabase';
import { CustomSelect } from '../component/customselects';
import ModalAddGroup from '../component/modal/modaladdgroup';
import ModalAddApplication from '../component/modal/modaladdapplication';
import ModalEditApplication from '../component/modal/modaleditapplication';
import { alertsmall, alertquestion } from '../component/sweetalerttwo';

const Application_Settings = () => {
    useEffect(() => {
        document.title = 'Application Setting';
        get_database();
    }, []);

    const [Department, setDepartment] = useState<DepartmentItem[]>([]);
    const [Group, setGroup] = useState<GroupItem[]>([]);
    const [Application, setApplication] = useState<ApplicationItem[]>([]);
    const [Employee, setEmployee] = useState<MemberItem[]>([]);
    const [SelectGroup, setSelectGroup] = useState<{ [key: number]: number }>({});
    const [SelectedStatus, setSelectedStatus] = useState< { [key: number]: string } >({});
    const get_database = async () => {
        const result = await get_application_setting();
        setEmployee(result.result_employee);
        setDepartment(result.result_department);
        setGroup(result.result_group);
        setApplication(result.result_application);
        result.result_application.map((item: ApplicationItem) => {
            setSelectGroup(prev => ({ ...prev, [item.application_id]: item.group_id }));
            setSelectedStatus(prev => ({ ...prev, [item.application_id]: item.application_status }));
        })
    }

    const GroupOptions = Group.map(group => ({
        value: group.group_id,
        label: group.group_name
    }));

    const handleSelectChange = async (id: number, type: string, value: string | number) => {
        const result = await update_application_select(id, type, value);
        if (result === 'success') {
            alertsmall('success', 'Data Updated Successfully.');
            get_database();
        }
    };
    
    const StatusOptions = [
        { value: 'active', label: 'Active', color: '#10b981' },
        { value: 'inactive', label: 'Inactive', color: '#6b7280' },
        { value: 'unavailable', label: 'Unavailable', color: '#ef4444' },
        { value: 'testing', label: 'Testing', color: '#eab308' }
    ];

    // ป๊อปอัพของ Add Group
    const [ShowModalAddGroup, setShowModalAddGroup] = useState(false);
    const OpenModalAddGroup = () => {
        setShowModalAddGroup(true);
    }
    const handleCloseModalAddGroup = () => setShowModalAddGroup(false);

    // ป๊อปอัพของ Add Application
    const [ShowModalAddApplication, setShowModalAddApplication] = useState(false);
    const OpenModalAddApplication = () => {
        setShowModalAddApplication(true);
    }
    const handleCloseModalAddApplication = () => setShowModalAddApplication(false);

    // ป๊อปอัพของ Edit Application
    const [SelectApplication, setSelectApplication] = useState<ApplicationItem | null>(null);

    const [ShowModalEditApplication, setShowModalEditApplication] = useState(false);
    const OpenModalEditApplication = (item: ApplicationItem) => {
        setSelectApplication(item);
        setShowModalEditApplication(true);
    }
    const handleCloseModalEditApplication = () => setShowModalEditApplication(false);

    // ลบแอพพลิเคชั่น
    const remove = async (app_id: number, app_name: string) => {
        const response = await alertquestion(`Do you want to delete ${app_name} ?`);
        if (response.isConfirmed) {
            const result = await delete_application(app_id);
            if (result === 'success') {
                alertsmall('success', 'Delete Application Successfully.');
                get_database();
            }
        }
    }

    return (
        <div className='d-flex'>
            <Sidebar page={2} />
            <div className='content flex-grow-1 mt-4'>
                <Row>
                    <h1 className='midpoint'>Application Setting</h1>
                </Row>
                <Row className='midpoint mt-4'>
                    <Col md={10} className='mt-2'>
                        <Row className='headers mb-3'>
                            <Col md={6}>
                                <p>Application</p>
                            </Col>
                            <Col md={6} className='d-flex justify-content-end mb-2'>
                                <Button variant='warning' style={{ height: 30, width: 130, fontSize: 13 }} className='me-2 w-100' onClick={OpenModalAddGroup}>Add Groups</Button>
                                <Button variant='warning' style={{ height: 30, width: 130, fontSize: 13 }} className='me-2 w-100' onClick={OpenModalAddApplication}>Add Application</Button>
                            </Col>
                        </Row>
                        {Application?.map((item, index) => (
                            <Row key={item.application_id} className='midpoint mb-2'>
                                <div className='h-card p-3 p-sm-3'>
                                    <Row className='align-items-center justify-content-between g-3'>
                                        <Col xs='12' md='auto' className='d-flex align-items-center gap-3'>
                                            <span className='code-pill'>{index + 1}</span>
                                            <div>
                                                <b className='dept-name'>{item.application_name}</b>
                                                <div className='dept-name'>{item.application_description}</div>
                                                <div>{item.application_website}</div>
                                            </div>
                                        </Col>
                                        <Col xs='12' md='auto'>
                                            <Row className='align-items-center justify-content-center g-3'>
                                                <Col xs={12} md='auto'>
                                                    <span className='mb-2 fw-semibold d-block'>Group</span>
                                                    <CustomSelect value={SelectGroup[item.application_id]} onChange={(value) => handleSelectChange(item.application_id, 'group', value)} options={GroupOptions} width='100%' dot={false} error={false} />
                                                </Col>
                                                <Col xs={12} md='auto'>
                                                    <span className='mb-2 fw-semibold d-block'>Status</span>
                                                    <CustomSelect value={SelectedStatus[item.application_id]} onChange={(value) => handleSelectChange(item.application_id, 'status', value)} options={StatusOptions} width='100%' dot={true} error={false} />
                                                </Col>
                                                <Col xs='auto' className='d-flex align-items-center gap-2'>
                                                    <Button variant='primary' style={{ height: 40, width: 44 }} className='d-flex align-items-center justify-content-center' onClick={() => OpenModalEditApplication(item)}>
                                                        <Edit3 size={16} />
                                                    </Button>
                                                    <Button variant='danger' style={{ height: 40, width: 44 }} className='d-flex align-items-center justify-content-center' onClick={() => remove(item.application_id, item.application_name)} disabled={item.application_id === 1} >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Row>
                        ))}
                    </Col>
                </Row>
            </div>
            <ModalAddGroup ShowModal={ShowModalAddGroup} handleCloseModal={handleCloseModalAddGroup} Department={Department} Employee={Employee} get_database={get_database} />
            <ModalAddApplication ShowModal={ShowModalAddApplication} handleCloseModal={handleCloseModalAddApplication} StatusOptions={StatusOptions} GroupOptions={GroupOptions} get_database={get_database} />
            <ModalEditApplication ShowModal={ShowModalEditApplication} handleCloseModal={handleCloseModalEditApplication} get_database={get_database} SelectApplication={SelectApplication} />
        </div>
    )
}

export default Application_Settings;