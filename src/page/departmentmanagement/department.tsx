import { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import type { DepartmentItem, DepartmentNode } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { get_department, update_move_department } from '../component/connectdatabase';
import ModalAddDepartment from '../component/modal/modaladddepartment';
import ModalEditDepartment from '../component/modal/modaleditdepartment';
import { alerterror } from '../component/sweetalerttwo';

import { BsGripVertical, BsFillPencilFill } from 'react-icons/bs';

const Index = () => {
    const [DepartmentGroup, setDepartmentGroup] = useState<DepartmentNode[]>([]);
    useEffect(() => {
        document.title = 'Department';
        get_database();
    }, []);

    const get_database = async () => {
        const result_department = await get_department();
        const departments = buildHierarchy(result_department);
        setDepartmentGroup(departments);
    };

    const buildHierarchy = (data: DepartmentItem[]): DepartmentNode[] => {
        // หาหัวหน้าโดยอัตโนมัติ: คนที่มี supervisor = 10000 ยกเว้น 10000 เอง
        const HEAD_EXCEPT = new Set(data.filter(d => d.department_supervisor === 10000 && d.department_code !== 10000 && d.department_code % 10000 === 0).map(d => d.department_code));
        const nodeMap: Record<number, DepartmentNode> = {};
        for (const d of data) {
            nodeMap[d.department_code] = { ...d, children: [] };
        }
        const roots: DepartmentNode[] = [];
        for (const dept of Object.values(nodeMap)) {
            if (HEAD_EXCEPT.has(dept.department_code)) { // ถ้ารหัสนี้เป็น Head (ยกเว้น)
                roots.push(dept);
                continue;
            }
            const parent = nodeMap[dept.department_supervisor];
            if (parent) parent.children.push(dept);
            else roots.push(dept);
        }
        // sort
        const sortTree = (node: DepartmentNode) => {
            node.children.sort((a, b) => a.department_code - b.department_code);
            for (const c of node.children) sortTree(c);
        };
        roots.sort((a, b) => a.department_code - b.department_code);
        for (const r of roots) sortTree(r);
        return roots;
    };

    const [DraggedItem, setDraggedItem] = useState<DepartmentItem>();
    const [DraggedFrom, setDraggedFrom] = useState<number>(0);
    const handleDragStart = (item: DepartmentItem, department_code: number) => {
        setDraggedItem(item);
        setDraggedFrom(department_code);
    }

    const handleDrop = async (target_departmentcode: number) => {
        if (!DraggedItem || !DraggedFrom) return;
        if (DraggedFrom === target_departmentcode) {
            setDraggedItem(undefined);
            setDraggedFrom(0);
            return;
        }
        const result = await update_move_department(DraggedItem?.department_id, target_departmentcode);
        if (result === 'success') {
            setDepartmentGroup(prev => {
                // แปลง DraggedItem เป็น DepartmentNode
                const draggedNode: DepartmentNode = { ...DraggedItem, children: [] };
                const new_dept = prev.map(dept => {
                    let children = dept.children || [];
                    // 1. ลบ DraggedItem ออกจาก department เดิม
                    if (dept.department_code === DraggedFrom) children = add_department(children);
                    // 2. เพิ่ม DraggedItem เข้าไปใน target department
                    if (dept.department_code === target_departmentcode) children = [...children, draggedNode];
                    return { ...dept, children };
                });
                return new_dept;
            });
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    const add_department = (children: DepartmentNode[]) => {
        return children.filter(child => child.department_code !== DraggedItem?.department_code)
    }

    // ป๊อปอัพของ Add Department
    const [ShowModalAddDepartment, setShowModalAddDepartment] = useState(false);
    const OpenModalAddDdepartment = () => {
        setShowModalAddDepartment(true);
    }
    const handleCloseModalAddDepartment = () => setShowModalAddDepartment(false);

    // ป๊อปอัพของ Edit Department
    const [ShowModalEditDepartment, setShowModalEditDepartment] = useState(false);
    const [DepartmentID, setDepartmentID] = useState(0);
    const [DetailSupervisor, setDetailSupervisor] = useState('');
    const [DepartmentCode, setDepartmentCode] = useState(0);
    const [DepartmentName, setDepartmentName] = useState('');
    // ป๊อปอัพของ Edit Department โดยกำหนดสำหรับ Departmet ย่อย
    const OpenModalEditDepartment = (dept: DepartmentItem, child: DepartmentItem) => {
        setDepartmentID(child.department_id);
        setDetailSupervisor(dept.department_code + ' - ' + dept.department_name);
        setDepartmentCode(child.department_code);
        setDepartmentName(child.department_name);
        setShowModalEditDepartment(true);
    }
    // ป๊อปอัพของ Edit Department โดยกำหนดสำหรับ Departmet หลัก
    const OpenModalEditDepartmentHead = (dept: DepartmentItem) => {
        if (dept.department_supervisor === 0) {
            setDetailSupervisor('-');
        } else {
            const result = DepartmentGroup.find(item => item.department_code === dept.department_supervisor);
            console.log(result);
            setDetailSupervisor(dept.department_supervisor + ' - ' + result?.department_name);
        }
        setDepartmentID(dept.department_id)
        setDepartmentCode(dept.department_code);
        setDepartmentName(dept.department_name);
        setShowModalEditDepartment(true);
    }
    const handleCloseModalEditDepartment = () => setShowModalEditDepartment(false);


    return (
        <div className='d-flex'>
            <Sidebar page={8} />
            <Container fluid className='py-4 margintop'>
                <Row>
                    <Col md={12} className='midpoint'>
                        <h1>Department Management</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className='d-flex justify-content-end'>
                        <Button variant='warning' style={{ width: 200 }} onClick={OpenModalAddDdepartment}>Add Department</Button>
                    </Col>
                </Row>
                <Row className='g-3 mx-0 mt-2'>
                    {DepartmentGroup.map(dept => (
                        <Col xs={4} md={4} lg={4} xxl={3} key={dept.department_id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleDrop(dept.department_code); }}>
                            <div className='border border-dark rounded-3 shadow' style={{ minHeight: 500 }}>
                                <div className='p-3 m-0 bg-dark bg-gradient text-center text-white rounded-1 d-flex justify-content-center align-items-cente position-relative'>
                                    <span>{dept.department_name}</span>
                                    <label htmlFor={'button_pencil' + dept.department_code} style={{ cursor: 'pointer' }} className='position-absolute end-0 me-3'><BsFillPencilFill /></label>
                                    <input type='button' id={'button_pencil' + dept.department_code} style={{ display: 'none', backgroundColor: 'transparent', border: 'none' }} onClick={() => OpenModalEditDepartmentHead(dept)} />
                                </div>
                                <div>
                                    {[...dept.children].sort((a, b) => a.department_code - b.department_code).map(child => (
                                        <div key={child.department_id} className='input-group mb-2 midpoint mt-2'>
                                            <div style={{ width: '95%' }}>
                                                <button className='form-control bg-light d-flex justify-content-between' style={{ cursor: 'all-scroll' }} onDragStart={() => handleDragStart(child, dept.department_code)} draggable>
                                                    <span className='d-flex align-items-center' style={{ flex: 1, marginRight: '0.5rem', overflow: 'hidden' }}>
                                                        <BsGripVertical />
                                                        <span className='text-truncate' style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                            {child.department_code} - {child.department_name}
                                                        </span>
                                                    </span>
                                                    <label htmlFor={'button_pencil' + child.department_code} style={{ cursor: 'pointer' }}><BsFillPencilFill /></label>
                                                    <input type='button' id={'button_pencil' + child.department_code} style={{ display: 'none', backgroundColor: 'transparent', border: 'none' }} onClick={() => OpenModalEditDepartment(dept, child)} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
            <ModalAddDepartment ShowModal={ShowModalAddDepartment} handleCloseModal={handleCloseModalAddDepartment} DepartmentGroup={DepartmentGroup} get_database={get_database} />
            <ModalEditDepartment ShowModal={ShowModalEditDepartment} handleCloseModal={handleCloseModalEditDepartment} DepartmentID={DepartmentID} DetailSupervisor={DetailSupervisor} DepartmentCode={DepartmentCode} DepartmentName={DepartmentName} get_database={get_database} />
        </div>
    )
}

export default Index;