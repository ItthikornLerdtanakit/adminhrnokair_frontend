import { useEffect, useState, useRef } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import type { PartItem, PartTypeItem } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { CustomSelect } from '../component/customselects';
import { get_question_evaluation, update_switch_evaluation, managefile_evaluation, update_question_evaluation, delete_question_evaluation } from '../component/connectdatabase';
import { alerterror, alertsmall, alertquestion } from '../component/sweetalerttwo';
import { checkvalueinput } from '../component/functions';
import ModalAddQuestion from '../component/modal/modaladdquestion';

import { ImCross } from 'react-icons/im';
import { FaSave } from 'react-icons/fa';
import { LuUpload } from 'react-icons/lu';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { BsXLg } from 'react-icons/bs';
import { TbSquareRoundedPlusFilled } from 'react-icons/tb';

const Managequestion = () => {
    useEffect(() => {
        document.title = 'Manage Question';
        get_database();
    }, []);

    type LevelItem = 'level_1' | 'level_2' | 'level_3';
    const [Tab, setTab] = useState('one');
    const [Level, setLevel] = useState<LevelItem>('level_1');
    const [Question, setQuestion] = useState<PartItem[]>([]);
    const [Parttype, setParttype] = useState([]);
    const [PartInfo, setPartInfo] = useState<PartTypeItem[]>([])
    const [ParttypeSelect, setParttypeSelect] = useState('part1');
    const get_database = async () => {
        const result = await get_question_evaluation();
        setQuestion(result.result_part);
        setPartInfo(result.result_parttype);
        const select_parttype = result.result_parttype.map((item: PartTypeItem) => ({ value: item.parttype_id, label: item.parttype_name }));
        setParttype(select_parttype);
    }

    useEffect(() => setParttypeSelect('part1'), [Level]);

    const switch_evaluation = (data: PartTypeItem[], partselect: string, level: LevelItem) => {
        const parttype = data.find(item => item.parttype_id === partselect);
        if (!parttype) return 0;
        const level_map: Record<LevelItem, keyof PartTypeItem> = { level_1: 'parttype_statusstaff', level_2: 'parttype_statusmanager', level_3: 'parttype_statusheadof' };
        return parttype[level_map[level]] ?? 0;
    }

    const switch_evaluation_update = async (check: boolean) => {
        const result = await update_switch_evaluation(ParttypeSelect, Level, Number(check));
        if (result === 'success') {
            get_database();
            alertsmall('success', 'Change Switch On-Off Evaluation Successfully.');
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    const ChooseRef = useRef<HTMLInputElement | null>(null);
    const [File, setFile] = useState<File | null>(null);
    const [FileName, setFileName] = useState('No file yet.');
    // ทำการเลือกไฟล์เกณฑ์การประเมินเข้ามา
    const SelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            setFileName(file.name);
        } else {
            clearchoosefile();
        }
    }
    const handleChoose = () => ChooseRef.current?.click();

    const clearchoosefile = () => {
        setFile(null);
        setFileName('No file yet.');
        if (ChooseRef.current) ChooseRef.current.value = '';
    }

    const savefile = async () => {
        if (!File || FileName === 'No filr yet') {
            alerterror('There was a problem with the uploaded file. Please try again.');
            return;
        }
        const formData = new FormData();
        formData.append('file_evaluation', File);
        formData.append('part', ParttypeSelect);
        formData.append('level', Level);
        const result = await managefile_evaluation(formData);
        if (result === 'success') {
            clearchoosefile();
            get_database();
            alertsmall('success', 'Add File Evaluation Successfully.');
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    const get_file_evaluation = (data: PartTypeItem[], partselect: string, level: LevelItem) => {
        const parttype = data.find(item => item.parttype_id === partselect);
        if (!parttype) return null;
        const level_map: Record<LevelItem, keyof PartTypeItem> = { level_1: 'parttype_filestaff', level_2: 'parttype_filemanager', level_3: 'parttype_fileheadof' };
        return parttype[level_map[level]] ?? null;
    }

    const deletefile = async (filename: string) => {
        const response = await alertquestion(`Do you want to delete ${filename} ?`);
        if (response.isConfirmed) {
            const formData = new FormData();
            formData.append('part', ParttypeSelect);
            formData.append('level', Level);
            formData.append('namefile', filename);
            const result = await managefile_evaluation(formData);
            if (result === 'success') {
                clearchoosefile();
                get_database();
                alertsmall('success', 'Delete File Evaluation Successfully.');
            } else {
                alerterror('You cannot log in. Please contact the system administrator for assistance.');
            }
        }
    }

    const update_question = async (partid: number) => {
        const topic = document.getElementById('topic_' + partid) as HTMLInputElement;
        const weight = document.getElementById('weight_' + partid) as HTMLInputElement;
        const description = document.getElementById('description_' + partid) as HTMLInputElement;
        const weight_value = weight.value === '' ? 0 : weight.value;
        if (!topic.value || (weight.value === '' && ParttypeSelect !== 'part5') || !description.value) {
            checkvalueinput(topic, topic.value);
            checkvalueinput(weight, Number(!(weight.value === '' && ParttypeSelect !== 'part5')));
            checkvalueinput(description, description.value);
            return;
        }
        const result = await update_question_evaluation(partid, topic.value, Number(weight_value), description.value);
        if (result === 'success') {
            get_database();
            alertsmall('success', 'Update Question Evaluation Successfully.');
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    const delete_question = async (partid: number, topic: string) => {
        const response = await alertquestion(`Do you want to delete ${topic} ?`);
        if (response.isConfirmed) {
            const result = await delete_question_evaluation(Number(partid));
            if (result === 'success') {
                clearchoosefile();
                get_database();
                alertsmall('success', 'Delete Question Evaluation Successfully.');
            } else {
                alerterror('You cannot log in. Please contact the system administrator for assistance.');
            }
        }
    }

    // ป๊อปอัพของ Add Group
    const [ShowModal, setShowModal] = useState(false);
    const OpenModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => setShowModal(false);

    return (
        <div className='d-flex'>
            <Sidebar page={14} />
            <Container fluid className='py-4 content flex-grow-1 margintop'>
                <Row className='midpoint'>
                    <Col md={12} className='titletext'>
                        <p>Manage Question</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className='mt-5'>
                        <Container>
                            <div className='d-flex flex-column'>
                                <input className='d-none' id='one' name='tabs' type='radio' checked={Tab === 'one'} onChange={() => { setTab('one'); setLevel('level_1'); }} />
                                <input className='d-none' id='two' name='tabs' type='radio' checked={Tab === 'two'} onChange={() => { setTab('two'); setLevel('level_2'); }} />
                                <input className='d-none' id='three' name='tabs' type='radio' checked={Tab === 'three'} onChange={() => { setTab('three'); setLevel('level_3'); }} />
                                <div className='tabs'>
                                    <label className='tab' id='one-tab' htmlFor='one'><b>STAFF</b></label>
                                    <label className='tab ms-1' id='two-tab' htmlFor='two'><b>MANAGER</b></label>
                                    <label className='tab ms-1' id='three-tab' htmlFor='three'><b>HEAD OF</b></label>
                                </div>
                                <div className='panels' style={{ marginBottom: 30, padding: 20, minHeight: 300 }}>
                                    <div className='panel' id={Level}>
                                        <div className='d-flex align-items-center gap-2 w-100'>
                                            <div style={{ flex: 1 }}>
                                                <CustomSelect value={ParttypeSelect} onChange={(value) => setParttypeSelect(value)} options={Parttype} width='100%' dot={false} error={false} />
                                            </div>
                                            <Form.Check className='form-switch'>
                                                <Form.Check.Input type='checkbox' role='switch' style={{ width: '3.5rem', height: '1.75rem', cursor: 'pointer', backgroundColor: switch_evaluation(PartInfo, ParttypeSelect, Level) ? '#ffc107' : '#e9ecef', borderColor: switch_evaluation(PartInfo, ParttypeSelect, Level) ? '#ffc107' : '#e9ecef' }} className='custom-switch' checked={Boolean(switch_evaluation(PartInfo, ParttypeSelect, Level))} onChange={(e) => switch_evaluation_update(e.target.checked)} />
                                            </Form.Check>
                                        </div>
                                        <Col className='col-12 mb-3 d-flex justify-content-end mt-3'>
                                            <div className='d-flex justify-content-end align-items-center'>
                                                <label className='me-2' style={{ textAlign: 'right' }}>{get_file_evaluation(PartInfo, ParttypeSelect, Level) ?? FileName}</label>
                                                <Form>
                                                    <Form.Group className='pb-2'>
                                                        <Form.Control type='file' ref={ChooseRef} className='d-none' onChange={SelectFile} accept='.pdf, .jpg, .jpeg, .png' />
                                                    </Form.Group>
                                                </Form>
                                                {get_file_evaluation(PartInfo, ParttypeSelect, Level) ? (
                                                    <Button variant='danger' style={{ borderRadius: 20 }} onClick={() => deletefile(get_file_evaluation(PartInfo, ParttypeSelect, Level) as string)}><span><MdOutlineDeleteForever size={18} /></span></Button>
                                                ) : (
                                                    <>
                                                        <Button variant='warning' className='me-1' style={{ borderRadius: 20 }} onClick={handleChoose}><span style={{ fontSize: 18 }}><LuUpload /></span></Button>
                                                        {FileName !== 'No file yet.' && (
                                                            <>
                                                                <Button variant='success' className='me-1' style={{ borderRadius: 20 }} onClick={savefile}><span><FaSave size={18} /></span></Button>
                                                                <Button variant='danger' style={{ borderRadius: 20 }} onClick={clearchoosefile}><span><BsXLg size={18} /></span></Button>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </Col>
                                        {Question.filter(item => item.part_level === Level && item.parttype_id === ParttypeSelect)?.map((data, index) => (
                                            <Row key={data.part_id} className='midpoint'>
                                                <Col md={12} className='borderbox' style={{ width: '97%', height: 290, borderRadius: 25, marginBottom: (index + 1) === Question.length ? '' : 50 }}>
                                                    <Row className='midpoint' style={{ height: 100 }}>
                                                        <Col className={`${ParttypeSelect === 'part5' ? 'col-11' : 'col-8'}`}>
                                                            <Form>
                                                                <Form.Group>
                                                                    <Form.Label><b>Topic</b></Form.Label>
                                                                    <Form.Control type='text' id={'topic_' + data.part_id} defaultValue={data.part_topic} onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Topic' />
                                                                </Form.Group>
                                                            </Form>
                                                        </Col>
                                                        <Col className={`col-3 ${ParttypeSelect === 'part5' && 'd-none'}`}>
                                                            <Form>
                                                                <Form.Group>
                                                                    <Form.Label><b>Weight (%)</b></Form.Label>
                                                                    <Form.Control type='number' id={'weight_' + data.part_id} defaultValue={data.part_weight} onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Weight' />
                                                                </Form.Group>
                                                            </Form>
                                                        </Col>
                                                    </Row>
                                                    <Row className='midpoint' style={{ height: 100 }}>
                                                        <Col className='col-11'>
                                                            <Form>
                                                                <Form.Group>
                                                                    <Form.Label><b>Description</b></Form.Label>
                                                                    <Form.Control as='textarea' id={'description_' + data.part_id} rows={3} style={{ resize: 'none' }} defaultValue={data.part_description} onChange={(e) => checkvalueinput(e.target, e.target.value)} placeholder='Description' />
                                                                </Form.Group>
                                                            </Form>
                                                        </Col>
                                                    </Row>
                                                    <Row >
                                                        <Col md={12} className='d-flex justify-content-end' style={{ marginTop: 35 }}>
                                                            <button style={{ fontSize: 24, marginRight: 15 }} className='buttonnone' onClick={() => update_question(Number(data.part_id))}><FaSave /></button>
                                                            <button style={{ fontSize: 24, marginLeft: 15, marginRight: 15, color: 'red' }} className='buttonnone' onClick={() => delete_question(Number(data.part_id), data.part_topic)}><ImCross /></button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        ))}
                                        {Question.filter(item => item.part_level === Level && item.parttype_id === ParttypeSelect).length === 0 && (
                                            <Row style={{ height: 130, textAlign: 'center', verticalAlign: 'middle', fontSize: 30 }}>
                                                <Col md={12} className='midpoint' style={{ marginTop: 80 }}>
                                                    <p>There are currently no assessment questions.</p>
                                                </Col>
                                            </Row>
                                        )}
                                        <Row className='mb-4'>
                                            <Col md={12} style={{ display: ParttypeSelect === 'part3' || ParttypeSelect === 'part4' ? 'none' : 'block', textAlign: 'center' }}>
                                                <button className='buttonnone' style={{ fontSize: 50 }} onClick={OpenModal}><TbSquareRoundedPlusFilled /></button>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <ModalAddQuestion ShowModal={ShowModal} handleCloseModal={handleCloseModal} ParttypeSelect={ParttypeSelect} Level={Level} get_database={get_database} />
        </div>
    )

}

export default Managequestion;