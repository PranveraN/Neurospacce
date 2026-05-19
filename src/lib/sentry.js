import * as Sentry from '@sentry/react'

/**
 * Call once before ReactDOM.render(). No-ops when VITE_SENTRY_DSN is absent (local dev).
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,                          // 'development' | 'production'
    release:     import.meta.env.VITE_APP_VERSION ?? 'neurospace@0.0.0',

    integrations: [
      Sentry.browserTracingIntegration(),
      // Session Replay — uncomment + add VITE_SENTRY_REPLAY=true to enable
      // Sentry.replayIntegration({ maskAllText: true, blockAllMedia: false }),
    ],

    // Sample 20 % of traces in prod, 100 % locally (DSN present = staging/prod)
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,

    // Replay rates (only active when replayIntegration is enabled)
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,

    beforeSend(event) {
      // Strip any accidentally captured passwords or tokens from request bodies
      if (event.request?.data) {
        const d = event.request.data
        if (typeof d === 'object') {
          delete d.password
          delete d.token
          delete d.access_token
        }
      }
      return event
    },
  })
}

export { Sentry }
