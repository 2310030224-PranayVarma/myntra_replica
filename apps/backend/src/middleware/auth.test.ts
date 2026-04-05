import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticate, requireAdmin } from './auth';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../types';

const createRes = () => {
  const result: { statusCode?: number; body?: unknown } = {};
  return {
    result,
    res: {
      status(code: number) {
        result.statusCode = code;
        return this;
      },
      json(payload: unknown) {
        result.body = payload;
        return this;
      },
    },
  };
};

test('authenticate should reject missing token', () => {
  const req = { headers: {} } as unknown as AuthRequest;
  const { res, result } = createRes();
  let called = false;

  authenticate(req, res as any, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(result.statusCode, 401);
  assert.deepEqual(result.body, { success: false, error: 'No token provided' });
});

test('authenticate should reject invalid token', () => {
  const req = { headers: { authorization: 'Bearer invalid-token' } } as unknown as AuthRequest;
  const { res, result } = createRes();

  authenticate(req, res as any, () => {});

  assert.equal(result.statusCode, 401);
  assert.deepEqual(result.body, { success: false, error: 'Invalid or expired token' });
});

test('authenticate should set req.user and call next on valid token', () => {
  const token = signToken({ userId: 'u1', email: 'a@b.com', role: 'USER' });
  const req = { headers: { authorization: `Bearer ${token}` } } as unknown as AuthRequest;
  const { res, result } = createRes();
  let called = false;

  authenticate(req, res as any, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(result.statusCode, undefined);
  assert.equal(req.user?.userId, 'u1');
  assert.equal(req.user?.email, 'a@b.com');
  assert.equal(req.user?.role, 'USER');
});

test('requireAdmin should reject non-admin', () => {
  const req = { user: { userId: 'u1', email: 'a@b.com', role: 'USER' } } as AuthRequest;
  const { res, result } = createRes();
  let called = false;

  requireAdmin(req, res as any, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(result.statusCode, 403);
  assert.deepEqual(result.body, { success: false, error: 'Admin access required' });
});

test('requireAdmin should call next for admin user', () => {
  const req = { user: { userId: 'u1', email: 'a@b.com', role: 'ADMIN' } } as AuthRequest;
  const { res, result } = createRes();
  let called = false;

  requireAdmin(req, res as any, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(result.statusCode, undefined);
});
