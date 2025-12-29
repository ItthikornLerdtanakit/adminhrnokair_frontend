import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import type { ModalItem as BaseModalItem, ApplicationItem } from '../interfaces';

import { checkvalueinput } from '../functions';
import { alertsmall } from '../sweetalerttwo';
import { update_application } from '../connectdatabase';

interface ModalItem extends BaseModalItem {
    get_database: () => void;
    SelectApplication: ApplicationItem | null;
}

const ModalEditApplication = (item: ModalItem) => {
    const { ShowModal, handleCloseModal, get_database, SelectApplication } = item;

    // บันทึกแอพพลิเคชั่นลงไป
    const Update = async () => {
        const app_id = document.getElementById('app_id') as HTMLInputElement;
        const app_name = document.getElementById('app_name') as HTMLInputElement;
        const app_description = document.getElementById('app_description') as HTMLInputElement;
        const app_website = document.getElementById('app_website') as HTMLInputElement;
        if (!app_name.value || !app_description.value) {
            checkvalueinput(app_name, app_name.value);
            checkvalueinput(app_description, app_description.value);
            checkvalueinput(app_website, app_website.value);
            alertsmall('warning', 'Please complete or select all required information.');
            return;
        }
        const result = await update_application(Number(app_id.value), app_name.value, app_description.value, app_website.value);
        if (result === 'success') {
            handleCloseModal();
            alertsmall('success', 'Save Application Successfully.');
            get_database();
        }
    }
   
    return (
        <Modal size='lg' show={ShowModal} onHide={handleCloseModal} enforceFocus={false} restoreFocus={false}>
            <Modal.Header closeButton className='bg-warning'>
                <Modal.Title>Edit Application</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='mb-4'>
                    <Form.Group>
                        <Form.Label>Application ID:</Form.Label>
                        <Form.Control type='number' id='app_id' readOnly={true} onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectApplication?.application_id} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4'>
                    <Form.Group>
                        <Form.Label>Application Name:</Form.Label>
                        <Form.Control type='text' id='app_name' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectApplication?.application_name} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4'>
                    <Form.Group>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control as='textarea' rows={3} id='app_description' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectApplication?.application_description} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4'>
                    <Form.Group>
                        <Form.Label>Website:</Form.Label>
                        <Form.Control type='text' id='app_website' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={SelectApplication?.application_website} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className='midpoint'>
                <Button variant='dark' onClick={handleCloseModal}>Cancel</Button>
                <Button variant='warning' onClick={Update}>Update</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default ModalEditApplication;
