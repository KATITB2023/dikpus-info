// Imports
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  BasicTracerProvider,
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  TraceIdRatioBasedSampler,
} from "@opentelemetry/sdk-trace-base";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";
import * as api from "@opentelemetry/api";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { Resource } from "@opentelemetry/resources";
import { env } from "~/env.mjs";

// Export the tracing
export function otelSetup() {
  const contextManager = new AsyncHooksContextManager().enable();
  api.context.setGlobalContextManager(contextManager);

  // Configure the console exporter
  const consoleExporter = new ConsoleSpanExporter();

  // Configure the trace provider
  const provider = new BasicTracerProvider({
    // Sampling with 10% of traces in production
    sampler: new TraceIdRatioBasedSampler(
      env.NODE_ENV === "production" ? 0.1 : 1
    ),
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "test-tracing-service",
      [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
    }),
  });

  // Configure how spans are processed and exported
  if (env.NODE_ENV === "production") {
    provider.addSpanProcessor(new BatchSpanProcessor(consoleExporter));
  } else {
    provider.addSpanProcessor(new SimpleSpanProcessor(consoleExporter));
  }

  // Register your auto-instrumentors
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [new PrismaInstrumentation()],
  });

  // Register the provider
  provider.register();
}
