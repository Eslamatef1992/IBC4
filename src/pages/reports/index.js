import { router } from 'next/router';
import {useState, useEffect, useRef} from 'react';

const AccountsReport = ()=> {
    useEffect(() => {
        router.push('reports/summary-report');
    }, []);

    return (
        <></>
    );
}

export default AccountsReport;