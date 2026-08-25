import { describe, expect, it } from 'vitest';

import {
  createChangeClinicManagerSchema,
  resolveChangeClinicManagerId,
} from '@/features/clinics/schemas/change-clinic-manager-schema';

const t = ((key: string) => key) as unknown as Parameters<
  typeof createChangeClinicManagerSchema
>[0];

const doctorId = '11111111-1111-1111-1111-111111111111';

describe('createChangeClinicManagerSchema', () => {
  it('accepts a valid clinic manager id', () => {
    const result = createChangeClinicManagerSchema(t).safeParse({
      clinicManagerId: doctorId,
    });

    expect(result.success).toBe(true);
  });

  it('rejects an empty clinic manager id', () => {
    const result = createChangeClinicManagerSchema(t).safeParse({
      clinicManagerId: '',
    });

    expect(result.success).toBe(false);
  });
});

describe('resolveChangeClinicManagerId', () => {
  it('trims the selected manager id', () => {
    expect(
      resolveChangeClinicManagerId({
        clinicManagerId: `  ${doctorId}  `,
      }),
    ).toBe(doctorId);
  });
});
