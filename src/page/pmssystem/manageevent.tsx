import { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import type { EventItem } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { get_event, manage_event, delete_event } from '../component/connectdatabase';
import { alertquestion, alertsmall, alerterror } from '../component/sweetalerttwo';
import DateRangeCalendar from '../component/calendar';
import { formatdatefull, formatdatefull_savedb, parsethaidate, checkvalueinput } from '../component/functions';
import { CustomSelect } from '../component/customselects';

import { ChevronLeft } from 'lucide-react';

const Manageevent = () => {
    useEffect(() => {
        document.title = 'Manage Event';
        get_database();
    }, []);

    const [Page, setPage] = useState('one');
    const [Event, setEvent] = useState<EventItem[]>([]);
    const [EventSelect, setEventSelect] = useState<EventItem>();
    const get_database = async () => {
        const result = await get_event();
        setEvent(result);
    }

    const deleteevent = async (id: number, topic: string) => {
        const response = await alertquestion(`Do you want to delete event ${topic} ?`);
        if (response.isConfirmed) {
            const result = await delete_event(id);
            if (result === 'success') {
                alertsmall('success', 'Delete Event Successfully.');
                get_database();
            }
        }
    }

    const Options = [{ value: 'Evaluate Self', label: 'Evaluate Self' }, { value: 'Manager Evaluate Staff', label: 'Manager Evaluate Staff' }, { value: 'Head Of Evaluate Manager', label: 'Head Of Evaluate Manager' }];
    const [StartDate, setStartDate] = useState<Date | null>(null);
    const [EndDate, setEndDate] = useState<Date | null>(null);
    const [Evaluate, setEvaluate] = useState('');
    const [EvaluateCheck, setEvaluateCheck] = useState(false);
    useEffect(() => {
        if (EventSelect) {
            setEvaluate(EventSelect.event_evaluate)
            setStartDate(parsethaidate(EventSelect.event_startdate));
            setEndDate(parsethaidate(EventSelect.event_enddate));
        } else {
            setEvaluate('')
            setStartDate(null);
            setEndDate(null);
        }
    }, [EventSelect, Page])

    useEffect(() => {
        Evaluate && setEvaluateCheck(false);
    }, [Evaluate])

    useEffect(() => {
        if (Page === 'two') {
            const startdate_element = document.getElementById('startdate') as HTMLInputElement;
            checkvalueinput(startdate_element, formatdatefull(StartDate!));
        }
    }, [StartDate]);

    useEffect(() => {
        if (Page === 'two') {
            const enddate_element = document.getElementById('enddate') as HTMLInputElement;
            checkvalueinput(enddate_element, formatdatefull(EndDate!));
        }
    }, [EndDate]);

    const save_event = async () => {
        const id = EventSelect ? EventSelect.event_id : 0;
        const statussave = EventSelect ? 'update' : 'insert';
        const topic = document.getElementById('topic') as HTMLInputElement;
        const description = document.getElementById('description') as HTMLInputElement;
        const startdate = document.getElementById('startdate') as HTMLInputElement;
        const enddate = document.getElementById('enddate') as HTMLInputElement;
        if (!topic.value || !description.value || !Evaluate || !startdate.value || !enddate.value) {
            checkvalueinput(topic, topic.value);
            checkvalueinput(description, description.value);
            setEvaluateCheck(!Evaluate)
            checkvalueinput(startdate, startdate.value);
            checkvalueinput(enddate, enddate.value);
            return;
        }
        const result = await manage_event(id!, topic.value, description.value, Evaluate, formatdatefull_savedb(StartDate!), formatdatefull_savedb(EndDate!), statussave);
        if (result === 'success') {
            get_database();
            setPage('one');
            alertsmall('success', 'Save Event Successfully.');
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    return (
        <div className='d-flex'>
            <Sidebar page={11} />
            {Page === 'one' && (
                <Container fluid className='py-4 content flex-grow-1 margintop'>
                    <Row className='midpoint'>
                        <Col md={12} className='titletext'>
                            <p>Manage Event</p>
                        </Col>
                    </Row>
                    <Row>
                        {Event?.map(data => (
                            <Col key={data.event_id} md={6} style={{ marginTop: 25, marginBottom: 20 }}>
                                <div className='boxevent'>
                                    <div><b className='titleevent wordwarp'>{data.event_topic}</b></div>
                                    <div className='wordwarp mt-2'>{data.event_description}</div>
                                    <div className='event-dates'>
                                        <b>Event Dates</b><br />
                                        {data.event_startdate} {data.event_startdate ? '- ' + data.event_enddate : null} (รอบที่ {data.event_statusdate})
                                    </div>
                                </div>
                                <Row style={{ marginTop: 20 }}>
                                    <Col md={12} style={{ textAlign: 'center' }}>
                                        <Button variant='warning' className='btns' style={{ width: 150 }} onClick={() => { setEventSelect(data); setPage('two'); }}><b>Edit</b></Button>
                                        <Button variant='warning' className='btns' style={{ width: 150, color: 'red', backgroundColor: 'white', border: '1px solid red' }} onClick={() => deleteevent(Number(data.event_id), data.event_topic)}><b>Delete</b></Button>
                                    </Col>
                                </Row>
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        <Col md={12} className='midpoint'>
                            <Button variant='warning' className='btns' style={{ width: 150 }} onClick={() => setPage('two')}>Add Event</Button>
                        </Col>
                    </Row>
                </Container>
            )}
            {Page === 'two' && (
                <Container fluid className='py-4 content flex-grow-1 margintop'>
                    <Row>
                        <Col md={12} className='d-flex justify-content-between'>
                            <button className='mb-3 buttonnone' style={{ display: 'inline-flex', alignItems: 'center' }} onClick={() => { setEventSelect(undefined); setPage('one'); }}><ChevronLeft style={{ marginRight: 5 }} />Back To Manage Event</button>
                        </Col>
                    </Row>
                    <Row className='midpoint'>
                        <Col md={12} className='titletext'>
                            {EventSelect ? (
                                <p>Edit Event</p>
                            ) : (
                                <p>Add Event</p>
                            )}
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col md={5}>
                            <DateRangeCalendar StartDate={StartDate} setStartDate={setStartDate} EndDate={EndDate} setEndDate={setEndDate} />
                        </Col>
                        <Col md={7} className='midpoint' style={{ padding: 20 }}>
                            <Row className='midpoint boxevent' style={{ width: '100%' }}>
                                <Col className='col-11 mt-3 midpoint'>
                                    <h4><b>Event Detail</b></h4>
                                </Col>
                                <Col className='col-11'>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Topic</b></Form.Label>
                                            <Form.Control type='text' id='topic' defaultValue={EventSelect?.event_topic} onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Topic' />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col className='col-11 mt-3'>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Description</b></Form.Label>
                                            <Form.Control as='textarea' rows={5} id='description' defaultValue={EventSelect?.event_description} onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Description' />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col className='col-11 mt-3'>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Evaluate</b></Form.Label>
                                               <CustomSelect value={Evaluate} onChange={(value) => setEvaluate(value)} options={Options} width='100%' dot={false} error={EvaluateCheck} />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col className='col-11 mt-3'>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>StartDate</b></Form.Label>
                                            <Form.Control type='text' id='startdate' value={formatdatefull(StartDate!) === '-' ? '' : formatdatefull(StartDate!)} readOnly placeholder='StartDate' />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col className='col-11 mt-3'>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>EndDate</b></Form.Label>
                                            <Form.Control type='text' id='enddate' value={formatdatefull(EndDate!) === '-' ? '' : formatdatefull(EndDate!)} readOnly placeholder='EndDate' />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col className='col-11 mt-5 mb-4 midpoint'>
                                    <Button variant='warning' className='btns' style={{ fontSize: 14 }} onClick={save_event}>Save</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    )
}

export default Manageevent;