export interface CustomJwtPayload {
    exp: number;
    iat: number;
    result_employee: UserItem;
}

export interface ModalItem {
    ShowModal: boolean;
    handleCloseModal: () => void;
}

export interface UserItem {
    department_id: number;
    employee_annotation: string;
    employee_code: string;
    employee_created_at: string;
    employee_email: string;
    employee_id: number;
    employee_nameen: string;
    employee_nameth: string;
    employee_oid: string;
    employee_position: string;
    employee_level: string;
    employee_status: string;
    employee_image: string
    employee_supervisor: string;
    employee_usertype: string;
}

export interface DepartmentItem {
    department_id: number;
    department_code: number;
    department_name: string;
    department_supervisor: number;
}

export interface DepartmentNode extends DepartmentItem {
    children: DepartmentNode[];
}

export interface GroupItem {
    group_id: number;
    group_name: string;
}

export interface ApplicationItem {
    application_id: number;
    application_name: string;
    application_description: string;
    application_website: string;
    group_id: number;
    application_status: string;
}

export interface MemberItem {
    employee_id: number;
    user_id: number;
    user_code: string;
    employee_nameen: string;
    department_id: number;
}

export interface EmployeeItem {
    employee_id: number;
    employee_code: string;
    employee_nameen: string;
    employee_nameth: string;
    employee_position: string;
    employee_supervisor: string;
    employee_usertype: string;
    employee_email: string;
    employee_level: string;
    employee_status: string;
    employee_image: string;
    employee_annotation: string;
    employee_startdate: string;
    employee_enddate: string;
}

export interface EmployeeWithDepartment extends EmployeeItem, DepartmentItem {}

export interface PaginationItem {
    CountEmployee: number;
    ItemsPerPage: number;
    CurrentNumberPage: number;
    setCurrentNumberPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface EmailConfigItem {
    emailconfig_id: number;
    emailconfig_service: string;
    emailconfig_ipaddress: string;
    emailconfig_checkuser: number;
    emailconfig_user: string;
    emailconfig_apppass: string;
    emailconfig_address: string;
    emailconfig_name: string;
}

export interface EmailTemplateItem {
    emailtemplate_id?: number;
    emailtemplate_name: string;
    emailtemplate_subject: string;
    emailtemplate_description: string;
}