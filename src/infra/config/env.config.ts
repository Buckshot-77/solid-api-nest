import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_DB: z.string(),
  PGDATA: z.string(),

  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
