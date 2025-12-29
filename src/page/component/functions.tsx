// ทำกรอบแดงเพื่อเตือนว่ายังไม่มีข้อมูลที่ต้องการสำหรับ input
export const checkvalueinput = (element: HTMLElement, value: string | number) => {
    if (value) {
        element.style.border = '1px solid rgb(222, 226, 230)';
    } else {
        element.style.border = '2px solid red';
    }
}

// ทำกรอบแดงเพื่อเตือนว่ายังไม่มีข้อมูลที่ต้องการสำหรับ select
export const checkvalueselect = (value: string | number) => {
    if (value) {
        return false;
    } else {
        return true
    }
}

// แปลงวันที่ให้เป็นรูปแบบไทย
export const FormatDate = (textdate: string) => {
    const d = new Date(textdate);
    return Number.isNaN(d.getTime()) ? '-' : textdate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1');
};

// เวลาการทำงาน
export const WorkTime = (startdate: string) => {
    const d = new Date(startdate).getTime();
    if (Number.isNaN(d)) return '-'; // วันที่ไม่ถูกต้อง
    const days = Math.floor((Date.now() - d) / 86400000); // จำนวนวันทั้งหมด
    const years = Math.floor(days / 365); // ปี
    const remain = days % 365; // วันที่เหลือจากปี
    return years > 0 ? `${years} years and ${remain} days` : `${remain} days`;
};

// เช็คเวลาสำหรับพนักงานทดลองงาน
export const RemainingDays = (startdate: string, daystarget = 119) => {
    const s = new Date(startdate);
    if (Number.isNaN(s.getTime())) return '-';
    // คิดเป็นจำนวนวันแบบ UTC กันปัญหา timezone
    const today = new Date();
    const toUTC = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.floor((toUTC(today) - toUTC(s)) / 86400000); // วันนี้ - start
    // ยังไม่ครบ -> บวก, เกินแล้ว -> ติดลบ
    const remaining = daystarget - diffDays;
    return remaining; // จะได้บวกหรือลบตามจริง
};

