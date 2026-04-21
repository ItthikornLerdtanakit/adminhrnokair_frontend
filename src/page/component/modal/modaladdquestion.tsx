import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import type { ModalItem as BaseModalItem } from '../interfaces';

import { checkvalueinput } from '../functions';
import { alertsmall, alerterror } from '../sweetalerttwo';
import { save_question_evaluation } from '../connectdatabase';

import { ImCross } from 'react-icons/im';
import { FaSave } from 'react-icons/fa';

interface ModalItem extends BaseModalItem {
    ParttypeSelect: string;
    Level: string;
    get_database: () => void;
}

const ModalAddQuestion = (item: ModalItem) => {
    const { ShowModal, handleCloseModal, ParttypeSelect, Level, get_database } = item;

    // บันทึกแอพพลิเคชั่นลงไป
    const Submit = async () => {
        const topic = document.getElementById('topic') as HTMLInputElement;
        const weight = document.getElementById('weight') as HTMLInputElement;
        const description = document.getElementById('description') as HTMLInputElement;
        const weight_value = weight.value === '' ? 0 : weight.value;
        if (!topic.value || (weight.value === '' && ParttypeSelect !== 'part5') || !description.value) {
            checkvalueinput(topic, topic.value);
            checkvalueinput(weight, Number(!(weight.value === '' && ParttypeSelect !== 'part5')));
            checkvalueinput(description, description.value);
            return;
        }
        const result = await save_question_evaluation(topic.value, Number(weight_value), description.value, ParttypeSelect, Level);
        if (result === 'success') {
            get_database();
            handleCloseModal();
            alertsmall('success', 'Update Question Evaluation Successfully.');
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    return (
        <Modal size='xl' show={ShowModal} onHide={handleCloseModal} enforceFocus={false} restoreFocus={false}>
            <Modal.Header closeButton className='bg-warning'>
                <Modal.Title>Add Question Evaluation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='midpoint'>
                    <Col md={12} className='borderbox' style={{ width: '97%', height: 290, borderRadius: 25 }}>
                        <Row className='midpoint' style={{ height: 100 }}>
                            <Col className={`${ParttypeSelect === 'part5' ? 'col-11' : 'col-8'}`}>
                                <Form>
                                    <Form.Group>
                                        <Form.Label><b>Topic</b></Form.Label>
                                        <Form.Control type='text' id='topic' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Topic' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col className={`col-3 ${ParttypeSelect === 'part5' && 'd-none'}`}>
                                <Form>
                                    <Form.Group>
                                        <Form.Label><b>Weight (%)</b></Form.Label>
                                        <Form.Control type='number' id='weight' onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Weight' />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <Row className='midpoint' style={{ height: 100 }}>
                            <Col className='col-11'>
                                <Form>
                                    <Form.Group>
                                        <Form.Label><b>Description</b></Form.Label>
                                        <Form.Control as='textarea' id='description' rows={3} style={{ resize: 'none' }} onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Description' />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={12} className='d-flex justify-content-end' style={{ marginTop: 35 }}>
                                <button style={{ fontSize: 24, marginRight: 15 }} className='buttonnone' onClick={Submit}><FaSave /></button>
                                <button style={{ fontSize: 24, marginLeft: 15, marginRight: 15, color: 'red' }} className='buttonnone' onClick={handleCloseModal}><ImCross /></button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
};

export default ModalAddQuestion;
