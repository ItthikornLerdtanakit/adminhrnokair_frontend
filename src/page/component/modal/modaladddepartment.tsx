import { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import type { ModalItem as BaseModalItem, DepartmentNode } from '../interfaces';

import { CustomSelect } from '../customselects';
import { checkvalueinput } from '../functions';
import { alertsmall } from '../sweetalerttwo';
import { save_department } from '../connectdatabase';

interface ModalItem extends BaseModalItem {
    DepartmentGroup: DepartmentNode[];
    get_database: () => void;
}

const Modaleditdepartment = (item: ModalItem) => {
    const { ShowModal, handleCloseModal, DepartmentGroup, get_database } = item;

    const [DepartmentType, setDepartmentType] = useState('newdepartment');
    const [Supervisor, setSupervisor] = useState(0);

    const DepartmentOptions = DepartmentGroup.map(item => ({
        value: item.department_id,
        label: item.department_code + ' - ' + item.department_name
    }));

    // บันทึกแผนก
    const Submit = async () => {
        const dept_code = document.getElementById('dept_code') as HTMLInputElement;
        const dept_name = document.getElementById('dept_name') as HTMLInputElement;
        const dept_supervisor = DepartmentType === 'newdepartment' ? DepartmentOptions[0].value : Supervisor;
        if (!dept_code.value || !dept_name.value) {
            checkvalueinput(dept_code, dept_code.value);
            checkvalueinput(dept_name, dept_name.value);
            return;
        }
        const result = await save_department(Number(dept_code.value), dept_name.value, dept_supervisor);
        if (result === 'success') {
            handleCloseModal();
            alertsmall('success', 'Save Group Successfully.');
            get_database();
        }
    }
   
    return (
        <Modal size='lg' show={ShowModal} onHide={handleCloseModal} enforceFocus={false} restoreFocus={false}>
            <Modal.Header closeButton className='bg-warning'>
                <Modal.Title>Add Department</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Department Supervisor Type:</Form.Label>
                        <Form.Check inline type='radio' className='ms-3' label='New Department' name='dept_type' value='newdepartment' checked={DepartmentType === 'newdepartment'} onChange={(e) => setDepartmentType(e.target.value)} />
                        <Form.Check inline type='radio' label='New Sub-Department' name='dept_type' value='newsubdepartment' checked={DepartmentType === 'newsubdepartment'} onChange={(e) => setDepartmentType(e.target.value)} />
                    </Form.Group>
                </Form>
                {DepartmentType === 'newdepartment' ? (
                    <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                        <Form.Group>
                            <Form.Label>Department Supervisor:</Form.Label>
                            <Form.Control type='text' id='dept_supervisor' defaultValue={DepartmentOptions[0]?.label} readOnly={true} placeholder='Enter your text here...' />
                        </Form.Group>
                    </Form>
                ) : (
                    <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                        <Form.Group>
                            <Form.Label>Department Supervisor:</Form.Label>
                            <CustomSelect value={Supervisor} onChange={(value) => setSupervisor(value)} options={DepartmentOptions} width='100%' dot={false} error={false} />
                        </Form.Group>
                    </Form>
                )}
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Department Code:</Form.Label>
                        <Form.Control type='number' id='dept_code' placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Department Name:</Form.Label>
                        <Form.Control type='text' id='dept_name' placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className='midpoint'>
                <Button variant='dark' onClick={handleCloseModal}>Cancel</Button>
                <Button variant='warning' onClick={Submit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default Modaleditdepartment;
