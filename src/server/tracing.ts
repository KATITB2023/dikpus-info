import { type Tracer, trace } from '@opentelemetry/api';
import { otelSetup } from '~/server/setup';

// This is a helper function that instantiates OpenTelemetry Tracer
const instantiateTracer = () => {
  otelSetup();

  return trace.getTracer('server');
};

const globalForTracer = globalThis as unknown as {
  tracer: Tracer | undefined;
};

export const tracer = globalForTracer.tracer ?? instantiateTracer();

if (process.env.NODE_ENV !== 'production') globalForTracer.tracer = tracer;
