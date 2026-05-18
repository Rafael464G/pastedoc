export type Template = 'meeting_notes' | 'sow' | 'brief' | 'job_post' | 'general'

export type DocSection = {
  heading: string
  content: string
}

export type DocResult = {
  title: string
  sections: DocSection[]
}

export type UserProfile = {
  id: string
  subscription_status: 'free' | 'pro'
  exports_used: number
}
