import axios from 'axios';

import type { EmployeeItem, EmailConfigItem, EmailTemplateItem } from './interfaces';

const ipaddress = import.meta.env.VITE_IPADDRESS;

export const checkpermission = async (oid: string) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_CHECK_PERMISSION, { oid });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ออกจากระบบและเคลียร์ session ทุกอย่าง
export const logout = async () => {
    localStorage.removeItem(import.meta.env.VITE_TOKEN);
    globalThis.location.href = import.meta.env.VITE_REDIREACT_APPCENTER;
}

// ดึงข้อมูลทุกแผนก
export const get_department = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_DEPARTMENT);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
// ดึงกลุ่มการใช้งาน
export const get_group = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_GET_GROUP);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// บันทึกกลุ่มการใช้งาน
export const save_group = async (group_name: string, group_employee: number[]) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SAVE_GROUP, { group_name, group_employee });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทกลุ่มการใช้งาน
export const update_group = async (group_id: number, group_name: string, group_employee: number[]) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_GROUP, { group_id, group_name, group_employee });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบข้อมูล Group ออกไป
export const delete_group = async (group_id: number) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_GROUP + group_id);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูลมาเพื่อใช้ในหน้าจัดการแอพพลิเคชั่น 
export const get_application_setting = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_GET_APPLICATION_SETTING);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


// บันทึกข้อมูลเว็บไซต์
export const save_application = async (app_name: string, app_description: string, app_website: string, app_group: number, app_status: string) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SAVE_APPLICATION, { app_name, app_description, app_website, app_group, app_status });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// เมื่อมีการเลือก Select ในหน้าแอพพลิเคชั่นแล้ว ถ้ามีการเปลี่ยนแปลงจะทำการอัพเดทข้อมูลทันที
export const update_application_select = async (app_id: number, type: string, value: string | number) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_APPLICATION_SELECT, { app_id, type, value });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// แก้ไขข้อมูลเว็บไซต์
export const update_application = async (app_id: number, app_name: string, app_description: string, app_website: string) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_APPLICATION, { app_id, app_name, app_description, app_website });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบเว็บไซต์ที่ไม่ได้ใช้งานหรือการเพิ่มข้อมูลผิดพลาดออก
export const delete_application = async (app_id: number) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_APPLICATION + app_id);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูลรายชื่อพนักงาน
export const get_employee = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_EMPLOYEE);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทข้อมูลพนักงาน
export const update_employee = async (data: FormData) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_EMPLOYEE, data,  { headers: { 'Content-Type': 'multipart/form-data' }});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทข้อมูลพนักงาน
export const add_employee = async (data: FormData) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_ADD_EMPLOYEE, data, { headers: { 'Content-Type': 'multipart/form-data' }} );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทข้อมูลพนักงานด้วยไฟล์ CSV
export const add_employee_import = async (data: EmployeeItem[]) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_ADD_EMPLOYEE_IMPORT, data, { headers: { 'Content-Type': 'multipart/form-data' }});
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบข้อมูลพนักงานออกไป
export const delete_employee = async (emp_id: number) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_EMPLOYEE + emp_id);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// บันทึกข้อมูลแผนก
export const save_department = async (dept_code: number, dept_name: string, dept_supervisor: number) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SAVE_DEPARTMENT, { dept_name, dept_code, dept_supervisor });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทข้อมูลแผนก
export const update_move_department = async (departmentid: number, departmentto: number) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_MOVE_DEPARTMENT, { departmentid, departmentto });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทข้อมูลแผนก
export const update_department = async (departmentid: number, departmentcode: number, departmentname: string) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_DEPARTMENT, { departmentid, departmentcode, departmentname });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงการตั้งค่า Email Config
export const get_emailconfig = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_GET_EMAILCONFIG);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทข้อมูลการตั้งค่า Email Config
export const update_emailconfig = async (data: EmailConfigItem[]) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_EMAILCONFIG, { data });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ทดสอบ Email Service
export const test_emailservice = async (data: EmailConfigItem[], emailto: string, description: string) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_TEST_EMAILSERVICE, { data, emailto, description });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึง Template ของ Email มาทั้งหมด
export const get_emailtemplate = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_GET_EMAILTEMPLATE);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// บันทึก Email Template
export const save_emailtemplate = async (data: EmailTemplateItem[]) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SAVE_EMAILTEMPLATE, { data });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดท Template ของ Email
export const update_emailtemplate = async (data: EmailTemplateItem[]) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_EMAILTEMPLATE, { data });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงรายชื่อ Admin Nokintranest
export const get_admin_nokintranest = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_GET_ADMIN_NOKINTRANEST);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// บันทึกรายชื่อ Admin Nokintranest
export const save_admin_nokintranest = async (nokintranest_code: string, nokintranest_name: string, nokintranest_position: string, nokintranest_department: string) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SAVE_ADMIN_NOKINTRANEST, { nokintranest_code, nokintranest_name, nokintranest_position, nokintranest_department });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบรายชื่อ Admin Nokintranest
export const delete_admin_nokintranest = async (nokintranest_id: number) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_ADMIN_NOKINTRANEST + nokintranest_id);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูล Event ของการประเมินพนักงานภายในบริษัท
export const get_event = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_GET_EVENT);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// จัดการข้อมูล Event ของการประเมินพนักงานภายในบริษัท
export const manage_event = async (id: number, topic: string, description: string, evaluate: string, startdate: string, enddate: string, statussave: string) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_MANAGE_EVENT, { id, topic, description, evaluate, startdate, enddate, statussave });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบข้อมูล Event ออกไป
export const delete_event = async (event_id: number) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_EVENT + event_id);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงคำถามการประเมิน
export const get_question_evaluation = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_GET_QUESTION_EVALUATION);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทเปิด-ปิดการประเมิน
export const update_switch_evaluation = async (part: string, level: string, check: number) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_SWITCH_EVALUATION, { part, level, check });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// เพิ่มไฟล์ข้อกำหนดสำหรับการประเมิน
export const managefile_evaluation = async (data: FormData) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_MANAGE_FILE_EVALUATION, data,  { headers: { 'Content-Type': 'multipart/form-data' }});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// เพิ่มคำถามการประเมิน
export const save_question_evaluation = async (topic: string, weight: number, description: string, part: string, level: string) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SAVE_QUESTION_EVALUATION, { topic, weight, description, part, level });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทคำถามการประเมิน
export const update_question_evaluation = async (id: number, topic: string, weight: number, description: string) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_QUESTION_EVALUATION, { id, topic, weight, description });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบคำถามการประเมิน
export const delete_question_evaluation = async (part_id: number) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_QUESTION_EVALUATION + part_id);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}