import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import type { PaginationItem } from './interfaces';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = (item: PaginationItem) => {
    const { CountEmployee, ItemsPerPage, CurrentNumberPage, setCurrentNumberPage } = item

    // Pagination
    const TotalPages = Math.ceil(CountEmployee / ItemsPerPage);
    const StartIndex = (CurrentNumberPage - 1) * ItemsPerPage;
    const EndIndex = StartIndex + ItemsPerPage;

    return (
        <Row className='align-items-center mt-3'>
            <Col md={6} className='mb-2 mb-md-0'>
                <small className='text-muted'>
                    Showing {StartIndex + 1} - {Math.min(EndIndex, CountEmployee)} of {CountEmployee} entries
                </small>
            </Col>
            <Col md={6}>
                <nav>
                    <ul className='pagination pagination-sm justify-content-md-end justify-content-center mb-0'>
                        <li className={`page-item ${CurrentNumberPage === 1 ? 'disabled' : ''}`}>
                            <button className='page-link' onClick={() => setCurrentNumberPage(1)}>
                                <ChevronsLeft size={16} />
                            </button>
                        </li>
                        <li className={`page-item ${CurrentNumberPage === 1 ? 'disabled' : ''}`}>
                            <button className='page-link' onClick={() => setCurrentNumberPage(p => Math.max(1, p - 1))}>
                                <ChevronLeft size={16} />
                            </button>
                        </li>
                        {Array.from({ length: Math.min(5, TotalPages) }, (_, i) => {
                            let pageNum: number;

                            if (TotalPages <= 5) pageNum = i + 1;
                            else if (CurrentNumberPage <= 3) pageNum = i + 1;
                            else if (CurrentNumberPage >= TotalPages - 2) pageNum = TotalPages - 4 + i;
                            else pageNum = CurrentNumberPage - 2 + i;

                            return (
                                <li key={i} className={`page-item ${CurrentNumberPage === pageNum ? 'active' : ''}`}>
                                    <button className='page-link' onClick={() => setCurrentNumberPage(pageNum)}>
                                        {pageNum}
                                    </button>
                                </li>
                            );
                        })}

                        <li className={`page-item ${CurrentNumberPage === TotalPages ? 'disabled' : ''}`}>
                            <button className='page-link' onClick={() => setCurrentNumberPage(p => Math.min(TotalPages, p + 1))}>
                                <ChevronRight size={16} />
                            </button>
                        </li>
                        <li className={`page-item ${CurrentNumberPage === TotalPages ? 'disabled' : ''}`}>
                            <button className='page-link' onClick={() => setCurrentNumberPage(TotalPages)}>
                                <ChevronsRight size={16} />
                            </button>
                        </li>
                    </ul>
                </nav>
            </Col>
        </Row>
    )
}

export default Pagination;