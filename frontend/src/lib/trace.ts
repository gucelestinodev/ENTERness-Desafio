export const TRACE_ID =
  sessionStorage.getItem("trace_id") ??
  (() => {
    const id = Math.random().toString(16).slice(2)
    sessionStorage.setItem("trace_id", id)
    return id
  })()
  