import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import type { CustomJwtPayload } from './interfaces';

const ACCESS: Record<string, { allowed: string[]; default: string }> = {
    admin: { allowed: ['/dashboard', '/application_setting', '/employee', '/addemployee', '/importemployee', '/probationemployee', '/employeeresign', '/department'], default: '/dashboard' }
};

const tokens = import.meta.env.VITE_TOKEN;
const Login_Path = new Set(['/', '/index']);    // หน้าเข้าสู่ระบบ

// ตัด / ท้าย path ให้เทียบง่าย
const normalizePath = (p: string) => {
    if (!p) return '/';
    const s = p.replace(/\/+$/, '');
    return s.length ? s : '/';
};

// เช็กสิทธิ์ตาม prefix (ตรง path หรือเป็น path ย่อย)
const hasAccess = (value: string, path: string) => {
    const rule = ACCESS[value];
    if (!rule) return false;
    return rule.allowed.some((base) => path === base || path.startsWith(base + '/'));
};

const AuthGuard = () => {
    const path = normalizePath(useLocation().pathname);
    const token = localStorage.getItem(tokens);
    const isLoginPage = Login_Path.has(path);
    // ยังไม่ล็อกอินให้เข้าได้เฉพาะหน้า /
    if (!token) return isLoginPage ? <Outlet /> : <Navigate to='/' replace />
    const decoded = jwtDecode<CustomJwtPayload>(token);
    if (!decoded?.result_employee?.employee_id) return isLoginPage ? <Outlet /> : <Navigate to='/' replace />
    // มี token ให้หากติกา
    const rule = ACCESS[decoded?.result_employee?.employee_usertype];
    // token เสีย หรือ level ไม่รู้จักให้กลับหน้า /
    if (!rule) return <Navigate to='/' replace />;
    // ล็อกอินแล้ว ไม่ให้เข้า / (index) ให้ส่งไป default ของ level
    if (isLoginPage) return <Navigate to={rule.default} replace />;
    // มีสิทธิ์ → แสดงหน้า; ไม่มีสิทธิ์ ให้ส่งไป default ของ level
    return hasAccess(decoded?.result_employee?.employee_usertype, path) ? <Outlet /> : <Navigate to={rule.default} replace />
}

export default AuthGuard;