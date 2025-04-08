
export type TipFormState = {
  message: string | null
  success: boolean
  errors?: {
    title?: string[]
    content?: string[]
  }
}

export type Tip = {
  id: number
  userId: number
  title: string
  slug: string
  likes: number
  dislikes: number
  content: string
  public: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    id: number
    name: string | null
    email: string | null
  }
}