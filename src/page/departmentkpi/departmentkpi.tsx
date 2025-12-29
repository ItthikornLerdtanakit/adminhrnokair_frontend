import { useEffect, useState } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { get_employee } from '../component/connectdatabase';
import { SwitchSetting } from '../component/switch';
import Sidebar from '../component/sidebar';

interface DepartmentItem {
    department_id: number;
    department_code: number;
    department_name: string;
}

const SelectEvaluator = () => {
    useEffect(() => {
        document.title = 'Department KPI';
        get_database();
    }, []);

    // ดึงข้อมูลจากฐานข้อมูลออกมา
    const [Department, setDepartment] = useState<DepartmentItem[]>([]);
    const [switchValues, setSwitchValues] = useState<{ [key: string]: boolean }>({});

    const get_database = async () => {
        const result = await get_employee();
        setDepartment(result);
    }

    const switchonchange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = event.target;
        setSwitchValues((prev) => ({
            ...prev,
            [id]: checked,
        }));
    }

    const HeadDept = Department.filter(item => item.department_code % 10000 === 0);
    const SubDept = Department.filter(item => item.department_code % 10000 !== 0);

    return (
        <div className='d-flex'>
            <Sidebar page={13} />
            <div className='content flex-grow-1'>
                <Row>
                    <h1 className='mb-4 midpoint'>Department KPI</h1>
                </Row>
                <Row className='midpoint'>
                    <Col md={8}>
                        {HeadDept?.map(item => (
                            <div key={item.department_code} className="card mb-4">
                                <div className="card-body">
                                    <div className="ds-title d-flex justify-content-between align-items-center">
                                        <span>{item.department_code} - {item.department_name}</span>
                                        <SwitchSetting id={'department_' + item.department_code} switchonchange={switchonchange} values={switchValues['department_' + item.department_id] || false} />
                                    </div>
                                    <div className="ds-tree">
                                        <ul>
                                            {SubDept?.filter(i => Math.floor(i.department_code / 10000) === Math.floor(item.department_code / 10000)).map(data => (
                                                <li key={data.department_code}>
                                                    <div className="ds-sub d-flex justify-content-between align-items-center">
                                                        <span>{data.department_id} - {data.department_name}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default SelectEvaluator;