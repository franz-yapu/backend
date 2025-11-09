import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50 },   // sube a 50 usuarios
    { duration: '30s', target: 200 },  // sube a 200 usuarios
    { duration: '20s', target: 0 },    // baja gradualmente
  ],
};

export default function () {
  const res = http.get('http://localhost:3001/api');
  check(res, {
    'status es 200': (r) => r.status === 200,
    'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
