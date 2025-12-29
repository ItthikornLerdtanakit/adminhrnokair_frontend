import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import type { EmployeeWithDepartment } from '../component/interfaces';

import Sidebar from '../component/sidebar';
import { alertwarning, alertsmall, alerterror } from '../component/sweetalerttwo';
import { CustomSelect } from '../component/customselects';
import Pagination from '../component/pagination';
import { add_employee_import } from '../component/connectdatabase';

const Importemployee = () => {
    useEffect(() => {
        document.title = 'Import Employee';
        get_database();
    }, []);

    const get_database = async () => {

    }

    const EntriesOptions = [
        { value: 10, label: 'Show 10 entries' },
        { value: 20, label: 'Show 20 entries' },
        { value: 50, label: 'Show 50 entries' },
        { value: 100, label: 'Show 100 entries' }
    ];

    const HeaderEmployee = ['NOKID', 'NameEnglish', 'NameThai', 'Position', 'Supervisor', 'DepartmentID', 'UserType', 'Email', 'Level', 'Status', 'StartDate'];

    const [Employee, setEmployee] = useState<EmployeeWithDepartment[]>([]);
    const [FileName, setFileName] = useState<string>('No Choose File CSV');
    const [CurrentPage, setCurrentPage] = useState(1);
    const [RowsPerPage, setRowsPerPage] = useState(10);

    // แปลงข้อมูล CSV → Object array ตาม headers
    const ParseCSVToEmployee = (data: string[][], headers: string[]) => {
        return data.slice(1).filter(row => row.some(cell => cell?.trim())).map((row) => {
            const obj: Record<string, string> = {};
            for (const [index, header] of headers.entries()) {
                obj[header] = row[index] ?? '';
            }
            return obj;
        });
    };

    // ตรวจสอบ header ที่จำเป็นว่ามีครบไหม
    const ValidateHeaders = (headers: string[], required: string[]) => {
        return required.filter(r => !headers.includes(r));
    };

    // callback เมื่อ Papa.parse อ่าน CSV เสร็จ
    const CompleteParse = (result: Papa.ParseResult<string[]>) => {
        const uploadfilecsv = document.getElementById('uploadfilecsv') as HTMLInputElement;
        const headers = (result.data[0])?.map(h => h.trim());
        const MissingHeaders = ValidateHeaders(headers, HeaderEmployee);
        if (MissingHeaders.length > 0) {
            setFileName('No Choose File CSV');
            uploadfilecsv.value = '';
            setEmployee([]);
            alertwarning(`Required columns not found: <b>${MissingHeaders.join(', ')}</b> Please verify the column names and upload the file again.`);
            return;
        }
        const employees = ParseCSVToEmployee(result.data, headers).map((item) => ({
            employee_code: item['NOKID'] ?? '',
            employee_nameen: item['NameEnglish'] ?? '',
            employee_nameth: item['NameThai'] ?? '',
            employee_position: item['Position'] ?? '',
            employee_supervisor: item['Supervisor'] ?? '',
            department_id: Number(item['DepartmentID']),
            employee_usertype: item['UserType'] ?? '',
            employee_email: item['Email'] ?? '',
            employee_level: item['Level'] ?? '',
            employee_status: item['Status'] ?? '',
            employee_image: 'https://placehold.co/160x200?text=2inch',
            employee_startdate: item['StartDate'] ?? '',
            employee_enddate: '0000-00-00'
        })) as Partial<EmployeeWithDepartment>[];
        setEmployee(employees as EmployeeWithDepartment[]);
        setCurrentPage(1);
    };

    // เมื่อผู้ใช้เลือกไฟล์ CSV
    const UploadFileCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        Papa.parse(file, {
            complete: (result: Papa.ParseResult<string[]>) => CompleteParse(result),
            error: (error) => alertwarning('An error occurred while reading the file. Please check the file format and try again. Error: ' + error.message),
        });
    };

    const IndexOfLastRow = CurrentPage * RowsPerPage;
    const IndexOfFirstRow = IndexOfLastRow - RowsPerPage;
    const CurrentRows = Employee.slice(IndexOfFirstRow, IndexOfLastRow);
    const TotalPages = Math.ceil(Employee.length / RowsPerPage);

    const RowsPerPageChange = (value: number) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };


    const SaveImportEmployee = async () => {
        const result = await add_employee_import(Employee);
        if (result === 'success') {
            alertsmall('success', 'Add Employee Successfully.');
            const uploadfilecsv = document.getElementById('uploadfilecsv') as HTMLInputElement;
            setEmployee([]);
            setFileName('No Choose File CSV');
            uploadfilecsv.value = '';
        } else {
            alerterror('You cannot log in. Please contact the system administrator for assistance.');
        }
    }

    return (
        <div className='d-flex'>
            <Sidebar page={5} />
            <Container fluid className='py-4 content flex-grow-1 margintop'>
                <Card className='shadow-sm' style={{ border: 'none', width: '100%' }}>
                    <Card.Header className='bg-warning form-header pt-4'>
                        <h2>Import Multiple Employees from CSV</h2>
                        <p>Please select a CSV file that includes the employee records you would like to import.</p>
                    </Card.Header>
                    <Card.Body>
                        <div className='alert alert-warning mb-4'>
                            <h6 className='alert-heading'>Required Columns in the CSV File: <span style={{ color: 'red' }}>(*The displayed column names must match the header names in the CSV file exactly.)</span></h6>
                            <Row className='row g-2 mt-2'>
                                {HeaderEmployee.map((header, index) => (
                                    <Col xs={6} md={4} lg={3} key={index + 1}>
                                        <small className='badge bg-warning w-100 text-wrap' style={{ fontSize: 14, color: 'black' }}>{header}</small>
                                    </Col>
                                ))}
                                <Col md={12} className='mt-4'>
                                    <Form className='mb-4' onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label>Choose File CSV:</Form.Label>
                                            <Form.Control type='file' id='uploadfilecsv' onChange={UploadFileCSV} placeholder='Enter your text here...' />
                                            <Form.Label className='mt-2'>Selected File: {FileName}</Form.Label>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                            <Row>
                                {Employee.length > 0 && (
                                    <div className='mb-4'>
                                        <div className='d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2'>
                                            <h5 className='mb-0'>
                                                Employee Data ({Employee.length} items)
                                            </h5>
                                            <div className='d-flex align-items-center gap-2'>
                                                <CustomSelect value={RowsPerPage} onChange={(value) => { RowsPerPageChange(value); }} options={EntriesOptions} width='100%' dot={true} error={false} />
                                            </div>
                                        </div>

                                        <div className='table-responsive'>
                                            <Table striped hover bordered>
                                                <thead className='table-dark'>
                                                    <tr>
                                                        <th className='text-nowrap'>No.</th>
                                                        <th className='text-nowrap'>NOKID</th>
                                                        <th className='text-nowrap'>Name English</th>
                                                        <th className='text-nowrap'>Name Thai</th>
                                                        <th className='text-nowrap'>Position</th>
                                                        <th className='text-nowrap'>DepartmentID</th>
                                                        <th className='text-nowrap'>Supervisor</th>
                                                        <th className='text-nowrap'>UserType</th>
                                                        <th className='text-nowrap'>Email</th>
                                                        <th className='text-nowrap'>Level</th>
                                                        <th className='text-nowrap'>Status</th>
                                                        <th className='text-nowrap'>StartDate</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {CurrentRows.map((emp, index) => (
                                                        <tr key={index + 1}>
                                                            <td>{IndexOfFirstRow + index + 1}</td>
                                                            <td>{emp['employee_code']}</td>
                                                            <td>{emp['employee_nameen']}</td>
                                                            <td>{emp['employee_nameth']}</td>
                                                            <td>{emp['employee_position']}</td>
                                                            <td>{emp['employee_supervisor']}</td>
                                                            <td>{emp['department_id']}</td>
                                                            <td>{emp['employee_usertype']}</td>
                                                            <td>{emp['employee_email']}</td>
                                                            <td>{emp['employee_level']}</td>
                                                            <td>{emp['employee_status']}</td>
                                                            <td>{emp['employee_startdate']}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                        {TotalPages > 1 && (
                                            <Pagination CountEmployee={Employee.length} ItemsPerPage={RowsPerPage} CurrentNumberPage={CurrentPage} setCurrentNumberPage={setCurrentPage} />
                                        )}

                                        <div className='mt-4 midpoint'>
                                            <Button variant='warning' style={{ width: 150 }} onClick={SaveImportEmployee}>Save</Button>
                                        </div>
                                    </div>
                                )}
                            </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

export default Importemployee;