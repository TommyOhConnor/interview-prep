const KEY = 'interview-prep-uid'

export function getUserId(): string {
  // Allow seeding the UID via ?uid= query param (for cross-device sync)
  const params = new URLSearchParams(window.location.search)
  const paramUid = params.get('uid')
  if (paramUid) {
    localStorage.setItem(KEY, paramUid)
    // Clean the param from the URL without a page reload
    const url = new URL(window.location.href)
    url.searchParams.delete('uid')
    window.history.replaceState({}, '', url.toString())
  }

  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}
