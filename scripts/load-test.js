/**
 * 🚀 Script de Test de Charge - Florelle Beauty
 * 
 * Ce script simule 1000, 2000, puis 3000 utilisateurs simultanés
 * accédant à votre site web pour tester sa capacité.
 * 
 * INSTALLATION:
 *   Windows: winget install k6
 *   Ou: choco install k6
 * 
 * UTILISATION:
 *   k6 run load-test.js
 * 
 * ⚠️ IMPORTANT: Remplacez YOUR_SITE_URL par votre URL Vercel
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Metrics personnalisées
const errorRate = new Rate('errors');
const homepageLoadTime = new Trend('homepage_load_time');
const productPageLoadTime = new Trend('product_page_load_time');

// Configuration des scénarios de charge
export const options = {
    scenarios: {
        // Phase 1: 1000 utilisateurs pendant 30 secondes
        load_1000_users: {
            executor: 'constant-vus',
            vus: 1000,
            duration: '30s',
            startTime: '0s',
            gracefulStop: '5s',
        },
        // Pause de 10 secondes
        // Phase 2: 2000 utilisateurs pendant 30 secondes
        load_2000_users: {
            executor: 'constant-vus',
            vus: 2000,
            duration: '30s',
            startTime: '40s',
            gracefulStop: '5s',
        },
        // Pause de 10 secondes
        // Phase 3: 3000 utilisateurs pendant 30 secondes
        load_3000_users: {
            executor: 'constant-vus',
            vus: 3000,
            duration: '30s',
            startTime: '80s',
            gracefulStop: '5s',
        },
    },
    thresholds: {
        // Critères de succès
        http_req_duration: ['p(95)<3000'], // 95% des requêtes < 3 secondes
        http_req_failed: ['rate<0.05'],     // Moins de 5% d'échecs
        errors: ['rate<0.05'],              // Taux d'erreur < 5%
    },
};

// ⚠️ REMPLACEZ PAR VOTRE URL VERCEL
const BASE_URL = 'https://florelle-beauty.vercel.app';

// Pages à tester
const PAGES = [
    '/',
    '/shop/eyes',
    '/shop/lips',
    '/shop/face',
    '/shop/nails',
    '/about',
    '/contact',
];

// Fonction principale exécutée par chaque utilisateur virtuel
export default function () {
    group('Homepage Load', () => {
        const startTime = Date.now();
        const response = http.get(`${BASE_URL}/`);
        const loadTime = Date.now() - startTime;

        homepageLoadTime.add(loadTime);

        const success = check(response, {
            'Homepage status is 200': (r) => r.status === 200,
            'Homepage loads under 2s': (r) => r.timings.duration < 2000,
            'Homepage has content': (r) => r.body && r.body.length > 1000,
        });

        errorRate.add(!success);
    });

    sleep(1); // Pause d'1 seconde entre les actions (simule un vrai utilisateur)

    group('Browse Shop Categories', () => {
        // Choisir une page aléatoire
        const randomPage = PAGES[Math.floor(Math.random() * PAGES.length)];
        const startTime = Date.now();
        const response = http.get(`${BASE_URL}${randomPage}`);
        const loadTime = Date.now() - startTime;

        productPageLoadTime.add(loadTime);

        const success = check(response, {
            'Category page status is 200': (r) => r.status === 200,
            'Category page loads under 3s': (r) => r.timings.duration < 3000,
        });

        errorRate.add(!success);
    });

    sleep(Math.random() * 2 + 1); // Pause aléatoire 1-3 secondes
}

// Rapport de fin de test
export function handleSummary(data) {
    console.log('\n📊 RÉSUMÉ DU TEST DE CHARGE - Florelle Beauty\n');
    console.log('=====================================');

    const metrics = data.metrics;

    console.log(`\n🏠 Homepage:`);
    console.log(`   Temps moyen: ${metrics.homepage_load_time?.values?.avg?.toFixed(0) || 'N/A'}ms`);
    console.log(`   95e percentile: ${metrics.homepage_load_time?.values?.['p(95)']?.toFixed(0) || 'N/A'}ms`);

    console.log(`\n🛒 Pages Produits:`);
    console.log(`   Temps moyen: ${metrics.product_page_load_time?.values?.avg?.toFixed(0) || 'N/A'}ms`);
    console.log(`   95e percentile: ${metrics.product_page_load_time?.values?.['p(95)']?.toFixed(0) || 'N/A'}ms`);

    console.log(`\n📈 Global:`);
    console.log(`   Requêtes totales: ${metrics.http_reqs?.values?.count || 0}`);
    console.log(`   Taux d'erreur: ${(metrics.errors?.values?.rate * 100)?.toFixed(2) || 0}%`);
    console.log(`   Requêtes/seconde: ${metrics.http_reqs?.values?.rate?.toFixed(2) || 0}`);

    console.log('\n=====================================\n');

    return {
        'stdout': JSON.stringify(data, null, 2),
    };
}
