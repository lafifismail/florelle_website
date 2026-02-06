/**
 * Test de Charge LEGER - Florelle Beauty
 * Test progressif: 50 -> 100 -> 200 utilisateurs
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 50 },
        { duration: '20s', target: 50 },
        { duration: '10s', target: 100 },
        { duration: '20s', target: 100 },
        { duration: '10s', target: 200 },
        { duration: '20s', target: 200 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<5000'],
        http_req_failed: ['rate<0.1'],
    },
};

const BASE_URL = 'https://florelle.ma';

const PAGES = [
    '/',
    '/shop/eyes',
    '/shop/lips',
    '/about',
    '/contact',
];

export default function () {
    const page = PAGES[Math.floor(Math.random() * PAGES.length)];

    const response = http.get(BASE_URL + page, {
        timeout: '30s',
    });

    check(response, {
        'Status 200': (r) => r.status === 200,
        'Load < 5s': (r) => r.timings.duration < 5000,
    });

    sleep(1 + Math.random() * 2);
}
