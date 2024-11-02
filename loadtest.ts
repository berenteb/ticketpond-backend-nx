import { check, sleep } from 'k6';
import { get } from 'k6/http';

export const options = {
  thresholds: {
    http_req_duration: ['p(99) < 3000'],
  },
  stages: [
    { duration: '30s', target: 30 },
    { duration: '1m', target: 200 },
    { duration: '1m', target: 500 },
    { duration: '1m', target: 1000 },
    { duration: '5m', target: 1000 },
    { duration: '30s', target: 500 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = get('http://localhost/experience');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
