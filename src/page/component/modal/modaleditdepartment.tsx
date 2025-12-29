import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import type { ModalItem as BaseModalItem } from '../interfaces';

import { checkvalueinput } from '../functions';
import { alertsmall } from '../sweetalerttwo';
import { update_department } from '../connectdatabase';

interface ModalItem extends BaseModalItem {
    DepartmentID: number;
    DetailSupervisor: string;
    DepartmentCode: number;
    DepartmentName: string
    get_database: () => void;
}

const Modaleditdepartment = (item: ModalItem) => {
    const { ShowModal, handleCloseModal, DepartmentID, DetailSupervisor, DepartmentCode, DepartmentName, get_database } = item;

    // บันทึกแอพพลิเคชั่นลงไป
    const Submit = async () => {
        const dept_code = document.getElementById('dept_code') as HTMLInputElement;
        const dept_name = document.getElementById('dept_name') as HTMLInputElement;
        if (!dept_code.value || !dept_name.value) {
            checkvalueinput(dept_code, dept_code.value);
            checkvalueinput(dept_name, dept_name.value);
            return;
        }
        const result = await update_department(DepartmentID, Number(dept_code.value), dept_name.value);
        if (result === 'success') {
            handleCloseModal();
            alertsmall('success', 'Update Employee Successfully.');
            get_database();
        }
    }
   
    return (
        <Modal size='lg' show={ShowModal} onHide={handleCloseModal} enforceFocus={false} restoreFocus={false}>
            <Modal.Header closeButton className='bg-warning'>
                <Modal.Title>Edit Department</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Department Supervisor:</Form.Label>
                        <Form.Control type='text' id='dept_supervisor' readOnly={true} defaultValue={DetailSupervisor} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Department Code:</Form.Label>
                        <Form.Control type='number' id='dept_code' defaultValue={DepartmentCode} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Department Name:</Form.Label>
                        <Form.Control type='text' id='dept_name' defaultValue={DepartmentName} placeholder='Enter your text here...' />
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
