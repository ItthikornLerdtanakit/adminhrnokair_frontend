import { useState, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import type { ModalItem as BaseModalItem } from '../interfaces';

import { CustomSelect } from '../customselects';
import { checkvalueinput } from '../functions';
import { alertsmall } from '../sweetalerttwo';
import { save_application } from '../connectdatabase';

interface ModalItem extends BaseModalItem {
    StatusOptions: { value: string; label: string; color: string }[];
    GroupOptions: { value: number; label: string; }[];
    get_database: () => void;
}

const ModalAddApplication = (item: ModalItem) => {
    const { ShowModal, handleCloseModal, GroupOptions, StatusOptions, get_database } = item;
    const [SelectedGroup, setSelectedGroup] = useState(0);
    const [SelectGroupCheck, setSelectGroupCheck] = useState(false);
    const [SelectedStatusAdd, setSelectedStatusAdd] = useState('Active');

    useEffect(() => {
        if (SelectedGroup) {
            setSelectGroupCheck(false);
        }
    }, [SelectedGroup])

    // บันทึกแอพพลิเคชั่นลงไป
    const Submit = async () => {
        const app_name = document.getElementById('app_name') as HTMLInputElement;
        const app_description = document.getElementById('app_description') as HTMLInputElement;
        const app_website = document.getElementById('app_website') as HTMLInputElement;
        if (!app_name.value || !app_description.value || !app_website.value || !SelectedGroup) {
            checkvalueinput(app_name, app_name.value);
            checkvalueinput(app_description, app_description.value);
            checkvalueinput(app_website, app_website.value);
            setSelectGroupCheck(true);
            alertsmall('warning', 'Please complete or select all required information.');
            return;
        }
        setSelectGroupCheck(false);
        const result = await save_application(app_name.value, app_description.value, app_website.value, SelectedGroup, SelectedStatusAdd);
        if (result === 'success') {
            handleCloseModal();
            alertsmall('success', 'Save Group Successfully.');
            get_database();
        }
    }
   
    return (
        <Modal size='lg' show={ShowModal} onHide={handleCloseModal} enforceFocus={false} restoreFocus={false}>
            <Modal.Header closeButton className='bg-warning'>
                <Modal.Title>Add Application</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Application Name:</Form.Label>
                        <Form.Control type='text' id='app_name' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control as='textarea' rows={3} id='app_description' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Website:</Form.Label>
                        <Form.Control type='text' id='app_website' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Enter your text here...' />
                    </Form.Group>
                </Form>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Group:</Form.Label>
                        <CustomSelect value={SelectedGroup} onChange={setSelectedGroup} options={GroupOptions} width='100%' dot={true} error={SelectGroupCheck} />
                    </Form.Group>
                </Form>
                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Status:</Form.Label>
                        <CustomSelect value={SelectedStatusAdd} onChange={setSelectedStatusAdd} options={StatusOptions} width='100%' dot={true} error={false} />
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

export default ModalAddApplication;
