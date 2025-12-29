import { useEffect, useState, useRef } from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import type { EmailTemplateItem } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { checkvalueinput } from '../component/functions';
import { get_emailtemplate, save_emailtemplate, update_emailtemplate } from '../component/connectdatabase';
import { alertsmall, alerterror } from '../component/sweetalerttwo';

import { Mail, ChevronLeft, ChevronRight, Edit2, Trash2, Bold, Italic, Highlighter, Type } from 'lucide-react';
import { BsArrowClockwise } from 'react-icons/bs';

import Logofull from '../../assets/image/logofull.png'

const Emailtemplate = () => {
    useEffect(() => {
        document.title = 'Email Template';
        get_database();
    }, []);

    const [Page, setPage] = useState(1);
    const [EmailTemplate, setEmailTemplate] = useState<EmailTemplateItem[]>([]);
    const [EmailTemplateSelect, setEmailTemplateSelect] = useState<EmailTemplateItem>();
    const get_database = async () => {
        const result = await get_emailtemplate();
        setEmailTemplate(result);
    }

    const colors = [
        { name: 'black', value: '#000000' },
        { name: 'red', value: '#ef4444' },
        { name: 'blue', value: '#3b82f6' },
        { name: 'green', value: '#22c55e' },
        { name: 'purple', value: '#a855f7' },
        { name: 'orange', value: '#f97316' },
    ];

    const highlights = [
        { name: 'yellow', value: '#fef08a' },
        { name: 'green', value: '#bbf7d0' },
        { name: 'lightblue', value: '#bfdbfe' },
        { name: 'pink', value: '#fbcfe8' },
        { name: 'transparent', value: 'transparent' },
    ];

    const [Description, setDescription] = useState('');
    const editorRef = useRef<HTMLDivElement>(null);
    const applyformat = (command: string, value: string) => {
        (document as any).execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const btn_reset = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
        }
        setDescription('');
    }


    const editemailtemplate = (item: EmailTemplateItem) => {
        setPage(2);
        setEmailTemplateSelect(item);
    }

    const getPlaceholders = (str: string): string[] => [...str.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);
    const getMissing = (str: string, values: Record<string, string>): string[] => getPlaceholders(str).filter(p => !values[p]);
    const fillTemplate = (str: string, values: Record<string, string>): string =>str.replaceAll(/\[([^\]]+)\]/g, (_, p) => values[p] ?? `[${p}]`);

    const [Placeholders, setPlaceholders] = useState<string[]>([]);
    const [PreviewValue, setPreviewValue] = useState<any>({});
    const [Preview, setPreview] = useState('');
    useEffect(() => {
        if (editorRef.current) {
            const template = EmailTemplateSelect!.emailtemplate_description;
            setDescription(template || '');
            setPreview(fillTemplate(template, PreviewValue));
            editorRef.current.innerHTML = EmailTemplateSelect?.emailtemplate_description || '';
        }
    }, [EmailTemplateSelect]);

    useEffect(() => {
        if (Description) {
            const plac = getPlaceholders(Description)
            setPlaceholders(plac);
            const initValue = Object.fromEntries(plac.map(key => [key, '']));
            setPreviewValue(initValue);
        }
    }, [Description]);

    const preview_onchange = (key: string, text: string) => {
        const newData = {
            ...PreviewValue,
            [key]: (PreviewValue[key] || '') + text
        }
        setPreview(fillTemplate(Description, newData));
    }


    const submit_template = async () => {
        const email_template = document.getElementById('email_template') as HTMLInputElement;
        const email_subject = document.getElementById('email_subject') as HTMLInputElement;
        const email_description = document.getElementById('email_description') as HTMLDivElement;
        if (!email_template.value || !email_subject.value || !Description) {
            checkvalueinput(email_template, email_template.value);
            checkvalueinput(email_subject, email_subject.value);
            checkvalueinput(email_description, Description);
            alertsmall('warning', 'Please complete or select all required information.');
            return;
        }
        let result = '';
        // ส่งข้อมูลไป
        if (EmailTemplateSelect) {
            const data = [{
                emailtemplate_id: EmailTemplateSelect.emailtemplate_id,
                emailtemplate_name: email_template.value,
                emailtemplate_subject: email_subject.value,
                emailtemplate_description: Description,
            }];
            result = await update_emailtemplate(data);
        } else {
            const data = [{
                emailtemplate_name: email_template.value,
                emailtemplate_subject: email_subject.value,
                emailtemplate_description: Description,
            }];
            result = await save_emailtemplate(data);
        }
        if (result === 'success') {
            setPage(1);
            get_database();
            alertsmall('success', 'Save Email Template Successfully.');
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    const description_onchange = (event: HTMLDivElement, value: string) => {
        if (value === '<br>') {
            value = '';
        }
        setDescription(value); 
        checkvalueinput(event, value);
    }

    return (
        <div className='d-flex'>
            <Sidebar page={10} />
            <Container fluid className='py-4 content flex-grow-1 margintop'>
                <Card className='shadow-sm' style={{ border: 'none', width: '100%' }}>
                    <Card.Header className='bg-warning form-header pt-4'>
                        <h2>Email Template Builder</h2>
                        <p>Create and manage email templates.</p>
                    </Card.Header>
                    {Page === 1 && (
                        <Card.Body>
                            <Row>
                                <Col md={12} className='d-flex justify-content-end'>
                                    <Button variant='warning' onClick={() => setPage(2)}>Add Template Email</Button>
                                </Col>
                            </Row>
                            <div className='title-section mb-4'>
                                <Mail /> - Email template
                            </div>
                            <Row className='midpoint'>
                                {EmailTemplate?.map(item => (
                                    <Row key={item.emailtemplate_id} className='mb-2' style={{ width: '98%', border: '2px solid #ffcb0b', borderRadius: 10, backgroundColor: '#fffae9ff' }}>
                                        <Col md={12} className='ms-3 mt-2'>
                                            <span style={{ fontSize: 18, fontWeight: 600 }}>{item.emailtemplate_name}</span><br />
                                            <span style={{ color: '#4b5563', fontSize: 16 }}>{item.emailtemplate_subject}</span>
                                        </Col>
                                        <Col md={12} className='mt-2 mb-2 d-flex'>
                                            <Button variant='warning' size='sm' className='flex-grow-1' onClick={() => editemailtemplate(item)}>
                                                <Edit2 /> Edit
                                            </Button>
                                            <Button variant='dark' size='sm' className='ms-2'>
                                                <Trash2 />
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </Row>
                        </Card.Body>
                    )}
                    {Page === 2 && (
                        <>
                            <Card.Body>
                                <Row>
                                    <Col md={12} className='d-flex justify-content-between'>
                                        <button className='mb-3 buttonnone' style={{ display: 'inline-flex', alignItems: 'center' }} onClick={() => { setEmailTemplateSelect(undefined); setPage(1); }}><ChevronLeft style={{ marginRight: 5 }} />Back To Email Template</button>
                                        <button className='mb-3 buttonnone' style={{ display: 'inline-flex', alignItems: 'center' }} onClick={() => setPage(3)}>Preview To Email Template <ChevronRight style={{ marginLeft: 5 }} /></button>
                                    </Col>
                                </Row>
                                <div className='title-section mb-4'>
                                    <Mail /> - Email template Detail
                                </div>
                                <Row className='mt-4'>
                                    <Col md={6}>
                                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                            <Form.Group>
                                                <Form.Label>Template Name:</Form.Label>
                                                <Form.Control type='text' id='email_template' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={EmailTemplateSelect?.emailtemplate_name || ''} placeholder='Enter your text here...' />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col md={6}>
                                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                            <Form.Group>
                                                <Form.Label>Subject:</Form.Label>
                                                <Form.Control type='text' id='email_subject' onChange={(e) => checkvalueinput(e.target, e.target.value)} defaultValue={EmailTemplateSelect?.emailtemplate_subject || ''}  placeholder='Enter your text here...' />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col md={12}>
                                        <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                            <Form.Group>
                                                <Form.Label>Description:</Form.Label>
                                                <div className='border-bottom bg-light p-1'>
                                                    <Row className='align-items-center g-3'>
                                                        <Col xs='auto'>
                                                            <ButtonGroup>
                                                                <Button variant='light' className='border' onClick={() => applyformat('bold', '')}>
                                                                    <Bold size={18} className='text-secondary' />
                                                                </Button>
                                                                <Button variant='light' className='border' onClick={() => applyformat('italic', '')}>
                                                                    <Italic size={18} className='text-secondary' />
                                                                </Button>
                                                                <Button variant='light' className='border' onClick={() => applyformat('underline', '')}>
                                                                    <span className='fw-bold text-decoration-underline text-secondary'>U</span>
                                                                </Button>
                                                            </ButtonGroup>
                                                        </Col>
                                                        <Col xs='auto' className='d-flex align-items-center'>
                                                            <div className='border-start ps-3 d-flex align-items-center gap-2'>
                                                                <Type size={16} className='text-secondary' />
                                                                <span className='text-muted'>Color:</span>
                                                                <div className='d-flex gap-2'>
                                                                    {colors.map((color) => (
                                                                        <Button key={color.value} onClick={() => applyformat('foreColor', color.value)} title={color.name} className='p-0' style={{ backgroundColor: color.value, width: 28, height: 28, border: '2px solid #ccc' }} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs='auto' className='d-flex align-items-center'>
                                                            <div className='border-start ps-3 d-flex align-items-center gap-2'>
                                                                <Highlighter size={16} className='text-secondary' />
                                                                <span className='text-muted'>Highlight:</span>
                                                                <div className='d-flex gap-2'>
                                                                    {highlights.map((color) => (
                                                                        <Button key={color.value} onClick={() => applyformat('backColor', color.value)} title={color.name} className='p-0' style={{ backgroundColor: color.value, width: 28, height: 28, border: '2px solid #ccc' }} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs='auto' className='d-flex align-items-center'>
                                                            <Button variant='light' className='border' onClick={btn_reset}>
                                                                <BsArrowClockwise size={18} className='text-secondary' />
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div id='email_description' ref={editorRef} contentEditable className='form-control' style={{ minHeight: '250px', backgroundColor: '#fff' }} onInput={(e) => description_onchange(e.currentTarget, e.currentTarget.innerHTML)} />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                                <div className='title-section mb-4'>
                                <Mail /> - Preview To Email template
                            </div>
                            <Row>
                                <Col md={4}>
                                    <Row>
                                        {Placeholders.map((item, index) => (
                                            <Col key={index + 1} md={12}>
                                                <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                                    <Form.Group>
                                                        <Form.Label>{item}:</Form.Label>
                                                        <Form.Control type='text' id={item + '_preview'} onChange={(e) => preview_onchange(item, e.target.value)} placeholder='Enter your text here...' />
                                                    </Form.Group>
                                                </Form>
                                            </Col>
                                        ))}

                                    </Row>
                                </Col>
                                <Col md={8}>
                                    <Row>
                                        <Col md={12} style={{ height: '70px', backgroundColor: '#ffcb0b'}}>
                                            <img src={Logofull} alt='logofull' height='50' className='mt-2' />
                                        </Col>
                                        <Col md={12} style={{ height: '500px'}}>
                                            <div className='mt-3' dangerouslySetInnerHTML={{ __html: Preview }} />
                                        </Col>
                                        <Col md={12} className='midpoint' style={{ height: '70px', backgroundColor: '#2e2e2e', color: 'white'}}>
                                            <b><h6>©2024 Nok Airlines Public Company Limited. All Right Reserved.</h6></b>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            </Card.Body>
                            <Card.Footer className='midpoint'>
                                <Button variant='warning' style={{ width: 200 }} onClick={submit_template}>Submit</Button>
                            </Card.Footer>
                        </>
                    )}
                </Card>
            </Container>
        </div>
    )
}

export default Emailtemplate;