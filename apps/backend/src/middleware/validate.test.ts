import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { validate, validateRequest } from './validate';

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

test('validate should parse valid body and call next', () => {
  const schema = z.object({ name: z.string().min(1) });
  const middleware = validate(schema);
  const req = { body: { name: 'ok' } } as any;
  const { res, result } = createRes();
  let called = false;

  middleware(req, res as any, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(result.statusCode, undefined);
  assert.equal(req.body.name, 'ok');
});

test('validate should return formatted zod errors for invalid body', () => {
  const schema = z.object({ name: z.string().min(2) });
  const middleware = validate(schema);
  const req = { body: { name: 'x' } } as any;
  const { res, result } = createRes();

  middleware(req, res as any, () => {});

  assert.equal(result.statusCode, 400);
  assert.equal((result.body as any).success, false);
  assert.equal((result.body as any).error, 'Validation failed');
  assert.equal((result.body as any).details[0].field, 'name');
});

test('validateRequest should parse body, query and params and call next', () => {
  const middleware = validateRequest({
    body: z.object({ stock: z.coerce.number().int() }),
    query: z.object({ page: z.coerce.number().int().min(1) }),
    params: z.object({ id: z.string().min(1) }),
  });
  const req = {
    body: { stock: '5' },
    query: { page: '2' },
    params: { id: 'abc' },
  } as any;
  const { res, result } = createRes();
  let called = false;

  middleware(req, res as any, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(result.statusCode, undefined);
  assert.equal(req.body.stock, 5);
  assert.equal(req.query.page, 2);
  assert.equal(req.params.id, 'abc');
});

test('validateRequest should return formatted zod errors', () => {
  const middleware = validateRequest({
    query: z.object({ page: z.coerce.number().int().min(1) }),
  });
  const req = { body: {}, query: { page: '0' }, params: {} } as any;
  const { res, result } = createRes();

  middleware(req, res as any, () => {});

  assert.equal(result.statusCode, 400);
  assert.equal((result.body as any).success, false);
  assert.equal((result.body as any).error, 'Validation failed');
  assert.equal((result.body as any).details[0].field, 'page');
});
